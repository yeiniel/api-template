import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { BaseAuthController } from './base-auth.controller';

export class ValidateTokenController extends BaseAuthController {
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