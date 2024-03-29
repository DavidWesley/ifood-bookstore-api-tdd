## HTTP API Endpoints

<details>

<summary>Books Endpoints</summary>

### POST /v1/books

**Criar uma Nova Entrada de Livro**

Este endpoint permite criar uma nova entrada de livro no sistema. Você deve fornecer detalhes sobre o livro, incluindo seu título, subtítulo, editora, data de publicação e autor.

**HTTP Request**

- Method: POST
- URL: localhost:3000/v1/books
- Headers:
  - Content-Type: application/json

**Payload**

O corpo da requisição deve ser um objeto JSON contendo os seguintes campos:

- title (string): O título do livro.
- subtitle (string): O subtítulo do livro.
- publishing_company (string): O nome da editora.
- published_at (string): A data de publicação no formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).
- author (string): O autor do livro.

**Example Request**

```bash
  curl --location --request POST 'localhost:3000/v1/books' \
  --header 'Content-Type: application/json' \
  --data '{
      "title": "Nakfa Intelligent Awesome",
      "subtitle": "Chair programming productize Books maroon",
      "publishing_company": "Powlowski, Hackett and Bogan",
      "published_at": "2024-03-03T14:21:28.179Z",
      "author": "author"
  }'
```

### GET /v1/books/:id

**Consultar Detalhes de um Livro Específico**

Este endpoint permite consultar os detalhes de um livro específico no sistema utilizando seu identificador único (ID).

**Requisição HTTP**

- Método: GET
- URL: localhost:3000/v1/books/{id}
  - Substitua {id} pelo ID único do livro que deseja consultar.
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para consultar os detalhes do livro com o ID 6de35865-9584-4c2e-bb30-65be53e62907, utilize a seguinte requisição curl:

```bash
curl --location --request GET 'localhost:3000/v1/books/6de35865-9584-4c2e-bb30-65be53e62907'
```

**Resposta**

A resposta será um objeto JSON contendo detalhes completos do livro, incluindo título, subtítulo, editora, data de publicação e autor.

### GET /v1/books

**Consultar Lista de Livros**

Este endpoint permite consultar a lista completa de livros disponíveis no sistema. Você pode usar este endpoint para obter uma visão geral de todos os livros registrados.

**Requisição HTTP**

- Método: GET
- URL: localhost:3000/v1/books
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para consultar a lista completa de livros, utilize a seguinte requisição curl:

```bash
curl --location --request GET 'localhost:3000/v1/books'
```

**Resposta**

A resposta será um array de objetos JSON, cada um contendo detalhes de um livro específico, incluindo título, subtítulo, editora, data de publicação e autor.

### PUT /v1/books/:id

**Atualizar Detalhes de um Livro Específico**

Este endpoint permite atualizar os detalhes de um livro específico no sistema utilizando seu identificador único (ID). Você pode modificar o título, subtítulo, editora, data de publicação e autor do livro.

**Requisição HTTP**

- Método: PUT
- URL: localhost:3000/v1/books/{id}
  - Substitua {id} pelo ID único do livro que deseja atualizar.
- Cabeçalhos
  - Content-Type: application/json

**Payload**

O corpo da requisição deve ser um objeto JSON contendo um ou mais dos seguintes campos que deseja atualizar:

- title (string): O novo título do livro.
- subtitle (string): O novo subtítulo do livro.
- publishing_company (string): O novo nome da editora.
- published_at (string): A nova data de publicação no formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).
- author (string): O novo autor do livro.

**Exemplo de Requisição**

Para atualizar os detalhes do livro com o ID 6de35865-9584-4c2e-bb30-65be53e62907, utilize a seguinte requisição curl:

```bash
curl --location --request PUT 'localhost:3000/v1/books/6de35865-9584-4c2e-bb30-65be53e62907' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Fantastic bypassing Unbranded RAM",
    "subtitle": "RSS Rubber",
    "publishing_company": "White and Sons",
    "published_at": "2024-03-03T14:34:14.507Z",
    "author": "author"
}'
```

**Resposta**

A resposta será um objeto JSON contendo os detalhes atualizados do livro.

### DELETE /v1/books/:id

**Excluir um Livro Específico**

Este endpoint permite excluir um livro específico do sistema utilizando seu identificador único (ID). Esta ação é irreversível e deve ser usada com cautela.

**Requisição HTTP**

- Método: DELETE
- URL: localhost:3000/v1/books/{id}
  - Substitua {id} pelo ID único do livro que deseja excluir.
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para excluir o livro com o ID 6de35865-9584-4c2e-bb30-65be53e62907, utilize a seguinte requisição curl:

```bash
curl --location --request DELETE 'localhost:3000/v1/books/6de35865-9584-4c2e-bb30-65be53e62907'
```

</details>

<details>

<summary>Users Endpoints</summary>

### POST /v1/users

**Criar um Novo Usuário**

Este endpoint permite criar um novo usuário no sistema. Você deve fornecer detalhes sobre o usuário, incluindo seu nome e e-mail.

**Requisição HTTP**

- Método: POST
- URL: localhost:3000/v1/users
- Cabeçalhos:
  - Content-Type: application/json

**Payload**

O corpo da requisição deve ser um objeto JSON contendo os seguintes campos:

- name (string): O nome completo do usuário.
- email (string): O endereço de e-mail do usuário.

**Exemplo de Requisição**

Para criar um novo usuário com o nome "Rudolph Gibson" e o e-mail "Carmela10@gmail.com", utilize a seguinte requisição curl:

```bash
curl --location --request POST 'localhost:3000/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Rudolph Gibson",
    "email": "Carmela10@gmail.com"
}'
```

**Resposta**

A resposta será um objeto JSON contendo os detalhes do usuário recém-criado, incluindo um ID único gerado pelo sistema, nome e e-mail.

### GET /v1/users/:id

**Consultar Detalhes de um Usuário Específico**

Este endpoint permite consultar os detalhes de um usuário específico no sistema utilizando seu identificador único (ID).

**Requisição HTTP**

- Método: GET
- URL: localhost:3000/v1/users/{id}
  - Substitua {id} pelo ID único do usuário que deseja consultar.
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para consultar os detalhes do usuário com o ID 1d4995fb-dd71-4f87-b2c2-0b888563ef25, utilize a seguinte requisição curl:

```bash
curl --location --request GET 'localhost:3000/v1/users/1d4995fb-dd71-4f87-b2c2-0b888563ef25'
```

**Resposta**

A resposta será um objeto JSON contendo detalhes do usuário, incluindo ID, nome e endereço de e-mail.

### GET /v1/users

**Consultar Lista de Usuários**

Este endpoint permite consultar a lista completa de usuários registrados no sistema. Você pode usar este endpoint para obter uma visão geral de todos os usuários.

- Requisição HTTP
- Método: GET
- URL: localhost:3000/v1/users
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para consultar a lista completa de usuários, utilize a seguinte requisição curl:

```bash
curl --location --request GET 'localhost:3000/v1/users'
```

**Resposta**

A resposta será um array de objetos JSON, cada um contendo detalhes de um usuário específico, incluindo ID, nome e endereço de e-mail.

### PUT /v1/users/:id

**Atualizar Detalhes de um Usuário Específico**

Este endpoint permite atualizar os detalhes de um usuário específico no sistema utilizando seu identificador único (ID). Você pode modificar o nome e o e-mail do usuário.

**Requisição HTTP**

- Método: PUT
- URL: localhost:3000/v1/users/{id}
  - Substitua {id} pelo ID único do usuário que deseja atualizar.
- Cabeçalhos
  - Content-Type: application/json

**Payload**

O corpo da requisição deve ser um objeto JSON contendo os campos que deseja atualizar:

- name (string): O novo nome do usuário.
- email (string): O novo endereço de e-mail do usuário.

**Exemplo de Requisição**

Para atualizar os detalhes do usuário com o ID 0c8c9fe0-f35f-4b0d-8570-0cb8f1238c5c, utilize a seguinte requisição curl:

```bash
curl --location --request PUT 'localhost:3000/v1/users/0c8c9fe0-f35f-4b0d-8570-0cb8f1238c5c' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Person 1",
    "email": "person@email.com"
}'
```

**Resposta**

A resposta será um objeto JSON contendo os detalhes atualizados do usuário.

</details>


<details>

<summary>Books Rental Endpoints</summary>

### POST /v1/rental/books

**Criar um Novo Aluguel de Livro**

Este endpoint permite registrar um novo aluguel de livro no sistema. Você deve fornecer os identificadores do livro e do usuário, além das datas de início do aluguel e do tempo estimado de aluguel.

**Requisição HTTP**

- Método: POST
- URL: localhost:3000/v1/rental/books
- Cabeçalhos:
  - Content-Type: application/json

**Payload**

O corpo da requisição deve ser um objeto JSON contendo os seguintes campos:

- book_id (string): O ID do livro sendo alugado.
- user_id (string): O ID do usuário que está alugando o livro.
- rented_at (string): A data e hora de início do aluguel no formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).
- rental_time (string): A data e hora estimada para o fim do aluguel no formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).

**Exemplo de Requisição**

Para registrar um novo aluguel para o livro com ID 7d5432cd-d831-4e3b-8b3a-3b6d35df0053 pelo usuário com ID 1d4995fb-dd71-4f87-b2c2-0b888563ef25, com início em "2024-03-03T14:56:53.980Z" e tempo estimado de aluguel até "2024-03-10T14:56:53.980Z", utilize a seguinte requisição curl:

```bash
curl --location --request POST 'localhost:3000/v1/rental/books' \
--header 'Content-Type: application/json' \
--data '{
    "book_id": "7d5432cd-d831-4e3b-8b3a-3b6d35df0053",
    "user_id": "1d4995fb-dd71-4f87-b2c2-0b888563ef25",
    "rented_at": "2024-03-03T14:56:53.980Z",
    "rental_time": "2024-03-10T14:56:53.980Z"
}'
```

**Resposta**

A resposta será um objeto JSON contendo os detalhes do aluguel registrado, incluindo IDs de livro e usuário, datas de início e fim do aluguel.

### GET /v1/rental/books/:id

**Consultar Detalhes de um Aluguel de Livro Específico**

Este endpoint permite consultar os detalhes de um aluguel de livro específico no sistema, utilizando seu identificador único (ID). Isso inclui informações sobre o livro alugado, o usuário que fez o aluguel, a data de início do aluguel e a data estimada de retorno.

**Requisição HTTP**

- Método: GET
- URL: localhost:3000/v1/rental/books/{id}
  - Substitua {id} pelo ID único do aluguel de livro que deseja consultar.
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para consultar os detalhes do aluguel de livro com o ID af322af1-084a-4496-805c-f4113886ad85, utilize a seguinte requisição curl:

```bash
curl --location --request GET 'localhost:3000/v1/rental/books/af322af1-084a-4496-805c-f4113886ad85'
```

**Resposta**

A resposta será um objeto JSON contendo detalhes do aluguel, incluindo o ID do livro, o ID do usuário, a data de início do aluguel e a data estimada de retorno.

### GET /v1/rental/books

**Consultar Lista de Aluguéis de Livros**

Este endpoint permite consultar a lista completa de aluguéis de livros registrados no sistema. Você pode usar este endpoint para obter uma visão geral de todos os aluguéis ativos e concluídos.

**Requisição HTTP**

- Método: GET
- URL: localhost:3000/v1/rental/books
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para consultar a lista completa de aluguéis de livros, utilize a seguinte requisição curl:

```bash
curl --location --request GET 'localhost:3000/v1/rental/books'
```

**Resposta**

A resposta será um array de objetos JSON, cada um contendo detalhes de um aluguel específico, incluindo o ID do livro, o ID do usuário, a data de início do aluguel e a data estimada de retorno.

### PUT /v1/rental/books/:id

**Atualizar Registro de Aluguel de Livro**

Este endpoint permite atualizar as informações de um registro de aluguel de livro existente no sistema, utilizando seu identificador único (ID). Isso pode incluir a atualização do livro alugado, do usuário que fez o aluguel, da data de início do aluguel e da estimativa de tempo de aluguel.

**Requisição HTTP**

- Método: PUT
- URL: localhost:3000/v1/rental/books/{id}
  - Substitua {id} pelo ID único do registro de aluguel de livro que deseja atualizar.
- Cabeçalhos
  - Content-Type: application/json

**Payload**

O corpo da requisição deve ser um objeto JSON contendo os seguintes campos para atualização:

- book_id (string): O ID atualizado do livro sendo alugado.
- user_id (string): O ID atualizado do usuário que está alugando o livro.
- rented_at (string): A data e hora atualizadas de início do aluguel, no formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ).
- rental_time (string): A data e hora atualizadas que representam a nova estimativa de tempo de aluguel, também no formato ISO 8601.

**Exemplo de Requisição**

Para atualizar um registro de aluguel de livro com ID af322af1-084a-4496-805c-f4113886ad85, alterando o livro, o usuário, e as datas de início e estimativa de fim do aluguel, utilize a seguinte requisição curl:

```bash
curl --location --request PUT 'localhost:3000/v1/rental/books/af322af1-084a-4496-805c-f4113886ad85' \
--header 'Content-Type: application/json' \
--data '{
    "book_id": "7d5432cd-d831-4e3b-8b3a-3b6d35df0053",
    "user_id": "1d4995fb-dd71-4f87-b2c2-0b888563ef25",
    "rented_at": "2024-03-03T15:05:25.596Z",
    "rental_time": "2024-03-03T15:05:25.596Z"
}'
```

**Resposta**

A resposta será um objeto JSON contendo os detalhes atualizados do registro de aluguel de livro.

### DELETE /v1/rental/books/:id

**Excluir Registro de Aluguel de Livro**

Este endpoint permite excluir um registro de aluguel de livro específico do sistema, utilizando seu identificador único (ID). Esta ação é irreversível e deve ser usada com cautela.

**Requisição HTTP**

- Método: DELETE
- URL: localhost:3000/v1/rental/books/{id}
  - Substitua {id} pelo ID único do registro de aluguel de livro que deseja excluir.
- Cabeçalhos
  - Não são necessários cabeçalhos específicos para esta requisição.

**Exemplo de Requisição**

Para excluir o registro de aluguel de livro com o ID af322af1-084a-4496-805c-f4113886ad85, utilize a seguinte requisição curl:

```bash
curl --location --request DELETE 'localhost:3000/v1/rental/books/af322af1-084a-4496-805c-f4113886ad85'
```

**Resposta**

A resposta geralmente será um código de status HTTP indicando sucesso (como 200 OK ou 204 No Content) sem corpo de resposta, confirmando que o registro de aluguel de livro foi excluído com sucesso.

</details>