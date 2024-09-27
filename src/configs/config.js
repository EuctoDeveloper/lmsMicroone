// File to validate the .env, then group it and export it as default


import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Joi from 'joi';

// Resolve __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv
dotenv.config({
    path: join(__dirname, '../..', '.env'),
});

const envVarsSchema = Joi.object().keys({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    APP_SECRET: Joi.string().required(),
    ENCRYPT_KEY: Joi.string().required(),
}).unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Invalid environment variables: ${error.details.map(d => d.message).join(', ')}`);
}

export default {
    env: value.NODE_ENV,
    port: value.PORT,
    mongoDbUri: value.MONGODB_URI,
    jwt_secret: value.JWT_SECRET,
    appSecret: value.APP_SECRET,
    key: value.ENCRYPT_KEY,
}