import bodyParser from 'body-parser';
import express, { Request, Response, Application } from 'express';
import jwt from 'jsonwebtoken';
import { Product, ProductStore } from '../models/product';
import requiresAuthentication from '../middlewares/requiresAuthentication';
import requiresAdmin from '../middlewares/requiresAdmin';
const productRoutes = express.Router();
productRoutes.use(bodyParser.json());
const productStore = new ProductStore();
//const tokenSecret = process.env.TOKEN_SECRET;


productRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
      let users: Product[] = await productStore.index();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

productRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      let product: Product = await productStore.show(id);
      res.json(product);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
  
});


productRoutes.post(
  '/',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const product: Product = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category
      };
      const newProduct = await productStore.create(product);
      res.json(newProduct);
    } catch (err) {
      console.log(err);
      res.status(400).json((err as Error).message);
    }
  }
);

productRoutes.patch(
  '/:id',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const product: Product = {
          id: id,
          name: req.body.name,
          price: req.body.price,
          quantity: req.body.quantity,
          category: req.body.category
        };
        const newProduct = await productStore.update(product);
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

productRoutes.delete(
  '/:id',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const deletedProduct = await productStore.delete(id);
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
const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.delete('/products', destroy);
  // add product
  //app.post('/products/:id/products', addProduct);
};
*/


const index = async (req: Request, res: Response): Promise<void> => {
  try {
    let products: Product[] = await productStore.index();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  const product = await productStore.show(req.body.id);
  res.json(product);
};

const create = async (req: Request, res: Response): Promise<void> => {
  //console.log("products post");
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category
    };
    const newProduct = await productStore.create(product);
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json((err as Error).message);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deletedProduct = await productStore.delete(req.body.id);
  res.json(deletedProduct);
};

export default productRoutes;
