import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { CreateUsersController } from "@/controllers/users/create.ts"
import { NewUser, User } from "@/interfaces/models/users.ts"

import { logger } from "test/units/mocks/logger.ts"
import { usersRepositoryMock } from "test/units/mocks/users_repository.ts"

describe("CreateUsersController", () => {
    function makeSut() {
        const newUser: NewUser = {
            name: fakerEN.internet.userName(),
            email: fakerEN.internet.email(),
        }

        const user: User = {
            id: fakerEN.string.uuid() as User["id"],
            ...newUser,
        }

        const request = { body: newUser } as Request

        const response = {
            statusCode: 0,
            status: (status: number) => {
                response.statusCode = status
                return {
                    json: vitest.fn(),
                } as unknown
            },
        } as Response

        return {
            stubs: { request, response },
            objects: { user, newUser },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should create user if there is no other user with the same email", async () => {
        const { objects, stubs } = makeSut()
        const controller = new CreateUsersController(logger, usersRepositoryMock)
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockResolvedValueOnce(undefined)
        vitest.spyOn(usersRepositoryMock, "create").mockResolvedValueOnce(objects.user)

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(objects.newUser.email)
        expect(usersRepositoryMock.create).toHaveBeenCalledWith(objects.newUser)
        expect(stubs.response.statusCode).toEqual(StatusCodes.CREATED)
    })

    it("should return 409 if there is other user with the same email", async () => {
        const { objects, stubs } = makeSut()
        const controller = new CreateUsersController(logger, usersRepositoryMock)
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockResolvedValueOnce(objects.user)
        vitest.spyOn(usersRepositoryMock, "create")

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(objects.newUser.email)
        expect(usersRepositoryMock.create).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { objects, stubs } = makeSut()
        const controller = new CreateUsersController(logger, usersRepositoryMock)
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.create(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(objects.newUser.email)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
