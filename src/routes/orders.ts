import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Order, OrderStore } from '../models/order';
import requiresAuthentication from '../middlewares/requiresAuthentication';
import requiresAdmin from '../middlewares/requiresAdmin';
const orderRoutes = express.Router();
orderRoutes.use(bodyParser.json());
const orderStore = new OrderStore();
const tokenSecret = process.env.TOKEN_SECRET;


orderRoutes.get(
  '/all',
  requiresAdmin,
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    //console.log('User Id: ' + req.body.user_id);
    try {
      let orders: Order[] = await orderStore.allOrders();
      res.json(orders);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

orderRoutes.get(
  '/',
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    //console.log('User Id: ' + req.body.user_id);
    try {
      let orders: Order[] = await orderStore.index(req.body.user_id);
      res.json(orders);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

orderRoutes.get(
  '/:id/current',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    //console.log('User Id: ' + req.body.user_id);
    const userId: number = parseInt(req.params.id as string);
    try {
      let orders: Order[] = await orderStore.current(userId);
      res.json(orders);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

orderRoutes.get(
  '/:id',
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    const orderId: string = req.params.id;
    const userId: number = parseInt(req.body.user_id);
    try {
      const order = await orderStore.show(orderId, userId);
      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

orderRoutes.post(
  '/',
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await orderStore.create(req.body.user_id, req.body.status);
      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

orderRoutes.post(
  '/:id/products',
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    const orderId: string = req.params.id;
    const productId: string = req.body.productId;
    const quantity: number = parseInt(req.body.quantity);
    const user_id: number = parseInt(req.body.user_id);
    
    try {
      const addedProduct = await orderStore.addProduct(
        quantity,
        orderId,
        productId,
        user_id
      );
      res.json(addedProduct);
    } catch (err) {
      res.status(400);
      res.json(err);
    }
  }
);

orderRoutes.patch(
  '/:id',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
     const id: number = parseInt(req.params.id as string);
    //const id: string = req.params.id as string;
    if (id) {
      try {
        const order: Order = {
          id: id,
          status: req.body.status
        };
        const newProduct = await orderStore.update(order.id!, order.status);
        res.json(newProduct);
      } catch (err) {
        console.log(err);
        res.status(400).json((err as Error).message);
      }
    } else {
      res.sendStatus(404);
    }
  }
);

orderRoutes.delete(
  '/:id',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const deletedProduct = await orderStore.delete(id);
        res.json(deletedProduct);
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.sendStatus(404);
    }
  }
);


/*
const orderRoutes = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', create)
    app.delete('/articles', destroy);
    // add product
    app.post('/orders/:id/products', addProduct)
}

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    let orders: Order[] = await orderStore.index();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  const order = await orderStore.show(req.body.id);
  res.json(order);
}



const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      status: req.body.status
    };
    const newOrder = await orderStore.create(order);
    res.json(newOrder);
  } catch (err) {
    console.log(err);
    res.status(400).json((err as Error).message);
  }
}

const destroy = async (req: Request, res: Response) => {
  const deletedOrder = await orderStore.delete(req.body.id);
  res.json(deletedOrder);
};


const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  const productId: string = _req.body.productId;
  const quantity: number = parseInt(_req.body.quantity);

  try {
    const addedProduct = await orderStore.addProduct(
      quantity,
      orderId,
      productId
    );
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

*/


export default orderRoutes;
