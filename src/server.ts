import http, { Server } from "node:http"

import cors from "cors"
import express, { Application } from "express"
import { rateLimit } from "express-rate-limit"
import helmet from "helmet"
import { StatusCodes } from "http-status-codes"
import morgan from "morgan"

import { Logger } from "@/lib/logger.ts"
import { RoutesBuilder } from "@/routes.ts"

import { CreateBooksController } from "@/controllers/books/create.ts"
import { DeleteBooksController } from "@/controllers/books/delete.ts"
import { ReadBooksController } from "@/controllers/books/read.ts"
import { UpdateBooksController } from "@/controllers/books/update.ts"
import { CreateBooksRentalController } from "@/controllers/books_rental/create.ts"
import { DeleteBooksRentalController } from "@/controllers/books_rental/delete.ts"
import { ReadBooksRentalController } from "@/controllers/books_rental/read.ts"
import { UpdateBooksRentalController } from "@/controllers/books_rental/update.ts"
import { CreateUsersController } from "@/controllers/users/create.ts"
import { ReadUsersController } from "@/controllers/users/read.ts"
import { UpdateUsersController } from "@/controllers/users/update.ts"

import { BooksRepository } from "@/repositories/books.ts"
import { BooksRentalRepository } from "@/repositories/books_rental.ts"
import { UsersRepository } from "@/repositories/users.ts"

const app: Application = express()
const server: Server = http.createServer(app)

const ALLOW_LIST_IPS = ["127.0.0.1", "::1"]

const defaultRateLimiter = rateLimit({
    limit: 10,
    windowMs: 1_000 * 30, // 30 seconds
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    skip: (req) => ALLOW_LIST_IPS.some((ip) => ip === req.ip),
})

app.use(cors())
app.use(defaultRateLimiter)
app.use(express.json())
app.use(helmet())
app.use(
    morgan("dev", {
        stream: {
            write: (message) => Logger.http(message),
        },
    })
)

const booksRepository = new BooksRepository()
const usersRepository = new UsersRepository()
const booksRentalRepository = new BooksRentalRepository()

const createBooksController = new CreateBooksController(Logger, booksRepository)
const readBooksController = new ReadBooksController(Logger, booksRepository)
const updateBooksController = new UpdateBooksController(Logger, booksRepository)
const deleteBooksController = new DeleteBooksController(Logger, booksRepository)

const createUsersController = new CreateUsersController(Logger, usersRepository)
const readUsersController = new ReadUsersController(Logger, usersRepository)
const updateUsersController = new UpdateUsersController(Logger, usersRepository)

const createBooksRentalController = new CreateBooksRentalController(Logger, booksRentalRepository)
const readBooksRentalController = new ReadBooksRentalController(Logger, booksRentalRepository)
const updateBooksRentalController = new UpdateBooksRentalController(Logger, booksRentalRepository)
const deleteBooksRentalController = new DeleteBooksRentalController(Logger, booksRentalRepository)

app.use(
    RoutesBuilder({
        createBooksController,
        readBooksController,
        updateBooksController,
        deleteBooksController,
        createUsersController,
        readUsersController,
        updateUsersController,
        createBooksRentalController,
        readBooksRentalController,
        updateBooksRentalController,
        deleteBooksRentalController,
    })
)

export { server }
