import { Request, Response, NextFunction, IRoute } from 'express';
import createError from 'http-errors';

import { UserModel } from '../../models/user';
import { AbstractController } from '../abstract.controller';

export class RegisterController implements AbstractController {
    protected userModel: UserModel;

    constructor(userModel?: UserModel) {
        this.userModel = userModel ?? new UserModel();
    }

    setupRoute(route: IRoute) {
        route.post(this.post.bind(this));
    }

    protected async post(req: Request, res: Response, next: NextFunction) {
        try {
          const newUser = req.body;
      
          if (newUser.role && typeof newUser.role === 'string') {
            newUser.role = parseInt(newUser.role);
          }
      
          if (newUser.dob && typeof newUser.dob === 'string') {
            newUser.dob = parseInt(newUser.dob);
          }
      
          try {
            await this.userModel.createUser(newUser);
      
            return res.status(201)
              .json({ success: true });
          } catch (error) {
            // handle the special case of an already existing user
            if (error.code === 11000) {
              throw createError(
                403, 
                'User already exists'
              );
            } else {
              throw error;
            }
          }
        } catch (error) {
          next(error);
        }
    }
}