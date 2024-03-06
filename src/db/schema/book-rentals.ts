import { relations } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { UUID, randomUUID } from "node:crypto"

import { books } from "./book.ts"
import { users } from "./users.ts"

export const booksRental = sqliteTable("books_rental", {
    id: text("id", { length: 36 }).unique().primaryKey().notNull().$type<UUID>().$defaultFn(randomUUID),
    book_id: text("book_id", { length: 36 })
        .$type<UUID>()
        .notNull()
        .references(() => books.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    user_id: text("user_id", { length: 36 })
        .$type<UUID>()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),

    rented_at: integer("rented_at", { mode: "timestamp" }),
    rental_time: integer("rental_time", { mode: "timestamp" }),

    created_at: integer("created_at", { mode: "timestamp" })
        .$defaultFn(() => new Date())
        .notNull(),
    updated_at: integer("updated_at", { mode: "timestamp" }),
    deleted_at: integer("deleted_at", { mode: "timestamp" }),
})

export const booksRentalRelations = relations(booksRental, ({ one }) => ({
    book: one(books, {
        fields: [booksRental.book_id],
        references: [books.id],
        relationName: "booksRentalModeBooks",
    }),
    user: one(users, {
        fields: [booksRental.user_id],
        references: [users.id],
        relationName: "booksRentalModelUsers",
    }),
}))
