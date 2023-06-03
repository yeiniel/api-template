import { prop, getModelForClass, ReturnModelType, plugin, Ref } from '@typegoose/typegoose';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

@plugin(paginate)
export class User {

  @prop()
  passwordResetToken?: string;

  @prop()
  passwordResetTokenExpires?: Date;
  
  static paginate: (
    this: ReturnModelType<typeof User>,
    query?: FilterQuery<ReturnModelType<typeof User>>,
    options?: PaginateOptions,
    callback?: (err: Error, result: PaginateResult<ReturnModelType<typeof User>>) => void,
    ) => Promise<PaginateResult<ReturnModelType<typeof User>>>;

  static getUsers(this: ReturnModelType<typeof User>, page: number, limit: number, parsedFilter: FilterQuery<ReturnModelType<typeof User>>) {
    return this.paginate(parsedFilter, { page, limit });
  }

  static async getByEmail(this: ReturnModelType<typeof User>, email: string, flag?: boolean) {
    return this.findOne({ email });
  }

  static async add(this: ReturnModelType<typeof User>, input: User) {
    return this.create(input);
  }

  static getById(this: ReturnModelType<typeof User>, id: string, flag?: boolean) {
    return this.findById(id);
  }

  static updateUser(this: ReturnModelType<typeof User>, id: string, payload: Partial<User>) {
    return this.updateOne({ _id: id }, payload);
  }

  static deleteById(this: ReturnModelType<typeof User>, id: string) {
    return this.deleteOne({ _id: id })
  }
}

const DefaultTransform = {
  schemaOptions: {
    collection: 'users',
    toJSON: {
      virtuals: true,
      getters: true,
      // versionKey: false,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
  },
};

export const UserModel = getModelForClass(User, DefaultTransform);
