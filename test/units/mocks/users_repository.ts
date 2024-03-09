import { vitest } from "vitest"

import { NewUser, User } from "@/interfaces/models/users.ts"
import { IUsersRepository } from "@/interfaces/repositories/users.ts"

export const usersRepositoryMock: IUsersRepository = {
    create: (newUser: NewUser): Promise<User> => vitest.fn() as any,
    getById: (id: string): Promise<User | undefined> => vitest.fn() as any,
    getByEmail: (email: string): Promise<User | undefined> => vitest.fn() as any,
    listAll: (): Promise<User[]> => vitest.fn() as any
}
