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
          } catch (error) {
            switch(error.code) {
              // handle the special case of an already existing user
              case 11000:
                throw createError(
                  403, 
                  'User already exists'
                );
                break;
              default:
                throw error;
                break;
            }
          }
    
          return res.status(201)
            .json({ success: true });
        } catch (error) {
          next(error);
        }
    }
}