import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { BaseAuthController } from './base-auth.controller';
import { DecodedToken, emailFromDecodedToken } from '../../helpers/token.helpers';

export class ValidateTokenController extends BaseAuthController {
    protected async post(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            
            const decodedToken = jwt.verify(
              token, process.env['JWT_SECRET']
            ) as DecodedToken;
        
            const user = await this.userModel.getUserByEmail(
              emailFromDecodedToken(decodedToken)
            );
        
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