import { prop, getModelForClass } from '@typegoose/typegoose';

// You User Model definition here
export class MaxRetries {
  @prop({ required: true })
  _id?: string;

  @prop({ default: 0 })
  failedLoginAttempts?: number;

}

const DefaultTransform = {
  schemaOptions: {
    collection: 'max-retries',
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

export const MaxRetriesTypegooseModel = getModelForClass(MaxRetries, DefaultTransform);