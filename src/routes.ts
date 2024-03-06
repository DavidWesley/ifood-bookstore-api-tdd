import { Router } from "express"

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

type RouteControllersType = {
    createBooksController: CreateBooksController
    readBooksController: ReadBooksController
    updateBooksController: UpdateBooksController
    deleteBooksController: DeleteBooksController

    createUsersController: CreateUsersController
    readUsersController: ReadUsersController
    updateUsersController: UpdateUsersController

    createBooksRentalController: CreateBooksRentalController
    readBooksRentalController: ReadBooksRentalController
    updateBooksRentalController: UpdateBooksRentalController
    deleteBooksRentalController: DeleteBooksRentalController
}

export const RoutesBuilder = (controllers: RouteControllersType) => {
    const routes = Router()

    routes.post("/v1/books", controllers.createBooksController.create.bind(controllers.createBooksController))
    routes.get("/v1/books", controllers.readBooksController.list.bind(controllers.readBooksController))
    routes.get("/v1/books/:id", controllers.readBooksController.getById.bind(controllers.readBooksController))
    routes.put("/v1/books/:id", controllers.updateBooksController.update.bind(controllers.updateBooksController))
    routes.delete("/v1/books/:id", controllers.deleteBooksController.delete.bind(controllers.deleteBooksController))

    routes.post("/v1/users", controllers.createUsersController.create.bind(controllers.createUsersController))
    routes.get("/v1/users/:id", controllers.readUsersController.getById.bind(controllers.readUsersController))
    routes.get("/v1/users", controllers.readUsersController.list.bind(controllers.readUsersController))
    routes.put("/v1/users/:id", controllers.updateUsersController.update.bind(controllers.updateUsersController))

    routes.post("/v1/rental/books", controllers.createBooksRentalController.create.bind(controllers.createBooksRentalController))
    routes.get("/v1/rental/books", controllers.readBooksRentalController.list.bind(controllers.readBooksRentalController))
    routes.get("/v1/rental/books/:id", controllers.readBooksRentalController.getById.bind(controllers.readBooksRentalController))
    routes.put("/v1/rental/books/:id", controllers.updateBooksRentalController.update.bind(controllers.updateBooksRentalController))
    routes.delete("/v1/rental/books/:id", controllers.deleteBooksRentalController.delete.bind(controllers.deleteBooksRentalController))

    return routes
}
