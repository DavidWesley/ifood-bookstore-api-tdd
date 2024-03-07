import { Book } from "../models/books.ts"

export interface IBooksRepository {
    create(newBook: Omit<Book, "id">): Promise<Required<Book>>
    getById(id: Book["id"]): Promise<Required<Book> | undefined>
    getByTitle(title: Book["title"]): Promise<Required<Book> | undefined>
    listAll(): Promise<Required<Book>[]>
    update(id: Book["id"], book: Partial<Omit<Book, "id">>): Promise<void>
    delete(id: Book["id"]): Promise<void>
}
