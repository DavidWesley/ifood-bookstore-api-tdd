import type { Config } from 'drizzle-kit'

export default {
    schema: './schema/index.ts',
    out: './drizzle',
    driver: 'better-sqlite',
    dbCredentials: {
        url: `./sqlite.${process.env.NODE_ENV ?? "development"}.db`
    },
    verbose: true
} satisfies Config