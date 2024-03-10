# Bookstore API - TDD Practice with Vitest

The Bookstore API is a study project focused on Test-Driven Development (TDD) using Vitest. It provides HTTP endpoints for managing books, book rentals, and user information. This README.md serves as a guide to understand the project structure, installation process, usage instructions, and available scripts.

This project was developed as part of the final test of the TDD module provided by Ada tech in collaboration with iFood.

## Installation

To install the project and its dependencies, follow these steps:

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
```

## Usage

To run tests, use the following command:

```bash
npm test
```

## Routes

### Books

-   **POST /v1/books**: Create a new book.
-   **GET /v1/books**: Retrieve a list of all books.
-   **GET /v1/books/:id**: Retrieve a specific book by ID.
-   **PUT /v1/books/:id**: Update an existing book by ID.
-   **DELETE /v1/books/:id**: Delete a book by ID.

### Book Rentals

-   **POST /v1/rental/books**: Rent a book.
-   **GET /v1/rental/books**: Retrieve a list of all book rentals.
-   **GET /v1/rental/books/:id**: Retrieve a specific book rental by ID.
-   **PUT /v1/rental/books/:id**: Update a book rental by ID.
-   **DELETE /v1/rental/books/:id**: Delete a book rental by ID.

### Users

-   **POST /v1/users**: Create a new user.
-   **GET /v1/users**: Retrieve a list of all users.
-   **GET /v1/users/:id**: Retrieve a specific user by ID.
-   **PUT /v1/users/:id**: Update an existing user by ID.

## Scripts

The following scripts are available:

-   **npm test**: Run tests.
-   **npm run test:watch**: Run tests in watch mode.
-   **npm run test:coverage**: Generate test coverage report.
-   **npm run lint**: Run linting checks.
-   **npm run format**: Format code.
-   **npm start**: Start the server in production mode.
-   **npm run dev**: Start the server in development mode.
-   **npm run build**: Build the project.
