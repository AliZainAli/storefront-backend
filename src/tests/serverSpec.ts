import supertest from 'supertest';
import app from '../server';

import { Product, ProductStore } from '../models/product';
import { Order, OrderStore } from '../models/order';
import { User, UserStore } from '../models/user';
import { json } from 'body-parser';

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
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      password: '123'
    });
    expect(result).toEqual({
      id: 1,
      username: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      password: '123'
    });
  });

  it('index method should return a list of Users', async () => {
    const result = await userStore.index();
    expect(result).toEqual([
      {
        id: 1,
        username: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
        password: '123'
      }
    ]);
  });

  it('show method should return the correct user', async () => {
    const result = await userStore.show(1);
    expect(result).toEqual({
      id: 1,
      username: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      password: '123'
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
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: 'active'
    });
  });

  it('index method should return a list of all Orders of all users (for admin)', async () => {
    const result = await orderStore.allOrders();
    expect(result).toEqual([
      {
        id: 1,
        user_id: 1,
        status: 'active'
      }
    ]);
  });

  it('index method should return a list of Orders of user', async () => {
    const result = await orderStore.index(1);
    expect(result).toEqual([
      {
        id: 1,
        user_id: 1,
        status: 'active'
      }
    ]);
  });

  it('show method should return the correct order', async () => {
    const result = await orderStore.show('1', 1);
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: 'active'
    });
  });

  it('delete method should remove the order', async () => {
    orderStore.delete(1);
    const result = await orderStore.index(1);
    expect(result).toEqual([]);
  });
});


describe("test delete user and product at the end of all tests", () => {
  it('delete method should remove the user', async () => {
    userStore.delete(1);
    const result = await userStore.index();
    expect(result).toEqual([]);
  });

  it('delete method should remove the product', async () => {
    productStore.delete(1);
    const result = await productStore.index();
    expect(result).toEqual([]);
  });
});