import { Request, Response, NextFunction, IRoute } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { UserModel } from '../../models/user';
import { AbstractController } from '../abstract.controller';
import { createToken } from '../../helpers/token.helpers';

export class ValidateTokenController implements AbstractController {
    protected userModel: UserModel;

    constructor(userModel?: UserModel) {
        this.userModel = userModel ?? new UserModel();
    }

    setupRoute(route: IRoute) {
        route.post(this.post.bind(this));
    }

    protected async post(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            
            const decodedToken = jwt.verify(token, process.env['JWT_SECRET']);
        
            const user = await this.userModel.getUserByEmail(decodedToken['sub']);
        
            return res.json({ 
              userId: user.email,
              token
            });
        } catch (error) {
            next(createError(
              401, 
              'Wrong refresh token'
            ));
        }
      }
}