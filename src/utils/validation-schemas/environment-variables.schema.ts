import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number(),
  JWT_EXPIRATION_TIME_MINUTES: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
});
