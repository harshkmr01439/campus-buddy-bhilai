import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { Badge, BoardList, Card, PageIntro, PostForm, timeAgo, useBoardRows } from "@/components/CommunityBoard";

export const Route = createFileRoute("/lost-found")({
  head: () => ({
    meta: [
      { title: "Lost & Found — CampusBuddy" },
      { name: "description", content: "Post lost or found items on campus and help them get back to their owners." },
      { property: "og:title", content: "Lost & Found — CampusBuddy" },
      { property: "og:description", content: "Post lost or found items on campus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const q = useBoardRows("lost_found");
  return (
    <>
      <PageIntro title="Lost & Found" subtitle="Lost something or found something? Post it here — sign in to add an item.">
        <PostForm
          table="lost_found"
          buttonLabel="Add lost / found item"
          requiresAuth
          fields={[
            { name: "kind", label: "Type", type: "select", options: [{ value: "lost", label: "I lost it" }, { value: "found", label: "I found it" }] },
            { name: "item", label: "Item", required: true, max: 120, placeholder: "e.g. Black water bottle" },
            { name: "location", label: "Where", max: 120, placeholder: "e.g. Library 2nd floor" },
            { name: "contact", label: "Contact", required: true, max: 120, placeholder: "Phone or email" },
            { name: "posted_by", label: "Your name", max: 80 },
            { name: "description", label: "Details", type: "textarea" },
          ]}
        />
      </PageIntro>
      <BoardList
        query={q}
        empty="No items posted yet."
        render={(r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between">
              <Badge tone={r.kind === "lost" ? "pin" : "primary"}>{r.kind === "lost" ? "Lost" : "Found"}</Badge>
              <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
            </div>
            <h4 className="mt-2 font-semibold">{r.item}</h4>
            {r.description && <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>}
            <div className="mt-3 space-y-1 text-sm">
              {r.location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{r.location}</p>}
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{r.contact}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">by {r.posted_by}</p>
          </Card>
        )}
      />
    </>
  );
}
