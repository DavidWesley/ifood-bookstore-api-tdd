import { db, schema } from "@/db/db.ts"
import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"
import { BooksRepository } from "@/repositories/books.ts"
import { UsersRepository } from "@/repositories/users.ts"
import { eq } from "drizzle-orm"

export class BooksRentalRepository implements IBooksRentalRepository {
    protected static convert(dbBookRental: typeof schema.booksRental.$inferSelect): BooksRental {
        const data: BooksRental = {
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
    ): Required<BooksRental> {
        const data: Required<BooksRental> = {
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

    public async create(newBookRental: NewBooksRental): Promise<BooksRental> {
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

    public async getById(id: BooksRental["id"]): Promise<Required<BooksRental> | undefined> {
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

    public async getByBookId(book_id: BooksRental["book_id"]): Promise<Required<BooksRental> | undefined> {
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

    public async listAll(): Promise<BooksRental[]> {
        const bookRentals = await db.query.booksRental.findMany()
        return bookRentals.map(BooksRentalRepository.convert)
    }

    public async delete(id: BooksRental["id"]): Promise<void> {
        await db.delete(schema.booksRental).where(eq(schema.booksRental.id, id))
    }
}
