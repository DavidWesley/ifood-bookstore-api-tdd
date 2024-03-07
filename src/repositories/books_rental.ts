import { db, schema } from "@/db/db.ts"
import { Book } from "@/interfaces/models/books.ts"
import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { User } from "@/interfaces/models/users.ts"
import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"
import { BooksRepository } from "@/repositories/books.ts"
import { UsersRepository } from "@/repositories/users.ts"

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
    ): BooksRental & { user: User; book: Book } {
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

    public async getById(id: BooksRental["id"]): Promise<(BooksRental & { user: User; book: Book }) | undefined> {
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

    // TODO:
    public async getByBookId(book_id: string): Promise<BooksRental | undefined> {
        // const bookRental = await BooksRentalModel.findOne({
        //     where: { book_id },
        //     include: [
        //         {
        //             model: UsersModel,
        //             as: "booksRentalModelUsers",
        //         },
        //         {
        //             model: BooksModel,
        //             as: "booksRentalModelBooks",
        //         },
        //     ],
        // })
        // if (!bookRental) return undefined
        // return {
        //     id: bookRental.id,
        //     book_id: bookRental.book_id,
        //     book: bookRental.booksRentalModelBooks,
        //     user_id: bookRental.user_id,
        //     user: bookRental.booksRentalModelUsers,
        //     rental_time: bookRental.rental_time,
        //     rented_at: bookRental.rented_at,
        // }
    }

    // TODO:
    public async listAll(): Promise<BooksRental[]> {
        //     const booksRentals = await BooksRentalModel.findAll({
        //         include: [
        //             {
        //                 model: UsersModel,
        //                 as: "booksRentalModelUsers",
        //             },
        //             {
        //                 model: BooksModel,
        //                 as: "booksRentalModelBooks",
        //             },
        //         ],
        //     })
        //     return booksRentals.map((bookRental) => ({
        //         id: bookRental.id,
        //         book_id: bookRental.book_id,
        //         book: bookRental.booksRentalModelBooks,
        //         user_id: bookRental.user_id,
        //         user: bookRental.booksRentalModelUsers,
        //         rental_time: bookRental.rental_time,
        //         rented_at: bookRental.rented_at,
        //     }))
    }

    public async delete(id: string): Promise<void> {
        // await BooksRentalModel.destroy({ where: { id } })
    }
}
