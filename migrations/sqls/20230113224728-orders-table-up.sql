CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(32) DEFAULT 'active',
  user_id bigint REFERENCES users(id)
);