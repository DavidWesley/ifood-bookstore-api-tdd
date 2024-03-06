import type { Config } from 'drizzle-kit'

export default {
    schema: './schema/index.ts',
    out: './drizzle',
    driver: 'better-sqlite',
    dbCredentials: {
        url: "./sqlite.db"
    },
    verbose: true
} satisfies Config