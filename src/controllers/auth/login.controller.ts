import { Request, Response, NextFunction, IRoute } from 'express';
import createError from 'http-errors';

import { UserModel } from '../../models/user';
import { AbstractController } from '../abstract.controller';
import { createToken } from '../../helpers/token.helpers';

export class LoginController implements AbstractController {
    protected userModel: UserModel;

    constructor(userModel?: UserModel) {
        this.userModel = userModel ?? new UserModel();
    }

    setupRoute(route: IRoute) {
        route.post(this.post.bind(this));
    }

    protected async post(req: Request, res: Response, next: NextFunction) {
        try {
          const { email, password, client } = req.body;
      
          try {
            const user = await this.userModel.login(email, password);

            return res.json({ 
              token: createToken(user) 
            });
          } catch(error) {
            switch(error.message) {
              case 'Not Found':
              case 'Wrong Password':
                throw createError(
                  401, 
                  'The username or password is wrong please check and try again'
                );
                break;
              case 'Account locked':
                throw createError(
                  423, 
                  'The user account is locked'
                );
                break;
              default:
                throw error;
                break;
            }
          }
        } catch (error) {
          next(error);
        }
    }
}