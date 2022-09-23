import jwt from 'jsonwebtoken';

import { User } from "../models/user";

export type DecodedToken = {
  sub: User['email'];
  role: User['role'];
};

export const createToken = (user: Pick<User, 'email' | 'role'>) => {
  const decodedToken: DecodedToken = {
    sub: user.email,
    role: user.role
  };

  return jwt.sign(decodedToken, process.env['JWT_SECRET'], {
    expiresIn: process.env['TOKEN_EXPIRES_IN'],
  });
};

export function emailFromDecodedToken(token: DecodedToken): User['email'] {
  return token.sub;
}

export function roleFromDecodedToken(token: DecodedToken): User['role'] {
  return token.role;
}