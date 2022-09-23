import { prop, getModelForClass, ReturnModelType, plugin, DocumentType, pre } from '@typegoose/typegoose';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { Role } from '../role';
import { comparePasswords, hashPassword } from '../../helpers/hash.helper';
import { User as IUser } from './user';

// You User Model definition here
@plugin(paginate)
export class User implements IUser {
  @prop({ required: true, index: true, unique: true })
  email!: string;

  @prop({ required: true })
  name!: string;

  @prop()
  dob?: Date;

  @prop({ required: true, enum: Role })
  role!: Role;

  @prop({ 
    required: true,
    get: password => password, 
    set: password => hashPassword(password) 
  })
  password!: string;

  @prop()
  passwordResetToken?: string;

  @prop()
  passwordResetTokenExpires?: Date;

  /** Check whether or not password is the same one of the user
   * 
   * The password stored with the user record has been encrypted
   * therefore direct equality can't be used as a comparizon
   * measure.
   */
   checkPassword(this: DocumentType<User>, password: User['password']) {
    return comparePasswords(password, this.password);
  }

  // required in order to use the paginate plugin
  static paginate: (
    this: ReturnModelType<typeof User>,
    query?: FilterQuery<ReturnModelType<typeof User>>,
    options?: PaginateOptions,
    callback?: (err: Error, result: PaginateResult<ReturnModelType<typeof User>>) => void,
  ) => Promise<PaginateResult<ReturnModelType<typeof User>>>;
}

const DefaultTransform = {
  schemaOptions: {
    collection: 'users',
    // Add createdAt and updatedAt fields
    timestamps: true,
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

export const UserTypegooseModel = getModelForClass(User, DefaultTransform);