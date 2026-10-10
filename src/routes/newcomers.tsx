import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge, BoardList, Card, PageIntro, PostForm, useBoardRows } from "@/components/CommunityBoard";

const KINDS = [
  { value: "study", label: "Study material" },
  { value: "mistake", label: "Mistake to avoid" },
  { value: "tip", label: "General tip" },
];

export const Route = createFileRoute("/newcomers")({
  head: () => ({
    meta: [
      { title: "Newcomer Guide — CampusBuddy" },
      { name: "description", content: "Study material to follow and mistakes to avoid, shared by seniors for new students." },
      { property: "og:title", content: "Newcomer Guide — CampusBuddy" },
      { property: "og:description", content: "Study material and mistakes to avoid for new students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const q = useBoardRows("newcomer_tips");
  const [filter, setFilter] = useState<string>("all");
  const filtered = { ...q, data: filter === "all" ? q.data : q.data?.filter((r) => r.kind === filter) } as typeof q;

  return (
    <>
      <PageIntro title="Newcomer Guide" subtitle="New on campus? Seniors share which study material to follow and what mistakes to avoid. Anyone can add advice.">
        <PostForm
          table="newcomer_tips"
          buttonLabel="Share advice"
          fields={[
            { name: "kind", label: "Type", type: "select", options: KINDS },
            { name: "title", label: "Title", required: true, max: 150 },
            { name: "link", label: "Link (optional)", max: 300, placeholder: "https://…" },
            { name: "posted_by", label: "Your name / year", max: 80 },
            { name: "body", label: "Advice", type: "textarea", required: true, max: 2000 },
          ]}
        />
      </PageIntro>
      <div className="mb-5 flex flex-wrap gap-2">
        {[{ value: "all", label: "All" }, ...KINDS].map((k) => (
          <button
            key={k.value}
            onClick={() => setFilter(k.value)}
            className={`rounded-full border px-3 py-1 text-sm ${filter === k.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <BoardList
        query={filtered}
        empty="No advice here yet."
        render={(r) => (
          <Card key={r.id}>
            <Badge tone={r.kind === "mistake" ? "pin" : r.kind === "study" ? "primary" : "muted"}>
              {KINDS.find((k) => k.value === r.kind)?.label}
            </Badge>
            <h4 className="mt-2 font-semibold">{r.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            {/^https?:\/\//.test(r.link) && (
              <a href={r.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline">
                Open resource <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <p className="mt-2 text-xs text-muted-foreground">by {r.posted_by}</p>
          </Card>
        )}
      />
    </>
  );
}
