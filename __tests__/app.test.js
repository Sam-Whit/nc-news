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

describe("/api/articles", () => {
  test("GET - /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
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
