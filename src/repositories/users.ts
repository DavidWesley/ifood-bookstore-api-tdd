import { randomUUID } from "node:crypto"

import { NewUser, User } from "@/interfaces/models/users.ts"
import { IUsersRepository } from "@/interfaces/repositories/users.ts"

// TODO:
// import { UsersModel } from "../db/models/Users.ts"

export class UsersRepository implements IUsersRepository {
    public async create(newUser: NewUser): Promise<User> {
        const id = randomUUID()
        // const user = await UsersModel.create({ id, ...newUser })
        // return user.dataValues
    }

    public async getById(id: string): Promise<User | undefined> {
        // const user = await UsersModel.findOne({ where: { id } })
        // if (!user) return undefined
        // return user.dataValues
    }

    public async getByEmail(email: string): Promise<User | undefined> {
        // const user = await UsersModel.findOne({ where: { email } })
        // if (!user) return undefined
        // return user.dataValues
    }
}
