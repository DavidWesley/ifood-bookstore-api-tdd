import { db, schema } from "@/db/db.ts"
import { BookRental, NewBookRental } from "@/interfaces/models/bookRental.ts"
import { IBooksRentalsRepository } from "@/interfaces/repositories/booksRental.ts"
import { BooksRepository } from "@/repositories/books.ts"
import { UsersRepository } from "@/repositories/users.ts"
import { copyNonNullChangeableProperties } from "@/utils/copyNonNullChangeableProperties.ts"
import { eq } from "drizzle-orm"

export class BooksRentalRepository implements IBooksRentalsRepository {
    protected static convert(dbBookRental: typeof schema.booksRental.$inferSelect): BookRental {
        const data: BookRental = {
            book_id: dbBookRental.book_id,
            id: dbBookRental.id,
            user_id: dbBookRental.user_id,
            rental_time: dbBookRental.rental_time as Date,
            rented_at: dbBookRental.rented_at as Date,
        }

        return data
    }

    protected static convertWith(
        dbBookRental: typeof schema.booksRental.$inferSelect & { user: typeof schema.users.$inferSelect; book: typeof schema.books.$inferSelect }
    ): Required<BookRental> {
        const data: Required<BookRental> = {
            book_id: dbBookRental.book_id,
            id: dbBookRental.id,
            user_id: dbBookRental.user_id,
            rental_time: dbBookRental.rental_time as Date,
            rented_at: dbBookRental.rented_at as Date,
            book: BooksRepository.convert(dbBookRental.book),
            user: UsersRepository.convert(dbBookRental.user),
        }

        return data
    }

    public async create(newBookRental: NewBookRental): Promise<BookRental> {
        const [createdBookRental] = await db
            .insert(schema.booksRental)
            .values([
                {
                    book_id: newBookRental.book_id,
                    user_id: newBookRental.user_id,
                    rented_at: newBookRental.rented_at,
                    rental_time: newBookRental.rental_time,
                },
            ])
            .returning()

        if (!createdBookRental) throw new Error("Não foi possível cadastrar no banco")
        return BooksRentalRepository.convert(createdBookRental)
    }

    public async getById(id: BookRental["id"]): Promise<Required<BookRental> | undefined> {
        const bookRental = await db.query.booksRental.findFirst({
            where: (table, { eq }) => eq(table.id, id),
            with: {
                book: true,
                user: true,
            },
        })

        if (!bookRental) return undefined
        return BooksRentalRepository.convertWith(bookRental)
    }

    public async getByBookId(book_id: BookRental["book_id"]): Promise<Required<BookRental> | undefined> {
        const bookRental = await db.query.booksRental.findFirst({
            where: (table, { eq }) => eq(table.book_id, book_id),
            with: {
                book: true,
                user: true,
            },
        })

        if (!bookRental) return undefined
        return BooksRentalRepository.convertWith(bookRental)
    }

    public async listAll(): Promise<BookRental[]> {
        const bookRentals = await db.query.booksRental.findMany()
        return bookRentals.map(BooksRentalRepository.convert)
    }

    public async update(id: BookRental["id"], booksRentalProperties: Partial<NewBookRental>): Promise<BookRental | undefined> {
        const properties = copyNonNullChangeableProperties<Omit<BookRental, "id">>(booksRentalProperties) as Omit<BookRental, "id">

        const [updatedBookRental] = await db
            .update(schema.booksRental)
            .set({ ...properties })
            .where(eq(schema.booksRental.id, id))
            .returning()

        if (!updatedBookRental) return

        return BooksRentalRepository.convert(updatedBookRental)
    }

    public async delete(id: BookRental["id"]): Promise<void> {
        await db.delete(schema.booksRental).where(eq(schema.booksRental.id, id))
    }
}
