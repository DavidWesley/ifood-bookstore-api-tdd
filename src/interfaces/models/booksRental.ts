import { Book } from "./books.ts"
import { User } from "./users.ts"

export type BooksRental = {
    id: string
    book_id: string
    book?: Book
    user_id: string
    user?: User
    rented_at: Date
    rental_time: Date
}

export type NewBooksRental = Omit<BooksRental, "id" | "book" | "user">
