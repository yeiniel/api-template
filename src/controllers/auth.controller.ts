import { Handler } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { addMinutes } from 'date-fns';

import { User, UserModel } from '../models/user';
import { ClientInfo, RefreshTokenModel } from '../models/refresh-token';

const createToken = (user: Pick<User, 'email' | 'role'>) => {
  return jwt.sign({ sub: user.email, role: user.role }, process.env['JWT_SECRET'], {
    expiresIn: process.env['TOKEN_EXPIRES_IN'],
  });
};

export const login: Handler = async (req, res, next) => {
  try {
    const { email, password, client } = req.body;

    // TODO: validate input

    const user = await UserModel.checkCredentials(email, password);

    if(user) {
      return res.json({ 
        token: createToken({ email, role: user.role }) 
      });
    } else {
      throw createError(
        401, 
        'The username or password is wrong please check and try again'
      );
    }
  } catch (error) {
    next(error);
  }
}

export const refreshToken = async (refreshToken: string) => {
  const decodedToken = jwt.verify(refreshToken, process.env['JWT_SECRET']);

  const user = await UserModel.getByEmail(decodedToken['sub']);

  return { 
    userId: user._id,
    token: createToken({ email: user.email, role: user.role }) 
  }
};

export const register: Handler = async (req, res, next) => {
  try {
    const newUser = req.body;

    if (newUser.role && typeof newUser.role === 'string') {
      newUser.role = parseInt(newUser.role);
    }

    if (newUser.dob && typeof newUser.dob === 'string') {
      newUser.dob = parseInt(newUser.dob);
    }

    try {
      await UserModel.validateAndCreate(newUser);

      return res.status(201)
        .json({ success: true });
    } catch (error) {
      // handle the special case of an already existing user
      if (error.message.includes('duplicate key error collection')) {
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
    await user.updateOne({ password });
    return { success: true };
  } catch (error) {
    throw error;
  }
};
