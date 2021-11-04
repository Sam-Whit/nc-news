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

describe("/api/articles/:article_id", () => {
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
      .get("/api/articles/not_a_review_id")
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

describe.only("GET ALL - Articles", () => {
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
  it("status 200: can use all three queries", () => {
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
  //   test("status 400: sort_by is not a valid sort_by", () => {
  //     return request(app)
  //       .get("/api/articles?sort_by=not_a_sort_by")
  //       .expect(400)
  //       .then();
  //   });
  it("status 400: sort_by is not a valid sort_by option", () => {
    return request(app)
      .get("/api/articles?sort_by=not_sort_by")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  });
  it("Status 400: order which isn't 'asc' or 'desc'", () => {
    return request(app)
      .get("/api/articles?order=not_order")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body.msg).toEqual("Bad request");
      });
  });
});
