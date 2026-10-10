import { createServerFn } from "@tanstack/react-start";

export type DocType = "notice" | "timetable" | "circular";

export interface ExtractedItem {
  title: string;
  date: string | null;
  deadline: string | null;
  summary: string;
  actionItems: string[];
  tags: string[];
}

export interface AnalysisResult {
  docType: DocType;
  documentTitle: string;
  overallSummary: string;
  items: ExtractedItem[];
}

const PROMPTS: Record<DocType, string> = {
  notice:
    "This PDF is a NOTICE (announcement from a school/college/organization).",
  timetable:
    "This PDF is a TIMETABLE (class schedule, exam schedule, or event schedule).",
  circular:
    "This PDF is a CIRCULAR (official communication with instructions or policy).",
};

export const analyzePdf = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { fileName: string; fileBase64: string; docType: DocType }) => {
      if (!input.fileBase64 || !input.docType) {
        throw new Error("Missing PDF data or document type");
      }
      return input;
    },
  )
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI key is not configured");

    const schema = {
      type: "object",
      additionalProperties: false,
      required: ["documentTitle", "overallSummary", "items"],
      properties: {
        documentTitle: { type: "string" },
        overallSummary: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "date", "deadline", "summary", "actionItems", "tags"],
            properties: {
              title: { type: "string" },
              date: { type: ["string", "null"] },
              deadline: { type: ["string", "null"] },
              summary: { type: "string" },
              actionItems: { type: "array", items: { type: "string" } },
              tags: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    };

    const body = {
      model: "anthropic/claude-sonnet-5",
      max_tokens: 8000,
      stream: true,
      system:
        "You extract and summarize information from institutional documents. " +
        "Always respond with a single JSON object matching the requested schema. No markdown, no prose outside the JSON.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: data.fileBase64,
              },
            },
            {
              type: "text",
              text:
                `${PROMPTS[data.docType]} Read it carefully and extract the key information. ` +
                `Return JSON with this exact shape: ${JSON.stringify(schema)}. ` +
                "Rules: documentTitle = the document's own title or a short descriptive one. " +
                "overallSummary = 2-3 sentence plain-language summary of the whole document. " +
                "items = one entry per distinct announcement, event, subject/period, or instruction. " +
                "date = when something happens (ISO date or readable string), deadline = last date to act, null if none. " +
                "actionItems = concrete things a reader must do. tags = 1-3 short lowercase labels like 'exam', 'fee', 'holiday'.",
            },
          ],
        },
      ],
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `AI request failed (${response.status}): ${text.slice(0, 300)}`,
      );
    }

    // Consume the SSE stream server-side and accumulate the text deltas.
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulated = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        const line = frame
          .split("\n")
          .find((l) => l.startsWith("data:"));
        if (!line) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload);
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta"
          ) {
            accumulated += event.delta.text;
          }
        } catch {
          // ignore incomplete frames
        }
      }
    }

    const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("The AI did not return a readable summary. Try again.");
    }

    const parsed = JSON.parse(jsonMatch[0]) as Omit<AnalysisResult, "docType">;
    return { ...parsed, docType: data.docType };
  });
