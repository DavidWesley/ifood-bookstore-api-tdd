import { IBooksRentalRepository } from "@/interfaces/repositories/booksRental.ts"
import { Request, Response } from "express"
import { Logger } from "winston"

export class UpdateBooksRentalController {
    constructor(
        private readonly logger: Logger,
        private readonly booksRentalRepository: IBooksRentalRepository
    ) {}

    public async update(req: Request, res: Response): Promise<void> {
        res.status(501).json({ message: "not implemented yet!" })
    }
}
