import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { ReadBooksController } from "@/controllers/books/read.ts"
import { Book, NewBook } from "@/interfaces/models/books.ts"

import { booksRepositoryMock } from "test/units/mocks/books_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("ReadBooksController", () => {
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

    describe("getById", () => {
        it("should return book if the book exist", async () => {
            const { stubs, objects } = makeSut()
            const controller = new ReadBooksController(logger, booksRepositoryMock)
            vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(objects.book)

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
        })

        it("should return 204 with empty body if the book was not founded", async () => {
            const { stubs, objects } = makeSut()
            const controller = new ReadBooksController(logger, booksRepositoryMock)
            vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(undefined)

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.NO_CONTENT)
        })

        it("should return 500 if some error occur", async () => {
            const { stubs, objects } = makeSut()
            const controller = new ReadBooksController(logger, booksRepositoryMock)
            vitest.spyOn(booksRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })

    describe("list", () => {
        it("should return the list of books", async () => {
            const { stubs, objects } = makeSut()
            const controller = new ReadBooksController(logger, booksRepositoryMock)
            const booksList: Array<Required<Book>> = [objects.book]
            vitest.spyOn(booksRepositoryMock, "listAll").mockResolvedValueOnce(booksList)

            const promise = controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
            expect(booksRepositoryMock.listAll).toHaveBeenCalledOnce()
            expect(booksRepositoryMock.listAll).toReturnWith(booksList)
        })

        it("should return 500 if some error occur", async () => {
            const { stubs } = makeSut()
            const controller = new ReadBooksController(logger, booksRepositoryMock)
            vitest.spyOn(booksRepositoryMock, "listAll").mockRejectedValueOnce(new Error("some error"))

            const promise = controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(booksRepositoryMock.listAll).toHaveBeenCalledOnce()
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })
})
