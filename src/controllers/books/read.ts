import { UUID } from "node:crypto"

import { Request, Response } from "express"
import { Logger } from "winston"

import { IBooksRepository } from "@/interfaces/repositories/books.ts"

export class ReadBooksController {
    constructor(
        private readonly logger: Logger,
        private readonly booksRepository: IBooksRepository
    ) {}

    public async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        try {
            const book = await this.booksRepository.getById(id as UUID)

            if (book) res.status(200).json(book)
            else res.status(204).send()

            return
        } catch (err) {
            this.logger.error({ message: "error to read book", error: err })
            res.status(500).json({ message: "something went wrong, try again latter!" })
            return
        }
    }

    public async list(req: Request, res: Response): Promise<void> {
        try {
            const book = await this.booksRepository.listAll()
            res.status(200).json(book)
            return
        } catch (err) {
            this.logger.error({ message: "error to read book", error: err })
            res.status(500).json({ message: "something went wrong, try again latter!" })
            return
        }
    }
}
