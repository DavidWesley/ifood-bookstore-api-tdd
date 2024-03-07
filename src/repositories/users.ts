import { db, schema } from "@/db/db.ts"
import { NewUser, User } from "@/interfaces/models/users.ts"
import { IUsersRepository } from "@/interfaces/repositories/users.ts"

export class UsersRepository implements IUsersRepository {
    public static convert(dbUser: typeof schema.users.$inferSelect): Required<User> {
        const data: Required<User> = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
        }

        return data
    }

    public async create(newUser: NewUser): Promise<Required<User>> {
        const [createdUser] = await db
            .insert(schema.users)
            .values([
                {
                    email: newUser.email,
                    name: newUser.name,
                },
            ])
            .returning()

        if (!createdUser) throw new Error("Não foi possível cadastrar no banco")

        return UsersRepository.convert(createdUser)
    }

    public async getById(id: User["id"]): Promise<Required<User> | undefined> {
        const user = await db.query.users.findFirst({
            where: (table, { eq }) => eq(table.id, id),
        })

        if (!user) return undefined
        return UsersRepository.convert(user)
    }

    public async getByEmail(email: User["email"]): Promise<Required<User> | undefined> {
        const user = await db.query.users.findFirst({
            where: (table, { eq }) => eq(table.email, email),
        })

        if (!user) return undefined
        return UsersRepository.convert(user)
    }

    public async listAll(): Promise<Required<User>[]> {
        const users = await db.query.users.findMany()
        return users.map(UsersRepository.convert)
    }
}
