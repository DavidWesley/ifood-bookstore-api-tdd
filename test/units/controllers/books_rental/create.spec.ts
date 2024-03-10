import { CreateBooksRentalController } from "@/controllers/books_rental/create.ts"
import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { fakerEN } from "@faker-js/faker"
import { UUID } from "crypto"
import { Request, Response } from "express"
import { beforeEach, describe, expect, it, vitest } from "vitest"
import { booksRentalRepositoryMock } from "../../mocks/books_rental_repository.ts"
import { logger } from "../../mocks/logger.ts"

describe("CreateBooksRentalController", () => {
    function makeSut() {
        const controller = new CreateBooksRentalController(logger, booksRentalRepositoryMock)

        const newBooksRentalMock: NewBooksRental = {
            book_id: fakerEN.string.uuid() as UUID,
            user_id: fakerEN.string.uuid() as UUID,
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        }

        const booksRentalMock: BooksRental = {
            id: fakerEN.string.uuid() as UUID,
            ...newBooksRentalMock,
        }

        const requestMock = { body: newBooksRentalMock } as Request

        const responseMock = {
            statusCode: 0,
            status: (status: number) => {
                responseMock.statusCode = status
                return {
                    json: vitest.fn(),
                } as any
            },
        } as Response

        return {
            controller,
            newBooksRentalMock,
            booksRentalMock,
            requestMock,
            responseMock,
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should create book rental if there is no other rental with the same book id", async () => {
        const { controller, newBooksRentalMock, booksRentalMock, requestMock, responseMock } = makeSut()
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRentalRepositoryMock, "create").mockResolvedValueOnce(booksRentalMock)

        const promise = controller.create(requestMock, responseMock)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(newBooksRentalMock.book_id)
        expect(booksRentalRepositoryMock.create).toHaveBeenCalledWith(newBooksRentalMock)
        expect(responseMock.statusCode).toEqual(201)
    })

    it("should return 409 if there is other book rental with the same book id", async () => {
        const { controller, newBooksRentalMock, booksRentalMock, requestMock, responseMock } = makeSut()
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockResolvedValueOnce(booksRentalMock)
        vitest.spyOn(booksRentalRepositoryMock, "create")

        const promise = controller.create(requestMock, responseMock)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(newBooksRentalMock.book_id)
        expect(booksRentalRepositoryMock.create).not.toHaveBeenCalled()
        expect(responseMock.statusCode).toEqual(409)
    })

    it("should return 500 if some error occur", async () => {
        const { controller, newBooksRentalMock, booksRentalMock, requestMock, responseMock } = makeSut()
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.create(requestMock, responseMock)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(newBooksRentalMock.book_id)
        expect(responseMock.statusCode).toEqual(500)
    })
})
