import { createFileRoute } from "@tanstack/react-router";
import { AuthGate, Badge, BoardList, Card, PageIntro, PostForm, timeAgo, useBoardRows } from "@/components/CommunityBoard";
import { useAuth } from "@/hooks/useAuth";

const CATS = ["Mess", "Hostel", "Academics", "Wi-Fi", "Transport", "General"];

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints & Queries — CampusBuddy" },
      { name: "description", content: "Raise a complaint or ask a query about mess, hostel, academics and more." },
      { property: "og:title", content: "Complaints & Queries — CampusBuddy" },
      { property: "og:description", content: "Raise complaints or ask queries openly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const q = useBoardRows("complaints");
  return (
    <>
      <PageIntro title="Complaints & Queries" subtitle="Something wrong, or have a question? Post it — open to everyone.">
        <PostForm
          table="complaints"
          buttonLabel="Raise complaint / query"
          fields={[
            { name: "kind", label: "Type", type: "select", options: [{ value: "complaint", label: "Complaint" }, { value: "query", label: "Query" }] },
            { name: "category", label: "Category", type: "select", options: CATS.map((c) => ({ value: c, label: c })) },
            { name: "subject", label: "Subject", required: true, max: 150 },
            { name: "posted_by", label: "Your name (optional)", max: 80 },
            { name: "details", label: "Details", type: "textarea", required: true, max: 2000 },
          ]}
        />
      </PageIntro>
      <BoardList
        query={q}
        empty="No complaints or queries yet."
        render={(r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge tone={r.kind === "complaint" ? "pin" : "primary"}>{r.kind === "complaint" ? "Complaint" : "Query"}</Badge>
                <Badge>{r.category}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
            </div>
            <h4 className="mt-2 font-semibold">{r.subject}</h4>
            <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.details}</p>
            <p className="mt-2 text-xs text-muted-foreground">by {r.posted_by}</p>
          </Card>
        )}
      />
    </>
  );
}
