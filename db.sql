CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  title TEXT,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);
