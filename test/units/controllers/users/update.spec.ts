import { Book, NewBook } from "@/interfaces/models/books.ts"
import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { beforeEach, describe, it, vitest } from "vitest"
import { UpdateUsersController } from "../../../../src/controllers/users/update.ts"
import { logger } from "../../mocks/logger.ts"
import { usersRepositoryMock } from "../../mocks/users_repository.ts"

describe("UpdateUsersController", () => {
    function makeSut() {
        const controller = new UpdateUsersController(logger, usersRepositoryMock)

        const newBookMock: NewBook = {
            title: fakerEN.word.words(),
            subtitle: fakerEN.word.words(),
            publishing_company: fakerEN.company.name(),
            published_at: fakerEN.date.anytime(),
            authors: fakerEN.internet.userName(),
        }

        const bookMock: Book = {
            id: fakerEN.string.uuid(),
            ...newBookMock,
        }

        const requestMock = {
            body: newBookMock,
            params: { id: bookMock.id } as any,
        } as Request

        const responseMock = {
            statusCode: 0,
            status: (status: number) => {
                responseMock.statusCode = status
                return {
                    json: vitest.fn(),
                    send: vitest.fn(),
                } as any
            },
        } as Response

        return {
            controller,
            newBookMock,
            bookMock,
            requestMock,
            responseMock,
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it.todo("should update and return user if the user was funded and if there is no other user with the same email")

    it.todo("should return 404 statusCode and not update the user if there is no user with the id provided")

    it.todo("should return 409 statusCode and not update the user if there is an user with the same email")

    it.todo("should return 500 if some error occur")
})
