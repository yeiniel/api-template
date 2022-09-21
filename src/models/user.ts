import { prop, getModelForClass, ReturnModelType, plugin, Ref } from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';

// You User Model definition here
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

  static getByEmail(this: ReturnModelType<typeof User>, email: string, flag?: boolean) {
    return this.findOne({ email }); 
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
