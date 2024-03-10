import { UUID } from "node:crypto"

import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { ReadBooksRentalController } from "@/controllers/books_rental/read.ts"
import { BooksRental, NewBooksRental } from "@/interfaces/models/booksRental.ts"

import { StatusCodes } from "http-status-codes"
import { booksRentalRepositoryMock } from "../../mocks/books_rental_repository.ts"
import { logger } from "../../mocks/logger.ts"

describe("ReadBooksRentalController", () => {
    function makeSut() {
        const controller = new ReadBooksRentalController(logger, booksRentalRepositoryMock)

        const newBooksRental: NewBooksRental = {
            book_id: fakerEN.string.uuid() as UUID,
            user_id: fakerEN.string.uuid() as UUID,
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        }

        const booksRental: BooksRental = {
            id: fakerEN.string.uuid() as UUID,
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
            mocks: { controller },
            stubs: { request, response },
            objects: { newBooksRental, booksRental },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    describe("getById", () => {
        it("should return book rental if the rental was funded", async () => {
            const { mocks, objects, stubs } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(objects.booksRental)

            const promise = mocks.controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
            expect(stubs.response.statusCode).toEqual(200)
        })

        it("should return 204 with empty body if there is not book rental", async () => {
            const { mocks, objects, stubs } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(undefined)

            const promise = mocks.controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledTimes(1)
            expect(stubs.response.statusCode).toEqual(StatusCodes.NO_CONTENT)
        })

        it("should return 500 if some error occur", async () => {
            const { mocks, objects, stubs } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

            const promise = mocks.controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })

    describe("list", () => {
        it("should return the list of books rental", async () => {
            const { mocks, objects, stubs } = makeSut()
            const booksRentalsMock = [objects.booksRental, objects.booksRental]
            vitest.spyOn(booksRentalRepositoryMock, "listAll").mockResolvedValueOnce(booksRentalsMock)

            const promise = mocks.controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.listAll).toHaveBeenCalled()
            expect(stubs.response.statusCode).toEqual(200)
        })

        it("should return 500 if some error occur", async () => {
            const { mocks, objects, stubs } = makeSut()
            vitest.spyOn(booksRentalRepositoryMock, "listAll").mockRejectedValueOnce(new Error("some error"))

            const promise = mocks.controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRentalRepositoryMock.listAll).toHaveBeenCalled()
            expect(stubs.response.statusCode).toEqual(500)
        })
    })
})
