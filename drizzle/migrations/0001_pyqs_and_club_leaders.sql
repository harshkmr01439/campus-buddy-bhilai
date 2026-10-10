ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS leader text NOT NULL DEFAULT '';
CREATE TABLE public.pyqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  teacher text NOT NULL,
  exam text NOT NULL DEFAULT 'Mid-sem',
  year text NOT NULL DEFAULT '',
  style_notes text NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  posted_by text NOT NULL DEFAULT 'Anonymous',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pyqs_len CHECK (length(subject) <= 120 AND length(teacher) <= 120 AND length(style_notes) <= 2000 AND length(file_url) <= 500)
);
GRANT SELECT, INSERT ON public.pyqs TO anon, authenticated;
GRANT ALL ON public.pyqs TO service_role;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read pyqs" ON public.pyqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can share pyqs" ON public.pyqs FOR INSERT TO anon, authenticated WITH CHECK (length(subject) > 0 AND length(teacher) > 0);
CREATE POLICY "Anyone can upload pyq files" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'pyqs');