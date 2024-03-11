import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { CreateBooksController } from "@/controllers/books/create.ts"
import { Book, NewBook } from "@/interfaces/models/books.ts"

import { booksRepositoryMock } from "test/units/mocks/books_repository.ts"
import { logger } from "test/units/mocks/logger.ts"

describe("CreateBooksController", () => {
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

    it("should create book if there is no other book with the same title", async () => {
        const { stubs, objects } = makeSut()
        const controller = new CreateBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getByTitle").mockResolvedValueOnce(undefined)
        vitest.spyOn(booksRepositoryMock, "create").mockResolvedValueOnce(objects.book)

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getByTitle).toHaveBeenCalledWith(objects.newBook.title)
        expect(booksRepositoryMock.create).toHaveBeenCalledWith(objects.newBook)
        expect(stubs.response.statusCode).toEqual(StatusCodes.CREATED)
    })

    it("should return 409 if there is other book with the same title", async () => {
        const { stubs, objects } = makeSut()
        const controller = new CreateBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getByTitle").mockResolvedValueOnce(objects.book)
        vitest.spyOn(booksRepositoryMock, "create")

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getByTitle).toHaveBeenCalledWith(objects.newBook.title)
        expect(booksRepositoryMock.create).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { stubs, objects } = makeSut()
        const controller = new CreateBooksController(logger, booksRepositoryMock)
        vitest.spyOn(booksRepositoryMock, "getByTitle").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getByTitle).toHaveBeenCalledWith(objects.newBook.title)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
