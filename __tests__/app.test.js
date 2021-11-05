const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET API - wrong path", () => {
  test("Returns 404 with invalid path", () => {
    return request(app).get("/api/something-that-doesnt-exist").expect(404);
  });
});

describe("GET api/topics", () => {
  test("status 200: responds with an array of the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: returns an article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-09T20:11:00.000Z",
            comment_count: 11,
          },
        });
      });
  });
  test("status 404: article_id does not exist in database", () => {
    return request(app)
      .get("/api/articles/6452")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("status 400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/not_an_article_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {});
test("status 201: accepts an object in the form { inc_votes: newVote } and responds with the updated article", () => {
  return request(app)
    .patch("/api/articles/5")
    .send({ inc_votes: 11 })
    .expect(201)
    .then((response) => {
      const { body } = response;
      expect(body.article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 5,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 11,
        })
      );
    });
});
test("status 400: malformed body / missing required fields", () => {
  return request(app)
    .patch("/api/articles/5")
    .send()
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request, no input obj provided");
    });
});
test("status 400: sent wrong type of obj", () => {
  return request(app)
    .patch("/api/articles/5")
    .send({ inc_votes: "string" })
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request, invalid input");
    });
});

describe("GET ALL - Articles", () => {
  test("status 200: responds with an array of the topics", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Status 200: should sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("title");
      });
  });
  test("status 200: should sort by date created at as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at");
      });
  });
  test("status 200: should be sorted by order specified", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ descending: false });
      });
  });
  test("status 200: should be sorted by descending order as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSorted({ descending: true });
      });
  });
  test("status 200: Returns articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("status 200: can use all three queries", () => {
    return request(app)
      .get("/api/articles?topic=cats&order=asc&sort_by=article_id")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(1);
        expect(body.articles).toBeSorted({ ascending: true });
        expect(body.articles).toBeSortedBy("article_id");
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
  test("status 200: Invalid query type is ignored", () => {
    return request(app)
      .get("/api/articles?not_a_query=not_an_input")
      .expect(200);
  });
  test("status 400: sort_by is not a valid sort_by option", () => {
    return request(app)
      .get("/api/articles?sort_by=not_sort_by")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Invalid sort query");
      });
  });
  test("Status 400: order which isn't 'asc' or 'desc'", () => {
    return request(app)
      .get("/api/articles?order=not_order")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Invalid order query");
      });
  });
  test("status 404: Queried topic does not exist in database", () => {
    return request(app)
      .get("/api/articles?topic=not_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic not found");
      });
  });
  test("status 200: Queried topic does exist but no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: should respond with an array of comments for the article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: article_id is does not exist in database", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("status 400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/not_an_article_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: Comment posted and posted comment returned", () => {
    const demoComment = {
      username: "icellusedkars",
      body: "enjoying the project's progress",
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(demoComment)
      .then((response) => {
        const { body } = response;
        expect(body.postedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: "icellusedkars",
            article_id: 9,
            votes: 0,
            created_at: expect.any(String),
            body: "enjoying the project's progress",
          })
        );
      });
  });
  test("status 400: comment body doesn't exist", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({ username: "icellusedkars" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, no comment provided");
      });
  });
  test("status 400: sent by a nonuser", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({ username: "nonUser", body: "enjoying the project's progress" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid input");
      });
  });
  test("status 400: article_id does not exist in database", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "icellusedkars",
        body: "enjoying the project's progress",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid input");
      });
  });
  test("status 400: invalid article_id", () => {
    return request(app)
      .post("/api/articles/not_an_article_id/comments")
      .send({
        username: "icellusedkars",
        body: "enjoying the project's progress",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid input");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204: Comment deleted and message", () => {
    return request(app)
      .delete("/api/comments/4")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments;");
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(17);
      });
  });
  test("status 404: comment_id not in database", () => {
    return request(app)
      .delete("/api/comments/6452")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
  test("status 400: comment_id wrong type", () => {
    return request(app)
      .delete("/api/comments/not_a_comment_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid input");
      });
  });
});

describe("GET /api", () => {
  test("Status 200: Returns a summary of all endpoints and their descriptions", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
});
