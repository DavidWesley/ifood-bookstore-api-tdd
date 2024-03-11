import { vitest } from "vitest"

import { BookRental, NewBookRental } from "@/interfaces/models/bookRental.ts"
import { IBooksRentalsRepository } from "@/interfaces/repositories/booksRental.ts"

export const booksRentalRepositoryMock: IBooksRentalsRepository = {
    create: (newBookRental: NewBookRental): Promise<BookRental> => vitest.fn() as any,
    getById: (id: BookRental["id"]): Promise<BookRental | undefined> => vitest.fn() as any,
    getByBookId: (id: BookRental["book_id"]): Promise<BookRental | undefined> => vitest.fn() as any,
    listAll: (): Promise<BookRental[]> => vitest.fn() as any,
    update: (id: BookRental["id"], booksRentalProperties: Partial<Omit<BookRental, "id">>): Promise<BookRental | undefined> => vitest.fn() as any,
    delete: (id: BookRental["id"]): Promise<void> => vitest.fn() as any,
}
