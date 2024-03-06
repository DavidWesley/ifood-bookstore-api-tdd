import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { UUID, randomUUID } from "node:crypto"

export const users = sqliteTable("users", {
    id: text("id", { length: 36 }).unique().primaryKey().notNull().$type<UUID>().$defaultFn(randomUUID),
    name: text("name", { length: 255 }).notNull(),
    email: text("email", { length: 255 }).unique().notNull(),

    created_at: integer("created_at", { mode: "timestamp" })
        .$defaultFn(() => new Date())
        .notNull(),
    updated_at: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    deleted_at: integer("deleted_at", { mode: "timestamp" }),
})
