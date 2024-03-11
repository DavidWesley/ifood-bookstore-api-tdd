import { IBooksRentalsRepository } from "@/interfaces/repositories/booksRental.ts"
import { UUID } from "crypto"
import { Request, Response } from "express"
import { Logger } from "winston"

export class DeleteBooksRentalController {
    constructor(
        private readonly logger: Logger,
        private readonly booksRentalRepository: IBooksRentalsRepository
    ) {}

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const booksRental = await this.booksRentalRepository.getById(id as UUID)
            if (!booksRental) {
                res.status(409).json({ message: "any book rental with the id provided was founded" })
                return
            }

            await this.booksRentalRepository.delete(id as UUID)
            res.status(200).send()
            return
        } catch (err) {
            this.logger.error({ message: "error to delete rental book", error: err })
            res.status(500).json({ message: "something went wrong, try again latter!" })
            return
        }
    }
}
