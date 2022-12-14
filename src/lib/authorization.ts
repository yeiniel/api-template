import createError from 'http-errors';
import { Handler } from "express";

import { Role } from "../models/role";
import { UserAwareRequest } from "./authentication";
import { roleFromDecodedToken } from '../helpers/token.helpers';

export const highestRoleAllowed = (role: Role): Handler => (req: UserAwareRequest, res, next) => {
    if (roleFromDecodedToken(req.user) > role) {
        next(createError(403, 'You are not authorized to access'));
    } else {
        next();
    }
}