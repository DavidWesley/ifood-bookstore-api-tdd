import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { ReadBooksRentalController } from "@/controllers/books_rental/read.ts"
import { BookRental, NewBookRental } from "@/interfaces/models/bookRental.ts"

import { booksRentalRepositoryMock } from "test/units/mocks/books_rental_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("ReadBooksRentalController", () => {
    function makeSut() {
        const newBooksRental: NewBookRental = {
            book_id: fakerEN.string.uuid() as BookRental["book_id"],
            user_id: fakerEN.string.uuid() as BookRental["user_id"],
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        }

        const booksRental: BookRental = {
            id: fakerEN.string.uuid() as BookRental["id"],
            ...newBooksRental,
        }

        const request = {
            body: newBooksRental,
            params: { id: booksRental.id } as Request["params"],
        } as Request

        const response = {
            statusCode: 0,
            status: (status: number) => {
                response.statusCode = status
                return {
                    json: vitest.fn(),
                    send: vitest.fn(),
                } as unknown
            },
        } as Response

        return {
            stubs: { request, response },
            objects: { newBooksRental, booksRental },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    describe("getById", () => {
        it("should return book rental if the rental was funded", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(objects.booksRental)

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
        })

        it("should return 204 with empty body if there is not book rental", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(undefined)

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledOnce()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.NO_CONTENT)
        })

        it("should return 500 if some error occur", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })

    describe("list", () => {
        it("should return the list of books rental", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)
            const booksRentalsList = [objects.booksRental, objects.booksRental]
            vitest.spyOn(booksRentalRepositoryMock, "listAll").mockResolvedValueOnce(booksRentalsList)

            const promise = controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.listAll).toHaveBeenCalledOnce()
            expect(booksRentalRepositoryMock.listAll).toReturnWith(booksRentalsList)
            expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
        })

        it("should return 500 if some error occur", async () => {
            const { stubs } = makeSut()
            const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)
            vitest.spyOn(booksRentalRepositoryMock, "listAll").mockRejectedValueOnce(new Error("some error"))

            const promise = controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.listAll).toHaveBeenCalledOnce()
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })
})
