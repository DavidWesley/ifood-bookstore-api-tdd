import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Logger } from "winston"

export class UpdateBooksRentalController {
    constructor(
        private readonly logger: Logger,
        private readonly booksRentalRepository: IBooksRentalRepository
    ) { }

    public async update(req: Request<{ id: BooksRental["id"] }, unknown, NewBooksRental>, res: Response): Promise<BooksRental | undefined> {
        const { id } = req.params
        const body = req.body

        try {
            const bookRental = await this.booksRentalRepository.getById(id)
            if (!bookRental) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "any bookRental with the id provided was founded" })
                return
            }

            if (body.book_id) {
                const bookRentalWithThisBookId = await this.booksRentalRepository.getByBookId(body.book_id)
                if (bookRentalWithThisBookId) {
                    res.status(StatusCodes.CONFLICT).json({ message: "already exists some active bookRental with this book_id" })
                    return
                }
            }

            const updatedBookRental = await this.booksRentalRepository.update(id, body)

            res.status(StatusCodes.OK).json(updatedBookRental)
            return
        } catch (err) {
            this.logger.error({ message: "error to update bookRental", error: err })
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong, try again latter!" })
            return
        }
    }
}
