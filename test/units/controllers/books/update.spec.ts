import { UUID } from "node:crypto"

import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { UpdateBooksController } from "@/controllers/books/update.ts"
import { Book, NewBook } from "@/interfaces/models/books.ts"

import { StatusCodes } from "http-status-codes"
import { booksRepositoryMock } from "../../mocks/books_repository.ts"
import { logger } from "../../mocks/logger.ts"

describe("UpdateBooksController", () => {
    function makeSut() {
        const controller = new UpdateBooksController(logger, booksRepositoryMock)

        const newBook: NewBook = {
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            author: fakerEN.internet.userName(),
        }

        const book: Book = {
            id: fakerEN.string.uuid() as UUID,
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
            mocks: { controller },
            stubs: { request, response },
            objects: { newBook, book, },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should update and return book if the book exist", async () => {
        const { mocks, objects, stubs } = makeSut()
        vitest.spyOn(booksRepositoryMock, "getById").mockResolvedValueOnce(objects.book)
        vitest.spyOn(booksRepositoryMock, "update").mockResolvedValueOnce()

        const promise = mocks.controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
    })

    it.todo("should return 404 statusCode and not update the book if there is no book with the id provided")

    it.todo("should return 409 statusCode and not update the book if there is a book with the same title")

    it("should return 500 if some error occur", async () => {
        const { mocks, objects, stubs } = makeSut()
        vitest.spyOn(booksRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

        const promise = mocks.controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(booksRepositoryMock.getById).toHaveBeenCalledWith(objects.book.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
