import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  CalendarClock,
  CheckSquare,
  FileUp,
  Loader2,
  MailOpen,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  analyzePdf,
  type AnalysisResult,
  type DocType,
} from "@/lib/analyze-pdf.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusBuddy — Notices, timetables and circulars" },
      {
        name: "description",
        content:
          "Upload PDF notices, timetables and circulars. CampusBuddy extracts the key dates, deadlines and action items into a clean summary.",
      },
      { property: "og:title", content: "CampusBuddy" },
      {
        property: "og:description",
        content:
          "Upload PDF notices, timetables and circulars and get instant summaries with dates, deadlines and action items.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const DOC_TYPES: { value: DocType; label: string; icon: typeof Bell; hint: string }[] = [
  { value: "notice", label: "Notice", icon: Bell, hint: "Announcements & events" },
  { value: "timetable", label: "Timetable", icon: CalendarDays, hint: "Class & exam schedules" },
  { value: "circular", label: "Circular", icon: MailOpen, hint: "Official instructions" },
];

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}

function Index() {
  const [docType, setDocType] = useState<DocType>("notice");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    setError(null);
    setFile(f);
  };

  const analyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fileBase64 = await readFileAsBase64(file);
      const res = await analyzePdf({
        data: { fileName: file.name, fileBase64, docType },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <section className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Notices are everywhere, and easy to miss.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            CampusBuddy reads notices, timetables and circulars, and tells students only what matters to them.
          </p>
        </section>

        {/* Document type picker */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {DOC_TYPES.map(({ value, label, icon: Icon, hint }) => (
            <button
              key={value}
              onClick={() => setDocType(value)}
              className={`rounded-xl border p-4 text-left transition-all ${
                docType === value
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <div className="mt-2 text-sm font-semibold">{label}</div>
              <div
                className={`text-xs ${
                  docType === value ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {hint}
              </div>
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging
              ? "border-primary bg-accent/40"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <FileUp className="h-8 w-8 text-muted-foreground" />
          {file ? (
            <>
              <p className="mt-3 font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB — click to choose a different file
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 font-medium">Drop your PDF here, or click to browse</p>
              <p className="text-xs text-muted-foreground">PDF files up to 20 MB</p>
            </>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          onClick={analyze}
          disabled={!file || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Reading your {docType}…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Extract & summarize
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <section className="mt-10 space-y-6">
            <div className="card-pinned animate-pin-in rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {result.docType} · summary
              </p>
              <h3 className="mt-1 text-2xl font-semibold">{result.documentTitle}</h3>
              <p className="mt-3 leading-relaxed text-foreground/90">
                {result.overallSummary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {result.items.map((item, i) => (
                <article
                  key={i}
                  className="card-pinned animate-pin-in rounded-xl border border-border bg-card p-5"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold leading-snug">{item.title}</h4>
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-pin" />
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm">
                    {item.date && (
                      <p className="flex items-center gap-2 text-foreground/80">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {item.date}
                      </p>
                    )}
                    {item.deadline && (
                      <p className="flex items-center gap-2 font-medium text-destructive">
                        <CalendarClock className="h-4 w-4" />
                        Deadline: {item.deadline}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  {item.actionItems.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {item.actionItems.map((action, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-foreground/90"
                        >
                          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
