import { UUID } from "crypto"
import { Book } from "./books.ts"
import { User } from "./users.ts"

export type BooksRental = {
    id: UUID
    book_id: Book["id"]
    book?: Book
    user_id: User["id"]
    user?: User
    rented_at: Date
    rental_time: Date
}

export type NewBooksRental = Omit<BooksRental, "id" | "book" | "user">
