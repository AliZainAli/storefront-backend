CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  price integer NOT NULL,
  quantity integer NOT NULL DEFAULT 100,
  category VARCHAR(100) DEFAULT NULL
);