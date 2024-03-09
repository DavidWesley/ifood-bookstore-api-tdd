import { vitest } from "vitest"

import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"

export const booksRentalRepositoryMock: IBooksRentalRepository = {
    create: (newBookRental: NewBooksRental): Promise<BooksRental> => vitest.fn(() => undefined) as any,
    getById: (id: BooksRental["id"]): Promise<BooksRental | undefined> => vitest.fn(() => undefined) as any,
    getByBookId: (id: BooksRental["book_id"]): Promise<BooksRental | undefined> => vitest.fn(() => undefined) as any,
    listAll: (): Promise<BooksRental[]> => vitest.fn(() => undefined) as any,
    delete: (id: BooksRental["id"]): Promise<void> => vitest.fn(() => undefined) as any,
}
