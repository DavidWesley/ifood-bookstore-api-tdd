import { User } from "../models/users.ts"

export interface IUsersRepository {
    create(newUser: Required<Omit<User, "id">>): Promise<Required<User>>
    getById(id: NonNullable<User["id"]>): Promise<Required<User> | undefined>
    getByEmail(email: NonNullable<User["email"]>): Promise<Required<User> | undefined>
    listAll(): Promise<Required<User>[]>
}
