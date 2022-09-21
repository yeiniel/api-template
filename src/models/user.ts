import { prop, getModelForClass, ReturnModelType, plugin, Ref } from '@typegoose/typegoose';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

// You User Model definition here
@plugin(paginate)
export class User {

  @prop({ required: true, index: true, unique: true })
  email!: string;

  @prop({ required: true })
  name!: string;

  @prop()
  dob?: Date;

  @prop({ required: true })
  role!: number;

  @prop({ required: true })
  password!: string;

  @prop()
  passwordResetToken?: string;

  @prop()
  passwordResetTokenExpires?: Date;

  static getByEmail(this: ReturnModelType<typeof User>, email: string, flag?: boolean) {
    return this.findOne({ email }); 
  }

  static getById(this: ReturnModelType<typeof User>, id: string, flag?: boolean) {
    return this.findById(id);
  }

  static deleteById(this: ReturnModelType<typeof User>, id: string) {
    return this.deleteOne({ _id: id })
  }

  static add(
    this: ReturnModelType<typeof User>,
    newUser: User
  ) {
    return this.create(newUser);
  }

  static paginate: (
    this: ReturnModelType<typeof User>,
    query?: FilterQuery<ReturnModelType<typeof User>>,
    options?: PaginateOptions,
    callback?: (err: Error, result: PaginateResult<ReturnModelType<typeof User>>) => void,
  ) => Promise<PaginateResult<ReturnModelType<typeof User>>>;

  static getUsers(this: ReturnModelType<typeof User>, page: number, limit: number, parsedFilter: FilterQuery<ReturnModelType<typeof User>>) {
    return this.paginate(parsedFilter, { page, limit });
  }

  static updateUser(this: ReturnModelType<typeof User>, id: string, payload: Partial<User>) {
    return this.updateOne({ _id: id }, payload);
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
