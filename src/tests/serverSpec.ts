import supertest from 'supertest';
import app from '../server';
import { Product, ProductStore } from '../models/product';
import { Order, OrderStore } from '../models/order';
import { User, UserStore } from '../models/user';

const req = supertest(app);

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

// users tests
describe("Test Users methods exists", () => {
  it('should have an index method', () => {
    expect(userStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(userStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(userStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(userStore.delete).toBeDefined();
  });

  it('create method should add a User', async () => {
    const result = await userStore.create({
      username: 'Test User',
      firstname: 'Test',
      lastname: 'User',
      role: 'admin',
      password: 'admin123'
    });
    const {'password': pw, ...result2} = result ;
    //console.dir(result2, {depth: null});
    //console.dir(result, { depth: null });
    expect(result2).toEqual({
      id: 1,
      username: 'Test User',
      firstname: 'Test',
      lastname: 'User',
      role: 'admin'
    });
  });

  it('index method should return a list of Users', async () => {
    const result = await userStore.index();
    const { password: pw, ...result2 } = result[0] as User;
    expect(result2).toEqual({
      id: 1,
      username: 'Test User',
      firstname: 'Test',
      lastname: 'User',
      role: 'admin'
    });
  });

  it('show method should return the correct user', async () => {
    const result = await userStore.show(1);
    const { password: pw, ...result2 } = result as User;
    expect(result2).toEqual({
      id: 1,
      username: 'Test User',
      firstname: 'Test',
      lastname: 'User',
      role: 'admin'
    });
  });


});


// products tests
describe("Test Products methods exists", () => {
  it('should have an index method', () => {
    expect(productStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(productStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(productStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(productStore.delete).toBeDefined();
  });

  it('create method should add a Product', async () => {
    const result = await productStore.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
      category: "cat 1"
    });
    expect(result).toEqual({
      id: 1,
      name: 'Test Product',
      price: 100,
      quantity: 10,
      category: 'cat 1'
    });
  });

  it('index method should return a list of Products', async () => {
    const result = await productStore.index();
    expect(result).toEqual([
      {
        id: 1,
        name: 'Test Product',
        price: 100,
        quantity: 10,
        category: 'cat 1'
      }
    ]);
  });

  it('show method should return the correct product', async () => {
    const result = await productStore.show(1);
    expect(result).toEqual({
      id: 1,
      name: 'Test Product',
      price: 100,
      quantity: 10,
      category: 'cat 1'
    });
  });
});


// orders tests
describe("Test Orders methods exists", () => {
  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(orderStore.delete).toBeDefined();
  });

  it('create method should add a Order', async () => {
    const result = await orderStore.create(1,'active');
    const { user_id: pw, ...result2 } = result as Order;
    expect(result2).toEqual({
      id: 1,
      status: 'active'
    });
  });

  it('index method should return a list of all Orders of all users (for admin)', async () => {
    const result = await orderStore.allOrders();
    const { user_id: pw, ...result2 } = result[0] as Order;
    expect(result2).toEqual({
      id: 1,
      status: 'active'
    });
  });

  it('index method should return a list of Orders of user', async () => {
    const result = await orderStore.index(1);
    const { user_id: pw, ...result2 } = result[0] as Order;
    expect(result2).toEqual(
      {
        id: 1,
        status: 'active'
      }
    );
  });

  it('show method should return the correct order', async () => {
    const result = await orderStore.show('1', 1);
    const { user_id: pw, ...result2 } = result as Order;
    expect(result2).toEqual({
      id: 1,
      status: 'active'
    });
  });

  it('delete method should remove the order', async () => {
    await orderStore.delete(1);
    const result = await orderStore.index(1);
    expect(result).toEqual([]);
  });
});


describe("test delete user and product at the end of all tests", () => {
  it('delete method should remove the user', async () => {
    await userStore.delete(1);
    const result = await userStore.index();
    expect(result).toEqual([]);
  });

  it('delete method should remove the product', async () => {
    await productStore.delete(1);
    const result = await productStore.index();
    expect(result).toEqual([]);
  });
});