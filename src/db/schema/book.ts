import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { UUID, randomUUID } from "node:crypto"

export const books = sqliteTable(
    "books",
    {
        id: text("id", { length: 36 }).unique().primaryKey().notNull().$type<UUID>().$defaultFn(randomUUID),
        title: text("title", { length: 255 }).notNull(),
        subtitle: text("subtitle", { length: 255 }).notNull(),
        author: text("author", { length: 255 }).notNull(),

        publishing_company: text("publishing_company", { length: 255 }).notNull(),
        published_at: integer("published_at", { mode: "timestamp" }),

        created_at: integer("created_at", { mode: "timestamp" })
            .$defaultFn(() => new Date())
            .notNull(),
        updated_at: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
        deleted_at: integer("deleted_at", { mode: "timestamp" }),
    },
    (table) => ({
        bookIdx: uniqueIndex("book_idx").on(table.title, table.author),
    })
)
