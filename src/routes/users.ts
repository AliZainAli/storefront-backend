import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/user';
import requiresAuthentication from '../middlewares/requiresAuthentication';
import requiresAdmin from '../middlewares/requiresAdmin';
const userRoutes = express.Router();
userRoutes.use(bodyParser.json());
const userStore = new UserStore();
const tokenSecret = process.env.TOKEN_SECRET;

userRoutes.get(
  '/',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      let users: User[] = await userStore.index();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

userRoutes.get(
  '/:id',
  requiresAuthentication,
  async (req: Request, res: Response): Promise<void> => {
    const userId: number = parseInt(req.params.id as string);
    const authId: number = req.body.user_id;
    try {
      let user: User = await userStore.show(userId);
      if (user.id != authId) {
        res.status(403).json('unauthoruzed to see other users data');
        return
      }
      res.status(200);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

userRoutes.post('/createFirstAdmin', async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      username: 'admin udacity',
      firstname: 'admin',
      lastname: 'udacity',
      role: "admin",
      password: "123456"
    };

    const newUser = await userStore.create(user);
    const token = jwt.sign(
      {
        user: {
          username: newUser.username,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          role: newUser.role,
          id: newUser.id
        }
      },
      tokenSecret as string
    );
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json((err as Error).message);
  }
});

userRoutes.post(
  '/register',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user: User = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: "user",
        password: req.body.password
      };

      const newUser = await userStore.create(user);
      const token = jwt.sign(
        {
          user: {
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            role: newUser.role,
            id: newUser.id
          }
        },
        tokenSecret as string
      );
      res.json(token);
    } catch (err) {
      console.log(err);
      res.status(400).json((err as Error).message);
    }
  }
);

userRoutes.post(
  '/',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user: User = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role,
        password: req.body.password
      };

      const newUser = await userStore.create(user);
      const token = jwt.sign(
        {
          user: {
            username: newUser.username,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            role: newUser.role,
            id: newUser.id
          }
        },
        tokenSecret as string
      );
      res.json(token);
    } catch (err) {
      console.log(err);
      res.status(400).json((err as Error).message);
    }
  }
);


userRoutes.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      username: req.body.username,
      password: req.body.password
    };

    const authenticated = await userStore.authenticate(user.username, user.password);
    if (authenticated) {
      const token = jwt.sign(
        {
          user: {
            username: authenticated.username,
            firstname: authenticated.firstname,
            lastname: authenticated.lastname,
            role: authenticated.role,
            id: authenticated.id
          }
        },
        tokenSecret as string
      );
      res.json(token);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json((err as Error).message);
  }
});

//delete a resouce
userRoutes.delete(
  '/:id',
  requiresAuthentication,
  requiresAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const deleted: number | undefined = await userStore.delete(id);
        if (deleted) {
          res.sendStatus(204);
        } else {
          res.status(404).send('resource not found');
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.sendStatus(404);
    }
  }
);

export default userRoutes;
