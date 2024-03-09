import { vitest } from "vitest"

import { Book, NewBook } from "@/interfaces/models/books.ts"
import { IBooksRepository } from "@/interfaces/repositories/books.ts"

export const booksRepositoryMock: IBooksRepository = {
    create: (newBook: NewBook): Promise<Book> => vitest.fn(() => undefined) as any,
    getById: (id: string): Promise<Book | undefined> => vitest.fn(() => undefined) as any,
    getByTitle: (title: string): Promise<Book | undefined> => vitest.fn(() => undefined) as any,
    listAll: (): Promise<Book[]> => vitest.fn(() => undefined) as any,
    update: (id: string, book: NewBook): Promise<void> => vitest.fn(() => undefined) as any,
    delete: (id: string): Promise<void> => vitest.fn(() => undefined) as any,
}
