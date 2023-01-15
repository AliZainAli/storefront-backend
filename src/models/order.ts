import Client from "../database";

export type Order = {
  id?: number;
  status?: string;
  user_id?: number;
};

export class OrderStore {
  async allOrders(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      //const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }

  async current(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [user_id, 'active']);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }

  async index(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const result = await conn.query(sql, [user_id]);
      //const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }

  async show(id: string, userId: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      if (order.user_id != userId) {
        throw new Error(`this order belongs to another user`);
      }
      return order;
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(user_id: number, status: string | undefined): Promise<Order> {
    const statusType: boolean = typeof status !== 'undefined';
    try {
      if (statusType) {
        const sql =
          'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
        const conn = await Client.connect();
        const result = await conn.query(sql, [status, user_id]);
        const order = result.rows[0];
        conn.release();
        return order;
      } else {
        const sql = 'INSERT INTO orders (user_id) VALUES($1) RETURNING *';
        const conn = await Client.connect();
        const result = await conn.query(sql, [user_id]);
        const order = result.rows[0];
        conn.release();
        return order;
      }
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  /*
  async create(status: string): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status) VALUES($1) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();

      //const result = await conn.query(sql, [b.status, b.author, b.totalPages, b.summary])
      const result = await conn.query(sql, [status]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }
  */

  async delete(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async update(id: number, status: string | undefined): Promise<Order> {
    try {
      const statusType: boolean = typeof status !== 'undefined';
      //const completedType: boolean = typeof completed !== 'undefined';
      const conn = await Client.connect();
      let sql, result, order;
      if (statusType) {
        sql = 'Update orders SET status=($2) WHERE id=($1) RETURNING *';
        result = await conn.query(sql, [id, status]);
        order = result.rows[0];
      }
      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not update order ${id}. Error: ${err}`);
    }
  }
  /*
  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      //@ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }
  */

  async addProduct(
    quantity: number,
    orderId: string,
    productId: string,
    user_id: number
  ): Promise<Order> {
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(ordersql, [orderId]);

      const order = result.rows[0];

      if (order.user_id != user_id) {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order does not belong to this user`
        );
      }

      if (order.status !== 'active') {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const order_product_sql =
        'SELECT * FROM order_products WHERE order_id=($1) AND product_id=($2) ';
      const conn = await Client.connect();
      const order_product_result = await conn.query(order_product_sql, [
        orderId,
        productId
      ]);
      const order_product_identical = order_product_result.rows[0];
      if (order_product_identical) {
        console.log('change quantity');
        const newQuantity = order_product_identical.quantity + quantity;
        const sql =
          'UPDATE order_products SET quantity=($3) WHERE order_id=($1) AND product_id=($2) RETURNING *';
        const order_product_result = await conn.query(sql, [
          orderId,
          productId,
          newQuantity
        ]);
        const order = order_product_result.rows[0];
        conn.release();
        return order;
      } else {
        const sql =
          'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
        const result = await conn.query(sql, [quantity, orderId, productId]);
        const order = result.rows[0];
        conn.release();
        return order;
      }
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }
}