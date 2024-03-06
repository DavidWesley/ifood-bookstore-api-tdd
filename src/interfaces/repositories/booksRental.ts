import { BooksRental, NewBooksRental } from "../models/booksRental.ts"

export interface IBooksRentalRepository {
    create(newBookRental: NewBooksRental): Promise<BooksRental>
    getById(id: BooksRental["id"]): Promise<BooksRental | undefined>
    getByBookId(bookId: BooksRental["book_id"]): Promise<BooksRental | undefined>
    list(): Promise<BooksRental[]>
    delete(id: BooksRental["id"]): Promise<void>
}
