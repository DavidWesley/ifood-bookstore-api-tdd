import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { DeleteBooksRentalController } from "@/controllers/books_rental/delete.ts"
import { BookRental, NewBookRental } from "@/interfaces/models/bookRental.ts"

import { booksRentalRepositoryMock } from "test/units/mocks/books_rental_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("DeleteBooksRentalController", () => {
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

    it("should delete the book rental if the book exist", async () => {
        const { objects, stubs } = makeSut()
        const controller = new DeleteBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(objects.booksRental)
        vitest.spyOn(booksRentalRepositoryMock, "delete").mockResolvedValueOnce()

        const promise = controller.delete(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(booksRentalRepositoryMock.delete).toHaveBeenCalledWith(objects.booksRental.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
    })

    it("should not delete the book rental if there is no rental with the same id", async () => {
        const { objects, stubs } = makeSut()
        const controller = new DeleteBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getById").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRentalRepositoryMock, "delete")

        const promise = controller.delete(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(booksRentalRepositoryMock.delete).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { objects, stubs } = makeSut()
        const controller = new DeleteBooksRentalController(logger, booksRentalRepositoryMock)
        vitest.spyOn(booksRentalRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))
        vitest.spyOn(booksRentalRepositoryMock, "delete")

        const promise = controller.delete(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRentalRepositoryMock.getById).toHaveBeenCalledWith(objects.booksRental.id)
        expect(booksRentalRepositoryMock.delete).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
