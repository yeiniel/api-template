import { Request, Response, NextFunction, IRoute } from 'express';

import { UserModel } from '../../models/user';
import { AbstractController } from "../abstract.controller";

export abstract class BaseAuthController implements AbstractController {
    protected userModel: UserModel;

    constructor(userModel?: UserModel) {
        this.userModel = userModel ?? new UserModel();
    }

    setupRoute(route: IRoute) {
        route.post(this.post.bind(this));
    }

    protected abstract post(req: Request, res: Response, next: NextFunction);
}