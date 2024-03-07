import type { Config } from 'drizzle-kit'
import path from "node:path"

export default {
    schema: './schema/index.ts',
    out: './drizzle',
    driver: 'better-sqlite',
    dbCredentials: {
        url: path.resolve(import.meta.dirname, "sqlite.db")
    },
    verbose: true
} satisfies Config