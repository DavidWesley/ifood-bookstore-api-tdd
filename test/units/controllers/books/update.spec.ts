import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { UpdateBooksController } from "@/controllers/books/update.ts"
import { Book, NewBook } from "@/interfaces/models/books.ts"

import { booksRepositoryMock } from "test/units/mocks/books_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("UpdateBooksController", () => {
    function makeSut() {
        const newBook: NewBook = {
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            author: fakerEN.internet.userName(),
        }

        const nameConflictingBook: NewBook = {
            title: "testeConflito",
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            author: fakerEN.internet.userName(),
        }

        const book: Book = {
            id: fakerEN.string.uuid() as Book["id"],
            ...newBook,
        }

        const conflictingBook: Book = {
            id: fakerEN.string.uuid() as Book["id"],
            ...nameConflictingBook,
        }

        const request = {
            body: newBook,
            params: { id: book.id } as Request["params"],
        } as Request

        const nameConflictingRequest = {
            body: nameConflictingBook,
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
            stubs: { nameConflictingRequest, request, response },
            objects: { newBook, book, conflictingBook },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should update and return book if the book exist", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(objects.book)
        vitest.spyOn(booksRepositoryMock, "update").mockResolvedValueOnce()

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
    })

    it("should return 404 statusCode and not update the book if there is no book with the id provided", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksController(logger, booksRepositoryMock)

        vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRepositoryMock, "update")

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(booksRepositoryMock.update).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.NOT_FOUND)
    })

    it("should return 409 statusCode and not update the book if there is a book with the same title", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(objects.book)
        vitest.spyOn(booksRepositoryMock, "getByTitle").mockResolvedValueOnce(objects.conflictingBook)
        vitest.spyOn(booksRepositoryMock, "update")

        const promise = controller.update(stubs.nameConflictingRequest, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(booksRepositoryMock.getByTitle).toHaveBeenCalledWith(objects.conflictingBook.title)
        expect(booksRepositoryMock.update).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
