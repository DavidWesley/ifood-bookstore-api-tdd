import { CreateUsersController } from "@/controllers/users/create.ts"
import { NewUser, User } from "@/interfaces/models/users.ts"
import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { beforeEach, describe, expect, it, vitest } from "vitest"
import { logger } from "../../mocks/logger.ts"
import { usersRepositoryMock } from "../../mocks/users_repository.ts"

describe("CreateUsersController", () => {
    function makeSut() {
        const controller = new CreateUsersController(logger, usersRepositoryMock)

        const newUserMock: NewUser = {
            name: fakerEN.internet.userName(),
            email: fakerEN.internet.email(),
        }

        const userMock: User = {
            id: fakerEN.string.uuid(),
            ...newUserMock,
        }

        const requestMock = { body: newUserMock } as Request

        const responseMock = {
            statusCode: 0,
            status: (status: number) => {
                responseMock.statusCode = status
                return {
                    json: vitest.fn(),
                } as any
            },
        } as Response

        return {
            controller,
            newUserMock,
            userMock,
            requestMock,
            responseMock,
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should create user if there is no other user with the same email", async () => {
        const { controller, newUserMock, userMock, requestMock, responseMock } = makeSut()
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockResolvedValueOnce(undefined)
        vitest.spyOn(usersRepositoryMock, "create").mockRejectedValueOnce(userMock)

        const promise = controller.create(requestMock, responseMock)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(newUserMock.email)
        expect(usersRepositoryMock.create).toHaveBeenCalledWith(newUserMock)
        expect(responseMock.statusCode).toEqual(201)
    })

    it("should return 409 if there is other user with the same email", async () => {
        const { controller, newUserMock, userMock, requestMock, responseMock } = makeSut()
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockResolvedValueOnce(userMock)
        vitest.spyOn(usersRepositoryMock, "create")

        const promise = controller.create(requestMock, responseMock)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(newUserMock.email)
        expect(usersRepositoryMock.create).not.toHaveBeenCalled()
        expect(responseMock.statusCode).toEqual(409)
    })

    it("should return 500 if some error occur", async () => {
        const { controller, newUserMock, userMock, requestMock, responseMock } = makeSut()
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.create(requestMock, responseMock)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(newUserMock.email)
        expect(responseMock.statusCode).toEqual(500)
    })
})
