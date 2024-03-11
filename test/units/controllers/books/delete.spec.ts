import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { DeleteBooksController } from "@/controllers/books/delete.ts"
import { Book, NewBook } from "@/interfaces/models/books.ts"

import { booksRepositoryMock } from "test/units/mocks/books_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("DeleteBooksController", () => {
    function makeSut() {
        const newBook: NewBook = {
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            author: fakerEN.internet.userName(),
        }

        const book: Book = {
            id: fakerEN.string.uuid() as Book["id"],
            ...newBook,
        }

        const request = {
            body: newBook,
            params: { id: book.id } as Request["params"],
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
            objects: { newBook, book },
            stubs: { request, response },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should delete the book if the book exist", async () => {
        const { objects, stubs } = makeSut()
        const controller = new DeleteBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(objects.book)
        vitest.spyOn(booksRepositoryMock, "delete").mockResolvedValueOnce()

        const promise = controller.delete(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(booksRepositoryMock.delete).toHaveBeenCalledWith(objects.book.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
    })

    it("should not delete the book if there is no book with the id provided", async () => {
        const { objects, stubs } = makeSut()
        const controller = new DeleteBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRepositoryMock, "delete")

        const promise = controller.delete(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(booksRepositoryMock.delete).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.NOT_FOUND)
    })

    it("should return 500 if some error occur", async () => {
        const { objects, stubs } = makeSut()
        const controller = new DeleteBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))
        vitest.spyOn(booksRepositoryMock, "delete")

        const promise = controller.delete(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(booksRepositoryMock.delete).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
