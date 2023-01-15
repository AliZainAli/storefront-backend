CREATE TABLE IF NOT EXISTS order_products (
  id SERIAL PRIMARY KEY,
  quantity integer NOT NULL,
  order_id bigint REFERENCES orders(id) ON DELETE SET NULL,
  product_id bigint REFERENCES products(id) ON DELETE SET NULL
);