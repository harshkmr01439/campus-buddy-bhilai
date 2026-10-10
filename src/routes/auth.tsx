import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CampusBuddy" },
      { name: "description", content: "Sign in to CampusBuddy to post and manage campus boards." },
      { property: "og:title", content: "Sign in — CampusBuddy" },
      { property: "og:description", content: "Sign in to CampusBuddy to post and manage campus boards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Sign-in failed. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <GraduationCap className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold tracking-tight">Sign in to CampusBuddy</h2>
      <p className="mt-3 text-muted-foreground">
        One tap with your Google account. You need to sign in to raise complaints, post lost &amp;
        found items, or add clubs and events.
      </p>
      <button
        onClick={signIn}
        disabled={busy}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Continue with Google
      </button>
    </div>
  );
}
