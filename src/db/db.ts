import { ENV } from "@/env.ts"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

import * as schema from "./schema/index.ts"

export const connection = new Database("./sqlite.db", { fileMustExist: false, readonly: false })
export const db = drizzle(connection, {
    logger: ENV.NODE_ENV !== "production",
    schema,
})
