import { Request, Response, NextFunction, IRoute } from 'express';
import createError from 'http-errors';
import { addMinutes } from 'date-fns';
import uuid from 'uuid';

import { UserModel } from '../../models/user';
import { AbstractController } from '../abstract.controller';

export class ForgotPasswordController implements AbstractController {
    protected userModel: UserModel;

    constructor(userModel?: UserModel) {
        this.userModel = userModel ?? new UserModel();
    }

    setupRoute(route: IRoute) {
        route.post(this.post.bind(this));
    }

    protected async post(req: Request, res: Response, next: NextFunction) {
        try {
          const { email } = req.body;
          
          try {
            await this.userModel.updateUserByEmail(email, {
              passwordResetTokenExpires: addMinutes(new Date(), 10),
              passwordResetToken: uuid.v4(),
              password: uuid.v4()
            })
          } catch (error) {
            if (error.message === 'Not Found') {
              throw createError(403, 'There was a problem. User does not exist');
            } else {
              throw error;
            }
          }
      
          return res.status(200).json({
            success: true,
            message: 'A link to reset password was sent to the email',
          });
        } catch (error) {
          next(createError(
            401, 
            'Wrong refresh token'
          ));
        }
      }
}