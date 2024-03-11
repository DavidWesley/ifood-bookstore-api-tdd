import { NewUser, User } from "@/interfaces/models/users.ts"
import { fakerEN } from "@faker-js/faker"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { beforeEach, describe, expect, it, vitest } from "vitest"
import { UpdateUsersController } from "../../../../src/controllers/users/update.ts"
import { logger } from "../../mocks/logger.ts"
import { usersRepositoryMock } from "../../mocks/users_repository.ts"

describe("UpdateUsersController", () => {
    function makeSut() {

        const newUser: NewUser = {
            name: fakerEN.internet.userName(),
            email: fakerEN.internet.email(),
        }

        const emailConflictUser: NewUser = {
            name: fakerEN.internet.userName(),
            email: "email@conflito",
        }

        const user: User = {
            id: fakerEN.string.uuid() as User["id"],
            ...newUser,
        }

        const conflictingUser: User = {
            id: fakerEN.string.uuid() as User["id"],
            ...emailConflictUser,
        }

        const request = {
            body: newUser,
            params: { id: user.id } as Request["params"],
        } as Request

        const emailConflictingRequest = {
            body: emailConflictUser,
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
            stubs: { emailConflictingRequest, response, request },
            objects: { user, newUser, conflictingUser },
        }
    }

    beforeEach(() => {
        vitest.clearAllMocks()
    })

    it("should update and return user if the user was funded and if there is no other user with the same email", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateUsersController(logger, usersRepositoryMock)
        vitest.spyOn(usersRepositoryMock, "getById").mockResolvedValueOnce(objects.user)
        vitest.spyOn(usersRepositoryMock, "update").mockResolvedValueOnce()

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.OK)
    })

    it("should return 404 statusCode and not update the user if there is no user with the id provided", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateUsersController(logger, usersRepositoryMock)

        vitest.spyOn(usersRepositoryMock, "getById").mockResolvedValueOnce(undefined)
        vitest.spyOn(usersRepositoryMock, "update")

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
        expect(usersRepositoryMock.update).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.NOT_FOUND)
    })

    it("should return 409 statusCode and not update the user if there is an user with the same email", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateUsersController(logger, usersRepositoryMock)
        vitest.spyOn(usersRepositoryMock, "getById").mockResolvedValueOnce(objects.user)
        vitest.spyOn(usersRepositoryMock, "getByEmail").mockResolvedValueOnce(objects.conflictingUser)
        vitest.spyOn(usersRepositoryMock, "update")

        const promise = controller.update(stubs.emailConflictingRequest, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
        expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(objects.conflictingUser.email)
        expect(usersRepositoryMock.update).not.toHaveBeenCalled()
        expect(stubs.response.statusCode).toEqual(StatusCodes.CONFLICT)
    })

    it("should return 500 if some error occur", async () => {
        const { stubs, objects } = makeSut()
        const controller = new UpdateUsersController(logger, usersRepositoryMock)
        vitest.spyOn(usersRepositoryMock, "getById").mockRejectedValueOnce(new Error("some error"))

        const promise = controller.update(stubs.request, stubs.response)

        await expect(promise).resolves.not.toThrow()
        expect(usersRepositoryMock.getById).toHaveBeenCalledWith(objects.user.id)
        expect(stubs.response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
})
