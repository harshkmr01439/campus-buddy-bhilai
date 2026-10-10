import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type TableName =
  | "lost_found"
  | "mess_menu"
  | "complaints"
  | "clubs"
  | "club_events"
  | "newcomer_tips";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "date";
  options?: { value: string; label: string }[];
  required?: boolean;
  max?: number;
  placeholder?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export function useBoardRows(table: TableName, orderBy = "created_at", ascending = false) {
  return useQuery({
    queryKey: ["board", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending });
      if (error) throw error;
      return data as Row[];
    },
  });
}

export function PostForm({
  table,
  fields,
  buttonLabel,
}: {
  table: TableName;
  fields: Field[];
  buttonLabel: string;
}) {
  const qc = useQueryClient();
  const initial = Object.fromEntries(
    fields.map((f) => [f.name, f.type === "select" ? f.options![0].value : ""]),
  );
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(initial);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Row = {};
      for (const f of fields) {
        const v = (values[f.name] ?? "").trim();
        if (f.required && !v) throw new Error(`${f.label} is required`);
        if (v.length > (f.max ?? 1000)) throw new Error(`${f.label} is too long`);
        if (v) payload[f.name] = v;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from(table).insert(payload as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Posted! Everyone can see it now.");
      setValues(initial);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["board", table] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not post"),
  });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> {buttonLabel}
      </button>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="card-pinned w-full rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{buttonLabel}</h3>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.name}
            className={`text-sm ${f.type === "textarea" ? "sm:col-span-2" : ""}`}
          >
            <span className="mb-1 block font-medium">
              {f.label}
              {f.required && <span className="text-destructive"> *</span>}
            </span>
            {f.type === "textarea" ? (
              <textarea
                rows={3}
                maxLength={f.max ?? 1000}
                placeholder={f.placeholder}
                className={inputCls}
                value={values[f.name]}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              />
            ) : f.type === "select" ? (
              <select
                className={inputCls}
                value={values[f.name]}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              >
                {f.options!.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type === "date" ? "date" : "text"}
                maxLength={f.max ?? 1000}
                placeholder={f.placeholder}
                className={inputCls}
                value={values[f.name]}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Post
      </button>
    </form>
  );
}

export function PageIntro({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}

export function BoardList({
  query,
  render,
  empty,
}: {
  query: ReturnType<typeof useBoardRows>;
  render: (row: Row) => ReactNode;
  empty: string;
}) {
  if (query.isLoading)
    return <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-muted-foreground" />;
  if (query.error)
    return <p className="text-sm text-destructive">Could not load posts. Try refreshing.</p>;
  if (!query.data?.length)
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  return <div className="grid gap-4 sm:grid-cols-2">{query.data.map(render)}</div>;
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <article className="card-pinned animate-pin-in rounded-xl border border-border bg-card p-5">
      {children}
    </article>
  );
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "pin" | "primary" }) {
  const cls =
    tone === "pin"
      ? "bg-pin text-pin-foreground"
      : tone === "primary"
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export function timeAgo(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
