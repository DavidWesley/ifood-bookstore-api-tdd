import { ReadBooksRentalController } from "@/controllers/books_rental/read.ts"
import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"
import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { beforeEach, describe, expect, it, vitest } from "vitest"
import { booksRentalRepositoryMock } from "../../mocks/books_rental_repository.ts"
import { logger } from "../../mocks/logger.ts"

describe("ReadBooksRentalController", () => {
    function makeSut() {
        const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)

        const newBooksRentalMock: NewBooksRental = {
            book_id: fakerEN.string.uuid(),
            user_id: fakerEN.string.uuid(),
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        }

        const booksRentalMock: BooksRental = {
            id: fakerEN.string.uuid(),
            ...newBooksRentalMock,
        }

        const requestMock = {
            body: newBooksRentalMock,
            params: { id: booksRentalMock.id } as any,
        } as Request

        const responseMock = {
            statusCode: 0,
            status: (status: number) => {
                responseMock.statusCode = status
                return {
                    json: vitest.fn(),
                    send: vitest.fn(),
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

    describe("getById", () => {
        it("should return book rental if the rental was funded", async () => {
            const { controller, newBooksRentalMock, booksRentalMock, requestMock, responseMock } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(booksRentalMock)

            const promise = controller.getById(requestMock, responseMock)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(booksRentalMock.id)
            expect(responseMock.statusCode).toEqual(200)
        })

        it("should return 204 with empty body if there is not book rental", async () => {
            const { controller, newBooksRentalMock, booksRentalMock, requestMock, responseMock } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(undefined)

            const promise = controller.getById(requestMock, responseMock)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(booksRentalMock.id)
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledTimes(2)
            expect(responseMock.statusCode).toEqual(204)
        })

        it("should return 500 if some error occur", async () => {
            const { controller, newBooksRentalMock, booksRentalMock, requestMock, responseMock } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

            const promise = controller.getById(requestMock, responseMock)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(booksRentalMock.id)
            expect(responseMock.statusCode).toEqual(500)
        })
    })

    describe("list", () => {
        it.todo("should return the list of books rental")

        it.todo("should return 500 if some error occur")
    })
})
