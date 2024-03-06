import { UUID } from "node:crypto"

export type User = {
    id: UUID
    name: string
    email: string
}

export type NewUser = Omit<User, "id">
