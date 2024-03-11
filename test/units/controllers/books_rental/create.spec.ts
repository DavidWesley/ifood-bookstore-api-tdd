import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { CreateBooksRentalController } from "@/controllers/books_rental/create.ts"
import { BookRental, NewBookRental } from "@/interfaces/models/bookRental.ts"

import { booksRentalRepositoryMock } from "test/units/mocks/books_rental_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("CreateBooksRentalController", () => {
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

    it("should create book rental if there is no other rental with the same book id", async () => {
        const { objects, stubs } = makeSut()
        const controller = new CreateBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRentalRepositoryMock, "create").mockResolvedValueOnce(objects.booksRental)

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(objects.newBooksRental.book_id)
        expect(booksRentalRepositoryMock.create).toHaveBeenCalledWith(objects.newBooksRental)
        expect(stubs.response.statusCode).toEqual(StatusCodes.CREATED)
    })

    it("should return 409 if there is other book rental with the same book id", async () => {
        const { objects, stubs } = makeSut()
        const controller = new CreateBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockResolvedValueOnce(objects.booksRental)
        vitest.spyOn(booksRentalRepositoryMock, "create")

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(objects.newBooksRental.book_id)
        expect(booksRentalRepositoryMock.create).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { objects, stubs } = makeSut()
        const controller = new CreateBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(objects.newBooksRental.book_id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
