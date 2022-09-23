import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import uuid from 'uuid';

import { BaseAuthController } from './base-auth.controller';

export class ResetPasswordController extends BaseAuthController {
    protected async post(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, token } = req.body;
          
            const user = await this.userModel.getUserByEmail(email);
            if (!user) {
                throw createError(
                    403, 
                    'There was a problem reseting your password. User does not exist'
                );
            }
            if (user.passwordResetToken !== token) {
                throw createError(
                    403, 
                    'There was a problem reseting your password. Invalid Token'
                );
            }
            if (user.passwordResetTokenExpires < new Date()) {
                throw createError(
                    403, 
                    'There was a problem reseting your password. Token expired'
                );
            }
            await this.userModel.updateUserByEmail(email, { 
                password,
                passwordResetToken: uuid.v4()
            });
      
            return res.status(200).json({
                success: true,
                message:
                  'Your password was updated succesfully. Now you can login with your new password',
            });
        } catch (error) {
          next(createError(
            401, 
            'Wrong refresh token'
          ));
        }
    }
}