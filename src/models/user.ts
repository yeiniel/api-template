import { prop, getModelForClass, ReturnModelType, plugin, Ref, DocumentType } from '@typegoose/typegoose';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { comparePasswords } from '../helpers/hash.helper';

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
    newUser: Omit<User, 'checkPassword'>
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

  /** Check whether or not password is the same one of the user
   * 
   * The password stored with the user record has been encrypted
   * therefore direct equality can't be used as a comparizon
   * measure.
   */
  checkPassword(this: DocumentType<User>, password: User['password']) {
    return comparePasswords(password, this.password);
  }

  /** Check whether or not credentials match those of a registered user */
  static async checkCredentials(this: ReturnModelType<typeof User>, email: User['email'], password: User['password']) {
    const user = await this.findOne({ email });

    return user && user.checkPassword(password) ? user : false;
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
