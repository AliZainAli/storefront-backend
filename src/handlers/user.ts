import { User, UserStore } from "../models/user"
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

const userStore = new UserStore();
const tokenSecret = process.env.TOKEN_SECRET;


const create = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: 'user'
  };

  try {
    const newUser = await userStore.create(user);
    const token = jwt.sign({ user: newUser }, tokenSecret as String);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err + user);
  }
}

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: 'user'
  };
  try {
    const u = await store.authenticate(user.username, user.password);
    var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    res.status(401);
    res.json({ err });
  }
};

