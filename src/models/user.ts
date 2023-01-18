import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type User = {
  id?: number;
  username: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  password: string;
};

export class UserStore {
  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (username, firstname, lastname, role, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
      const conn = await Client.connect();
      const hash: string = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds as string)
      );

      const result = await conn.query(sql, [
        u.username,
        u.firstname,
        u.lastname,
        u.role,
        hash
      ]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not add new user ${u.username} . Error: ${
          (err as Error).message
        }`
      );
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE username='${username}'`;
    const conn = await Client.connect();

    const result = await conn.query(sql);
    conn.release();

    if (result.rows.length) {
      const user = result.rows[0];
      console.log(user);
      if (bcrypt.compareSync(password + pepper, user.password)) {
        console.log('user return');

        return user;
      }
    }
    return null;
  }

  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${(err as Error).message}`);
    }
  }

  async show(userId: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [userId]);
      conn.release();
      const user = result.rows[0];
      return user;
    } catch (err) {
      throw new Error(`Could not get user. Error: ${(err as Error).message}`);
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      const numberOfDeletedRows = result.rowCount;
      conn.release();

      return numberOfDeletedRows;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
