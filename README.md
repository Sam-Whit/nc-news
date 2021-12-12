# NC News API - Practice News - Back End

A RESTful news API that serves data in a style similar to how a news forum like Reddit.

It uses Postgres to interact with the PSQL database and information can be accessed for articles, comments, users and topics.

You can interact with the API using tested GET, POST, PATCH and DELETE methods via the endpoints detailed below.

## Getting Started

Clone the project:

```bash
git clone https://link-to-project
```

## Environment variables
To run this project, you will need to add the following environment variables to your .env file:

Create two .env files: `.env.development` and `.env.test`

To run this project, you will need to add the following environment variables to your .env files

_/.env.development_

`PGADATABASE=nc_news`

_/.env.test_

`PGADATABASE=nc_news_test`

## Run Locally

Go to the project directory

```bash
cd nc-news
```

Install dependencies

```bash
npm install
```

This will install the following packages:

- dotenv
- express
- pg
- pg-format and the developer dependencies for testing.
- jest
- jest-sorted
- superagent
- supertest

Setup the database

```bash
npm run setup-dbs
```

Seed the database

```bash
npm run seed
```

_if the seed was unsuccesful an error will be logged in the terminal._

Start the server

```bash
npm run start
```

The server will now be accessible from _http://localhost/9090_

## Demo

https://practice-news.herokuapp.com/

## Available API Endpoints

### Get All Endpoints

```http
  GET /api
```

Fetches information listing all endpoints in JSON format.

### Get All Topics

```http
GET /api/topics
```

Returns an array of all topics each of which should have the following properties:
  - `slug`
  - `description`

### Get Specific Article

```http
GET /api/articles/:article_id
```

Returns an article object, which should have the following properties:

  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` - which is the total count of all the comments with this article_id.

### Update A Specific Article

```http
PATCH /api/articles/:article_id
```
Request body accepts:

- An object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current article's vote property by 1

  `{ inc_votes : -100 }` would decrement the current article's vote property by 100

Responds with:

- The updated article

### Get All Articles

```http
GET /api/articles
```

- an `articles` array of article objects, each of which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id

Accepts queries:

- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `topic`, which filters the articles by the topic value specified in the query

### Get Comments For Specific Article

```http
GET /api/articles/:article_id/comments
```

Responds with:

- an array of comments for the given `article_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

### Post Comment To Specific Article

```http
POST /api/articles/:article_id/comments
```
Request body accepts:

- an object with the following properties:
  - `username`
  - `body`

Responds with:

- the posted comment

### Delete Comment

```http
DELETE /api/comments/:comment_id
```

It deletes the given comment by `comment_id`

Responds with a status 204.

### Get All Users

```http
GET /api/users
```

Responds with:

- an array of user objects.

### Get A Specific User

```http

```

Responds with:

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

## Running Tests

To run tests, run the following command:

```bash
  npm run test
```