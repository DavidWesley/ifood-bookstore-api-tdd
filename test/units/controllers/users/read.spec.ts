import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"

import { ReadUsersController } from "@/controllers/users/read.ts"
import { NewUser, User } from "@/interfaces/models/users.ts"

import { logger } from "test/units/mocks/logger.ts"
import { usersRepositoryMock } from "test/units/mocks/users_repository.ts"

describe("ReadUsersController", () => {
    function makeSut() {
        const newUser: NewUser = {
            name: fakerEN.internet.userName(),
            email: fakerEN.internet.email(),
        }

        const user: User = {
            id: fakerEN.string.uuid() as User["id"],
            ...newUser,
        }

        const request = {
            body: newUser,
            params: { id: user.id } as Request["params"],
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
            stubs: { response, request },
            objects: { user, newUser },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    describe("getById", () => {
        it("should return user if the user exist", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadUsersController(logger, usersRepositoryMock)
            vitest.spyOn(usersRepositoryMock, "getById").mockResolvedValueOnce(objects.user)

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
        })

        it("should return 204 with empty user if the user was not founded", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadUsersController(logger, usersRepositoryMock)
            vitest.spyOn(usersRepositoryMock, "getById").mockResolvedValueOnce(undefined)

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.NO_CONTENT)
        })

        it("should return 500 if some error occur", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadUsersController(logger, usersRepositoryMock)
            vitest.spyOn(usersRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

            const promise = controller.getById(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })

    describe("list", () => {
        it("should return the list of users", async () => {
            const { objects, stubs } = makeSut()
            const controller = new ReadUsersController(logger, usersRepositoryMock)
            vitest.spyOn(usersRepositoryMock, "listAll").mockResolvedValueOnce([objects.user])

            const promise = controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(usersRepositoryMock.listAll).toHaveBeenCalledWith()
            expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
        })

        it("should return 500 if some error occur", async () => {
            const { stubs } = makeSut()
            const controller = new ReadUsersController(logger, usersRepositoryMock)
            vitest.spyOn(usersRepositoryMock, "listAll").mockRejectedValueOnce(new Error("some error"))
            const promise = controller.list(stubs.request, stubs.response)

            await expect(promise).resolves.not.toThrow()
            expect(usersRepositoryMock.listAll).toHaveBeenCalledWith()
            expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        })
    })
})
