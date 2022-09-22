import createError from 'http-errors';
import { User, UserModel } from '../models/user';
import { ClientInfo, RefreshTokenModel } from '../models/refresh-token';
import { hashPassword } from '../helpers/hash.helper';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { addMinutes } from 'date-fns';

export const createToken = (user: Omit<User, 'checkPassword'>) => {
  return jwt.sign(user, process.env['JWT_SECRET'], {
    expiresIn: process.env['TOKEN_EXPIRES_IN'],
  });
};

export const login = async (
  email: string,
  password: string,
  clientInfo: ClientInfo
) => {
 // Your solution here
  const user = await UserModel.getByEmail(email);

  if (!user) { return false; }

  if (!user.checkPassword(password)) { return false; }

  return { Token: createToken(user.toJSON()) };
};

export const refreshToken = async (refreshToken: string) => {
 // Your solution here

};

export const register = async ({ password, ...user }: Omit<User, 'checkPassword'>) => {
  // Your solution here
  return UserModel.add({ ...user, password: hashPassword(password) });
};

export const forgotPassword = async (email: string) => {
  try {
    const existingUser = await UserModel.getByEmail(email);
    if (!existingUser) {
      throw createError(403, 'There was a problem. User does not exist');
    }
    const now = new Date();
    const passwordResetTokenExpires = addMinutes(now, 10);
    const passwordResetToken = uuid.v4();
    await existingUser.updateOne({
      passwordResetTokenExpires,
      passwordResetToken,
      updatedAt: now,
    });
    console.log('reset token:', passwordResetToken);
    console.log('reset token:', email);

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string, password: string, token: string) => {
  try {
    const user = await UserModel.getByEmail(email, false);
    if (!user) {
      throw createError(403, 'There was a problem reseting your password. User does not exist');
    }
    if (user.passwordResetToken !== token) {
      throw createError(403, 'There was a problem reseting your password. Invalid Token');
    }
    if (user.passwordResetTokenExpires < new Date()) {
      throw createError(403, 'There was a problem reseting your password. Token expired');
    }
    const hashedPassword = hashPassword(password);
    await user.updateOne({ password: hashedPassword });
    return { success: true };
  } catch (error) {
    throw error;
  }
};
