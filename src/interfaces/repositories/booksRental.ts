import { BookRental, NewBookRental } from "../models/bookRental.ts"

export interface IBooksRentalsRepository {
    create(newBookRental: NewBookRental): Promise<BookRental>
    getById(id: BookRental["id"]): Promise<BookRental | undefined>
    getByBookId(bookId: BookRental["book_id"]): Promise<BookRental | undefined>
    listAll(): Promise<BookRental[]>
    update(id: BookRental["id"], bookRentalProperties: Partial<Omit<BookRental, "id">>): Promise<BookRental | undefined>
    delete(id: BookRental["id"]): Promise<void>
}
