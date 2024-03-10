import { BooksRental, NewBooksRental } from "../models/booksRental.ts"

export interface IBooksRentalRepository {
    create(newBookRental: NewBooksRental): Promise<BooksRental>
    getById(id: BooksRental["id"]): Promise<BooksRental | undefined>
    getByBookId(bookId: BooksRental["book_id"]): Promise<BooksRental | undefined>
    listAll(): Promise<BooksRental[]>
    update(id: BooksRental["id"], booksRentalProperties: Partial<Omit<BooksRental, "id">>): Promise<BooksRental | undefined>
    delete(id: BooksRental["id"]): Promise<void>
}
