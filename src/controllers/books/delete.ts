import { UUID } from "node:crypto"

import { Request, Response } from "express"
import { Logger } from "winston"

import { IBooksRepository } from "@/interfaces/repositories/books.ts"

export class DeleteBooksController {
    constructor(
        private readonly logger: Logger,
        private readonly booksRepository: IBooksRepository
    ) {}

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const book = await this.booksRepository.getById(id as UUID)
            if (!book) {
                res.status(404).json({ message: "any book with the id provided was founded" })
                return
            }

            await this.booksRepository.delete(id as UUID)
            res.status(200).send()
            return
        } catch (err) {
            this.logger.error({ message: "error to delete book", error: err })
            res.status(500).json({ message: "something went wrong, try again latter!" })
            return
        }
    }
}
