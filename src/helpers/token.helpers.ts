import jwt from 'jsonwebtoken';

import { User } from "../models/user";

export const createToken = (user: Pick<User, 'email' | 'role'>) => {
    return jwt.sign({ sub: user.email, role: user.role }, process.env['JWT_SECRET'], {
      expiresIn: process.env['TOKEN_EXPIRES_IN'],
    });
};