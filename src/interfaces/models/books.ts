import { UUID } from "node:crypto"

export type Book = {
    id: UUID
    title: string
    subtitle: string
    publishing_company: string
    published_at: Date
    authors: string
}

export type NewBook = Omit<Book, "id">
