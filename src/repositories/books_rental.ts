import { randomUUID } from "node:crypto"

import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"

// TODO:
// import { BooksModel } from "../db/models/Books"
// import { BooksRentalModel } from "../db/models/BooksRental"
// import { UsersModel } from "../db/models/Users"

export class BooksRentalRepository implements IBooksRentalRepository {
    public async create(newBookRental: NewBooksRental): Promise<BooksRental> {
        const id = randomUUID()
        const bookRental = await BooksRentalModel.create({ id, ...newBookRental })
        return bookRental.dataValues
    }

    public async getById(id: string): Promise<BooksRental> {
        // const bookRental = await BooksRentalModel.findOne({
        //     where: { id },
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
        //     id: bookRental.dataValues.id,
        //     book_id: bookRental.dataValues.book_id,
        //     book: bookRental.booksRentalModelBooks.dataValues,
        //     user_id: bookRental.dataValues.user_id,
        //     user: bookRental.booksRentalModelUsers.dataValues,
        //     rental_time: bookRental.dataValues.rental_time,
        //     rented_at: bookRental.dataValues.rented_at,
        // }
    }

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
        //     id: bookRental.dataValues.id,
        //     book_id: bookRental.dataValues.book_id,
        //     book: bookRental.booksRentalModelBooks.dataValues,
        //     user_id: bookRental.dataValues.user_id,
        //     user: bookRental.booksRentalModelUsers.dataValues,
        //     rental_time: bookRental.dataValues.rental_time,
        //     rented_at: bookRental.dataValues.rented_at,
        // }
    }

    public async list(): Promise<BooksRental[]> {
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
        //         id: bookRental.dataValues.id,
        //         book_id: bookRental.dataValues.book_id,
        //         book: bookRental.booksRentalModelBooks.dataValues,
        //         user_id: bookRental.dataValues.user_id,
        //         user: bookRental.booksRentalModelUsers.dataValues,
        //         rental_time: bookRental.dataValues.rental_time,
        //         rented_at: bookRental.dataValues.rented_at,
        //     }))
    }

    public async delete(id: string): Promise<void> {
        // await BooksRentalModel.destroy({ where: { id } })
    }
}
