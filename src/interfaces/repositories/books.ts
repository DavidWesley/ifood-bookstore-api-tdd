import { Book } from "../models/books.ts"

export interface IBooksRepository {
    create(newBook: Omit<Book, "id">): Promise<Book>
    getById(id: string): Promise<Book | undefined>
    getByTitle(title: string): Promise<Book | undefined>
    list(): Promise<Book[]>
    update(id: string, book: Omit<Book, "id">): Promise<void>
    delete(id: string): Promise<void>
}
