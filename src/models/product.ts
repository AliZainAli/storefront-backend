import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get products. Error: ${(err as Error).message}`
      );
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(
    //name: string,
    //price: number,
    //quantity: number,
    //category: string | undefined
    p: Product
  ): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, quantity, category) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        p.name,
        p.price,
        p.quantity,
        p.category
      ]);
      const product = result.rows[0];
      conn.release();
      return product;
      //if (p.category) {
      //  const sql =
      //    'INSERT INTO products (name, price, quantity, category) VALUES($1, $2, $3, $4) RETURNING *';
      //  const conn = await Client.connect();
      //  const result = await conn.query(sql, [
      //    p.name,
      //    p.price,
      //    p.quantity,
      //    p.category
      //  ]);
      //  const product = result.rows[0];
      //  conn.release();
      //  return product;
      //} else {
      //  const sql =
      //    'INSERT INTO products (name, price, quantity) VALUES($1, $2, $3) RETURNING *';
      //  const conn = await Client.connect();
      //  const result = await conn.query(sql, [name, p.price, p.quantity]);
      //  const product = result.rows[0];
      //  conn.release();
      //  return product;
      //}
    } catch (err) {
      throw new Error(`Could not add new product. Error: ${err}`);
    }
  }

  async update(p: Product): Promise<Product> {
    try {
      const nameType: boolean = typeof p.name !== 'undefined';
      const priceType: boolean = typeof p.price !== 'undefined';
      const quantityType: boolean = typeof p.quantity !== 'undefined';
      const categoryType: boolean = typeof p.category !== 'undefined';
      const conn = await Client.connect();
      let sql, result, product;
      if (nameType) {
        sql = 'Update products SET name=($2) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [p.id, p.name]);
        product = result.rows[0];
      }
      if (priceType) {
        sql = 'Update products SET price=($2) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [p.id, p.price]);
        product = result.rows[0];
      }
      if (quantityType) {
        sql = 'Update products SET quantity=($2) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [p.id, p.quantity]);
        product = result.rows[0];
      }
      if (categoryType) {
        sql = 'Update products SET category=($2) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [p.id, p.category]);
        product = result.rows[0];
      }
      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not update product ${p.id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
      
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  /*
  async update(
    id: number,
    name: string | undefined,
    price: number | undefined,
    quantity: number | undefined
  ): Promise<Product> {
    try {
      const nameType: boolean = typeof name !== 'undefined';
      const priceType: boolean = typeof price !== 'undefined';
      const quantityType: boolean = typeof quantity !== 'undefined';
      //const priceType: number = typeof price !== 'undefined';
      //const completedType: boolean = typeof completed !== 'undefined';
      const conn = await Client.connect();
      let sql, result, product;
      if (nameType) {
        sql =
          'Update products SET name=($2), price=($3), quantity=($3) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [id, name]);
        product = result.rows[0];
      }
      if (priceType) {
        sql = 'Update products SET price=($3) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [id, price]);
        product = result.rows[0];
      }
      if (quantityType) {
        sql = 'Update products SET quantity=($4) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [id, quantity]);
        product = result.rows[0];
      }
      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not update product ${id}. Error: ${err}`);
    }
  }
  */
}
