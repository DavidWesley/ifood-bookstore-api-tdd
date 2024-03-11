import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { UpdateBooksRentalController } from "@/controllers/books_rental/update.ts"
import { BookRental, NewBookRental } from "@/interfaces/models/bookRental.ts"

import { booksRentalRepositoryMock } from "test/units/mocks/books_rental_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("UpdateBooksRentalController", () => {
    function makeSut() {
        const createBooksRental: NewBookRental = {
            book_id: fakerEN.string.uuid() as BookRental["book_id"],
            user_id: fakerEN.string.uuid() as BookRental["user_id"],
            rented_at: fakerEN.date.anytime(),
            rental_time: fakerEN.date.anytime(),
        }

        const booksRental: BookRental = {
            id: fakerEN.string.uuid() as BookRental["id"],
            ...createBooksRental,
        }

        const request = {
            body: createBooksRental,
            params: { id: booksRental.id } as Request["params"],
        } as Request<{ id: BookRental["id"] }, unknown, Omit<BookRental, "id">>

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
            objects: { createBooksRental, booksRental },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should update and return book rental if the book rental exist", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksRentalController(logger, booksRentalRepositoryMock)
        const updatedBookRental: NewBookRental = {
            ...objects.createBooksRental,
            rented_at: new Date(fakerEN.date.anytime()),
        }
        vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(objects.booksRental)
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRentalRepositoryMock, "update").mockResolvedValueOnce({ ...objects.booksRental, ...updatedBookRental })

        const expectedUpdatedBookRental: BookRental = {
            id: objects.booksRental.id,
            ...updatedBookRental,
        }

        stubs.request.body = updatedBookRental
        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(booksRentalRepositoryMock.update).toHaveBeenCalledOnce()
        expect(booksRentalRepositoryMock.update).toHaveBeenCalledWith(objects.booksRental.id, updatedBookRental)
        expect(booksRentalRepositoryMock.update).toHaveReturnedWith(expectedUpdatedBookRental)
        expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
    })

    it("should return 404 statusCode and not update the book rental if there is no rental with the id provided", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValue(undefined)
        vitest.spyOn(booksRentalRepositoryMock, "update")

        stubs.request.body = {
            ...objects.createBooksRental,
            rented_at: new Date(fakerEN.date.anytime()),
        }
        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(booksRentalRepositoryMock.update).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.NOT_FOUND)
    })

    it("should return 409 statusCode and not update the book rental if there is a rental with the same book id", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksRentalController(logger, booksRentalRepositoryMock)

        const anotherBookRental: BookRental = {
            ...objects.booksRental,
            book_id: fakerEN.string.uuid() as BookRental["book_id"],
        }

        vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(objects.booksRental)
        vitest.spyOn(booksRentalRepositoryMock, "getByBookId").mockResolvedValue(anotherBookRental)
        vitest.spyOn(booksRentalRepositoryMock, "update")

        stubs.request.body = { ...objects.createBooksRental, book_id: anotherBookRental.book_id }
        stubs.request.params = { id: objects.booksRental.id }
        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledOnce()
        expect(booksRentalRepositoryMock.getByBookId).toHaveBeenCalledWith(anotherBookRental.book_id)
        expect(booksRentalRepositoryMock.update).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
