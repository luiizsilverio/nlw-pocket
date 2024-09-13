import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import * as schema from './schema';
import { ENV } from "../env";

export const client = postgres(ENV.DATABASE_URL);

export const db = drizzle(client, { schema, logger: false }); // logger é opcional
