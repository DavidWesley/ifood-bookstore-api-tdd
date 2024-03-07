import { db, schema } from "@/db/db.ts"
import { Book, NewBook } from "@/interfaces/models/books.ts"
import { IBooksRepository } from "@/interfaces/repositories/books.ts"
import { eq } from "drizzle-orm"

export class BooksRepository implements IBooksRepository {
    public static convert(dbBook: typeof schema.books.$inferSelect): Required<Book> {
        const data: Required<Book> = {
            id: dbBook.id,
            subtitle: dbBook.subtitle,
            title: dbBook.title,
            authors: dbBook.author,
            published_at: dbBook.published_at as Date,
            publishing_company: dbBook.publishing_company,
        }

        return data
    }

    public async create(newBook: NewBook): Promise<Book> {
        const [createdBook] = await db
            .insert(schema.books)
            .values([
                {
                    title: newBook.title,
                    subtitle: newBook.subtitle,
                    author: newBook.authors,
                    publishing_company: newBook.publishing_company,
                    published_at: new Date(newBook.published_at),
                },
            ])
            .returning()

        console.log(createdBook)
        if (!createdBook) throw new Error("Não foi possível cadastrar no banco")
        return BooksRepository.convert(createdBook)
    }

    public async getById(id: Book["id"]): Promise<Required<Book> | undefined> {
        const book = await db.query.books.findFirst({
            where: (table, { eq }) => eq(table.id, id),
        })

        if (!book) return undefined
        return BooksRepository.convert(book)
    }

    public async getByTitle(title: Book["title"]): Promise<Required<Book> | undefined> {
        const book = await db.query.books.findFirst({
            where: (table, { eq }) => eq(table.title, title),
        })

        if (!book) return undefined
        return BooksRepository.convert(book)
    }

    public async listAll(): Promise<Book[]> {
        const books = await db.query.books.findMany()
        return books.map(BooksRepository.convert)
    }

    public async update(id: Book["id"], book: Partial<NewBook>): Promise<void> {
        await db
            .update(schema.books)
            .set({ ...book })
            .where(eq(schema.books.id, id))
    }

    public async delete(id: Book["id"]): Promise<void> {
        await db.delete(schema.books).where(eq(schema.books.id, id))
    }
}
