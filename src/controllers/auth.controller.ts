import createError from 'http-errors';
import uuid from 'uuid';
import { addMinutes } from 'date-fns';

import { ClientInfo, RefreshTokenModel } from '../models/refresh-token';
import { UserModel } from '../models/user';

export const forgotPassword = async (email: string) => {
  try {
    try {
      await (new UserModel).updateUserById(email, {
        passwordResetTokenExpires: addMinutes(new Date(), 10),
        passwordResetToken: uuid.v4()
      })
    } catch (error) {
      if (error.message === 'Not Found') {
        throw createError(403, 'There was a problem. User does not exist');
      } else {
        throw error;
      }
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string, password: string, token: string) => {
  try {
    const user = await (new UserModel()).getUserByEmail(email);
    if (!user) {
      throw createError(403, 'There was a problem reseting your password. User does not exist');
    }
    if (user.passwordResetToken !== token) {
      throw createError(403, 'There was a problem reseting your password. Invalid Token');
    }
    if (user.passwordResetTokenExpires < new Date()) {
      throw createError(403, 'There was a problem reseting your password. Token expired');
    }
    await (new UserModel()).updateUserById(email, { password });
    return { success: true };
  } catch (error) {
    throw error;
  }
};
