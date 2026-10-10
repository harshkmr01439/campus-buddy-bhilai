import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Mail, MapPin } from "lucide-react";
import { Badge, BoardList, Card, PageIntro, PostForm, useBoardRows } from "@/components/CommunityBoard";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs & Events — CampusBuddy" },
      { name: "description", content: "Campus clubs and their upcoming events, all in one place." },
      { property: "og:title", content: "Clubs & Events — CampusBuddy" },
      { property: "og:description", content: "Campus clubs and upcoming club events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const events = useBoardRows("club_events", "event_date", true);
  const clubs = useBoardRows("clubs", "name", true);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = { ...events, data: events.data?.filter((e) => e.event_date >= today) } as typeof events;

  return (
    <>
      <PageIntro title="Upcoming Club Events" subtitle="Don't miss what's happening on campus. Sign in to add an event.">
        <PostForm
          table="club_events"
          buttonLabel="Add an event"
          requiresAuth
          fields={[
            { name: "club_name", label: "Club", required: true, max: 80 },
            { name: "title", label: "Event title", required: true, max: 150 },
            { name: "event_date", label: "Date", type: "date", required: true },
            { name: "venue", label: "Venue", max: 120 },
            { name: "description", label: "Details", type: "textarea" },
          ]}
        />
      </PageIntro>
      <BoardList
        query={upcoming}
        empty="No upcoming events."
        render={(r) => (
          <Card key={r.id}>
            <Badge tone="pin">{r.club_name}</Badge>
            <h4 className="mt-2 font-semibold">{r.title}</h4>
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" />
                {new Date(r.event_date + "T00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </p>
              {r.venue && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{r.venue}</p>}
            </div>
            {r.description && <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>}
          </Card>
        )}
      />

      <div className="mt-14">
        <PageIntro title="Clubs" subtitle="Find your people. Sign in to add your club if it's missing.">
          <PostForm
            table="clubs"
            buttonLabel="Add a club"
            requiresAuth
            fields={[
              { name: "name", label: "Club name", required: true, max: 80 },
              { name: "category", label: "Category", type: "select", options: ["Technical", "Cultural", "Sports", "Literary", "General"].map((c) => ({ value: c, label: c })) },
              { name: "contact", label: "Contact", max: 120 },
              { name: "description", label: "About", type: "textarea" },
            ]}
          />
        </PageIntro>
        <BoardList
          query={clubs}
          empty="No clubs yet."
          render={(r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{r.name}</h4>
                <Badge>{r.category}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
              {r.contact && <p className="mt-2 flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{r.contact}</p>}
            </Card>
          )}
        />
      </div>
    </>
  );
}
