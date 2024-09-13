// require('dotenv').config();
import { defineConfig } from 'drizzle-kit';
import { ENV } from './src/env';

console.log(process.env.DATABASE_URL)
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: './.migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL
    // url: process.env.DATABASE_URL as string
  }
})