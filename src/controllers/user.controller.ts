import createError from 'http-errors';
import { hashPassword } from '../helpers/hash.helper';
import { Role } from '../models/role';
import { IPatch } from '../models/ipatch';

import { User, UserModel } from '../models/user';
import { DecodedToken, emailFromDecodedToken } from '../helpers/token.helpers';

const changePassword = (attr: IPatch) => {
  if (attr.path === '/password') {
    return true;
  }
  return false;
};

export const addUser = async (newUser: any, user: any) => {
  try {
    const existingUser = await (new UserModel()).getUserByEmail(newUser.email);
    if (existingUser) {
      return {
        exists: true,
      };
    }
    if (!newUser.name) {
      newUser.name = `${newUser.firstName} ${newUser.lastName}`;
    }
    const createdUser = await new UserModel().createUser(newUser);
    if (!createdUser) {
      return null;
    }
    return createdUser;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (user: any, page: number, limit: number, query?: any) => {
  try {
    const parsedFilter = {};
    if (query.filter) {
      const filters = query.filter.split(';');
      filters.map((f) => {
        const [key, value] = f.split(':');
        if (key === 'role' && !isNaN(parseInt(value, 10))) {
          parsedFilter[key] = parseInt(value, 10);
        }
      });
    }
    const users = await (new UserModel()).getUsers(page, limit, parsedFilter);
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (email: User['email'], decodedToken: DecodedToken) => {
  if (email !== emailFromDecodedToken(decodedToken)) {
    throw createError(403, 'You are not authorized to access');
  }
  try {
    const user = await (new UserModel()).getUserByEmail(email);
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserController = async (userId: string, payload: any, user: any) => {
  if (userId !== user.id) {
    throw createError(403, `You are not authorized to edit the user ${userId}`);
  }
  try {
    if (payload['password']) {
      const hashPass = hashPassword(payload['password']);
      payload['password'] = hashPass;
    }
    const response = await (new UserModel()).updateUserById(userId, payload);
    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId: string, user: any) => {
  try {
    const response = await (new UserModel()).deleteUserById(userId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (userId: string, user: any) => {
  // get all members from user collection
  if (userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  try {
    const response = await (new UserModel()).getUsers;
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (userId: string, user: any, email: string) => {
  // get all members from user collection
  if (userId !== user.id && !user.roles.includes(Role.Admin)) {
    throw createError(403, 'You are not authorized to access');
  }
  const existingUser = await (new UserModel()).getUserByEmail(email);
  if (existingUser) {
    return {
      existingUser,
    };
  }
};

export const getUserById = async (userId: string, user: any, id: string) => {
  // get all members from user collection
  const existingUser = await (new UserModel()).getUserById(id);
  if (existingUser) {
    return {
      existingUser,
    };
  }
};
