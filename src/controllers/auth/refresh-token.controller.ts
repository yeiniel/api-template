import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { createToken, DecodedToken, emailFromDecodedToken } from '../../helpers/token.helpers';
import { BaseAuthController } from './base-auth.controller';

export class RefreshTokenController extends BaseAuthController {
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
            token: createToken(user) 
          });
        } catch (error) {
          next(createError(
            401, 
            'Wrong refresh token'
          ));
        }
      }
}