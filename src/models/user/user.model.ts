import { Validator } from 'jsonschema';
import { FilterQuery } from 'mongoose';

import { User } from "./user";
import { UserJSONSchema } from './user.json-schema';
import { UserTypegooseModel } from './user.typegoose-model';

// deconstruct the user json schema to get a partial one
const { required: _, ...PartialUserJSONSchema } = UserJSONSchema;

export class UserModel {

    protected validator: Validator;
    protected typegooseModel: typeof UserTypegooseModel;

    protected maxFailedLoginAttempts = 3;

    constructor(validator?: Validator, typegooseModel?: typeof UserTypegooseModel){
        this.validator = validator ?? new Validator();
        this.typegooseModel = typegooseModel ?? UserTypegooseModel;
    }

    getUsers(page: number, limit: number, parsedFilter: FilterQuery<typeof UserTypegooseModel>) {
        return this.typegooseModel.paginate(parsedFilter, { page, limit });
    }

    getUserByEmail(email: User['email']): Promise<User | undefined> {
        return this.typegooseModel.findOne({ email })
            .then(document => document ? document.toJSON() : document); 
    }

    getUserById(id: string) {
        return this.typegooseModel.findById(id)
            .then(document => document ? document.toJSON() : document);
      }

    async createUser(newUser: User): Promise<User> {
        // validate user
        this.validator.validate(
            newUser, UserJSONSchema, { throwError: true }
        );

        return await this.typegooseModel.create(newUser)
            .then(document => document.toJSON());
    }

    async updateUserById(id: string, changes: Partial<Omit<User, 'email'>>) {
        this.validator.validate(
            changes, PartialUserJSONSchema, { throwError: true }
        );

        const user = await this.typegooseModel.findById(id);

        if (!user) {
            throw new Error('Not Found');
        }

        return await user.updateOne({ 
            ...changes, 
            ...(changes.password ? { failedLoginAttempts: 0 } : {}) 
        });
    }

    deleteUserById(id: string) {
        return this.typegooseModel.deleteOne({ _id: id })
    }

    async login(email: User['email'], password: User['password']) {
        const user = await this.typegooseModel.findOne({ email });

        if (!user) { throw new Error('Not Found'); }

        if (user.failedLoginAttempts >= this.maxFailedLoginAttempts) {
            throw new Error('Account locked');
        }

        if (!user.checkPassword(password)) {
            await user.updateOne({
                failedLoginAttempts: user.failedLoginAttempts + 1
            });

            throw new Error('Wrong Password');
        }

        return user.toJSON();
    }
}