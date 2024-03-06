import { User } from "../models/users.ts"

export interface IUsersRepository {
    create(newUser: Omit<User, "id">): Promise<User>
    getById(id: User["id"]): Promise<User | undefined>
    getByEmail(email: User["email"]): Promise<User | undefined>
}
