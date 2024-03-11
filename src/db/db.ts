import path from "node:path"
import { ENV } from "@/env.ts"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

import * as schema from "./schema/index.ts"

const DATABASE_PATH = path.resolve(import.meta.dirname, `sqlite.${ENV.NODE_ENV}.db`)
export const connection = new Database(DATABASE_PATH, { fileMustExist: false, readonly: false })
export const db = drizzle(connection, {
    logger: ENV.NODE_ENV !== "production",
    schema,
})

export { schema }
