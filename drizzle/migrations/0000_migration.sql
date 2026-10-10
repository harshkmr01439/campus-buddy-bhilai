CREATE TABLE public.lost_found (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('lost','found')),
  item text NOT NULL CHECK (char_length(item) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 120),
  contact text NOT NULL CHECK (char_length(contact) BETWEEN 1 AND 120),
  posted_by text NOT NULL DEFAULT 'Anonymous' CHECK (char_length(posted_by) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.mess_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL CHECK (char_length(day) <= 20),
  meal text NOT NULL CHECK (char_length(meal) <= 20),
  items text NOT NULL CHECK (char_length(items) BETWEEN 1 AND 500),
  timing text NOT NULL DEFAULT '' CHECK (char_length(timing) <= 40),
  posted_by text NOT NULL DEFAULT 'Anonymous' CHECK (char_length(posted_by) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('complaint','query')),
  category text NOT NULL DEFAULT 'General' CHECK (char_length(category) <= 40),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 150),
  details text NOT NULL CHECK (char_length(details) BETWEEN 1 AND 2000),
  posted_by text NOT NULL DEFAULT 'Anonymous' CHECK (char_length(posted_by) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  category text NOT NULL DEFAULT 'General' CHECK (char_length(category) <= 40),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  contact text NOT NULL DEFAULT '' CHECK (char_length(contact) <= 120),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.club_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name text NOT NULL CHECK (char_length(club_name) BETWEEN 1 AND 80),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  event_date date NOT NULL,
  venue text NOT NULL DEFAULT '' CHECK (char_length(venue) <= 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.newcomer_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('study','mistake','tip')),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  link text NOT NULL DEFAULT '' CHECK (char_length(link) <= 300),
  posted_by text NOT NULL DEFAULT 'Anonymous' CHECK (char_length(posted_by) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['lost_found','mess_menu','complaints','clubs','club_events','newcomer_tips'] LOOP
    EXECUTE format('GRANT SELECT, INSERT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Anyone can read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "Anyone can post" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', t);
  END LOOP;
END $$;

INSERT INTO public.mess_menu (day, meal, items, timing, posted_by) VALUES
('Monday','Breakfast','Poha, Jalebi, Bread & Butter, Tea/Coffee','7:30 – 9:30 AM','Mess Committee'),
('Monday','Lunch','Rice, Dal Tadka, Aloo Gobi, Roti, Salad, Curd','12:30 – 2:30 PM','Mess Committee'),
('Monday','Snacks','Samosa, Tea','5:00 – 6:00 PM','Mess Committee'),
('Monday','Dinner','Paneer Butter Masala, Jeera Rice, Roti, Gulab Jamun','7:30 – 9:30 PM','Mess Committee'),
('Tuesday','Breakfast','Aloo Paratha, Curd, Pickle, Milk','7:30 – 9:30 AM','Mess Committee'),
('Tuesday','Lunch','Rajma Chawal, Mix Veg, Roti, Salad','12:30 – 2:30 PM','Mess Committee'),
('Tuesday','Dinner','Chole, Puri, Rice, Kheer','7:30 – 9:30 PM','Mess Committee');

INSERT INTO public.clubs (name, category, description, contact) VALUES
('OpenLake','Technical','Open-source club of IIT Bhilai. Contribute to real projects, Hacktoberfest drives and hack days.','openlake@iitbhilai.ac.in'),
('Coding Club','Technical','Competitive programming, contests and DSA sessions every week.','codingclub@iitbhilai.ac.in'),
('Music Club','Cultural','Jam sessions, band performances and open mics.','music@iitbhilai.ac.in'),
('Sports Council','Sports','Cricket, football, badminton and inter-IIT preparation.','sports@iitbhilai.ac.in');

INSERT INTO public.club_events (club_name, title, event_date, venue, description) VALUES
('OpenLake','OpenLake × MLH Hack Day - Build with Gemma 4','2026-10-10','Main Auditorium','Day-long hackathon building with Gemma 4.'),
('Coding Club','Weekly Contest #12','2026-10-17','Online','2-hour competitive programming contest.'),
('Music Club','Open Mic Night','2026-10-24','Open Air Theatre','Bring your instrument or voice.');

INSERT INTO public.newcomer_tips (kind, title, body, link, posted_by) VALUES
('study','Follow NPTEL lectures for first-year maths','NPTEL courses match the first-year syllabus closely and are free.','https://nptel.ac.in','Senior, 3rd year'),
('study','Practice DSA early','Start with basic problems on arrays and strings in your first semester.','','Coding Club'),
('mistake','Do not skip attendance','Many courses need 75% attendance to sit for end-sems.','','Senior, 4th year'),
('mistake','Don''t ignore circulars','Fee and registration deadlines come via circulars — upload them to CampusBuddy for a summary.','','CampusBuddy team'),
('tip','Join at least one club','Clubs are the fastest way to make friends and learn new skills.','','Senior, 2nd year');