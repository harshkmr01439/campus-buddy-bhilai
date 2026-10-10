import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Badge, BoardList, Card, PageIntro, PostForm, useBoardRows } from "@/components/CommunityBoard";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"];

export const Route = createFileRoute("/mess")({
  head: () => ({
    meta: [
      { title: "Mess Menu & Food — CampusBuddy" },
      { name: "description", content: "Daily mess menu, meal timings and food details, updated by students." },
      { property: "og:title", content: "Mess Menu & Food — CampusBuddy" },
      { property: "og:description", content: "Daily mess menu and meal timings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const q = useBoardRows("mess_menu", "created_at", true);
  const sorted = q.data
    ? [...q.data].sort(
        (a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || MEALS.indexOf(a.meal) - MEALS.indexOf(b.meal),
      )
    : q.data;
  return (
    <>
      <PageIntro title="Mess Menu & Food" subtitle="What's cooking today, and when. Anyone can add or update a meal.">
        <PostForm
          table="mess_menu"
          buttonLabel="Add a meal"
          fields={[
            { name: "day", label: "Day", type: "select", options: DAYS.map((d) => ({ value: d, label: d })) },
            { name: "meal", label: "Meal", type: "select", options: MEALS.map((d) => ({ value: d, label: d })) },
            { name: "timing", label: "Timing", max: 40, placeholder: "e.g. 7:30 – 9:30 AM" },
            { name: "posted_by", label: "Your name", max: 80 },
            { name: "items", label: "Food items", type: "textarea", required: true, max: 500, placeholder: "Comma separated" },
          ]}
        />
      </PageIntro>
      <BoardList
        query={{ ...q, data: sorted } as typeof q}
        empty="No menu posted yet."
        render={(r) => (
          <Card key={r.id}>
            <div className="flex items-center gap-2">
              <Badge tone="primary">{r.day}</Badge>
              <Badge>{r.meal}</Badge>
            </div>
            <p className="mt-3 font-medium">{r.items}</p>
            {r.timing && (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />{r.timing}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">by {r.posted_by}</p>
          </Card>
        )}
      />
    </>
  );
}
