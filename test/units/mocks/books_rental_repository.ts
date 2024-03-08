import { vitest } from "vitest"

import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"

export const booksRentalRepositoryMock: IBooksRentalRepository = {
    create: (newBookRental: NewBooksRental): Promise<BooksRental> => vitest.fn as any,
    getById: (id: string): Promise<BooksRental | undefined> => vitest.fn as any,
    getByBookId: (id: string): Promise<BooksRental | undefined> => vitest.fn as any,
    listAll: (): Promise<BooksRental[]> => vitest.fn as any,
    delete: (id: string): Promise<void> => vitest.fn as any,
}
