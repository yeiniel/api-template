import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import { BaseAuthController } from './base-auth.controller';

export class RegisterController extends BaseAuthController {
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