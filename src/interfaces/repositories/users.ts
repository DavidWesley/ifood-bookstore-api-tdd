import { User } from "../models/users.ts"

export interface IUsersRepository {
    create(newUser: Omit<User, "id">): Promise<Required<User>>
    update(id: User["id"], user: Partial<Omit<User, "id">>): Promise<void>
    getById(id: NonNullable<User["id"]>): Promise<Required<User> | undefined>
    getByEmail(email: NonNullable<User["email"]>): Promise<Required<User> | undefined>
    listAll(): Promise<Required<User>[]>
}
