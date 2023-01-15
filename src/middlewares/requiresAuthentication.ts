import { Request, Response, NextFunction, request } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';
dotenv.config();

const requiresAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const tokenSecret = process.env.TOKEN_SECRET as Secret;
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, tokenSecret);
        //console.log(req.user);

        const user: User | null = (jwt.decode(token) as jwt.JwtPayload).user as User;
        const user_id = user.id;  // want to add this as request parameter to be used in CRUD
        req.body.user_id = user_id;

        return next();
    } catch (err) {
        res.status(401);
        res.json('Access denied, invalid token');
    }
};

export default requiresAuthentication;
