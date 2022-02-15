const request = require("supertest");
const app = require("./app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("app", () => {
  describe("/api/topics", () => {
    test("status: 200 - responds with an array of topic objects, each of which should have a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(3);
          body.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("status: 200 - response with an object of the following fields for a specific article - author (taken from the username in users table), title, article_id, body, topic, created_at, votes", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("status: 400 - responds with error message if user attempts to use an invalid id", () => {
        return request(app)
          .get("/api/articles/invalid_id")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request - invalid input");
          });
      });
      test("status: 404 - responds with error message if user attempts to search for an id that does not exist", () => {
        return request(app)
          .get("/api/articles/938475")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found, please check the url and try again.");
          });
      });
    });
    describe("PATCH", () => {
      test("status: 200 - returns an object containing the specific fields requested", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("status: 200 - returns the same object with no amends if passed no data in the patch", () => {
        const article1DataCopy = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        };
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(article1DataCopy);
          });
      });
      test("status: 200 - updates votes by the positive integer passed in the Patch request and returns the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 110,
            });
          });
      });
      test("status: 200 - updates votes by the negative integer passed in the Patch request and returns the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 90,
            });
          });
      });
      test("status: 400 - responds with error message if user attempts to use an invalid id", () => {
        return request(app)
          .patch("/api/articles/invalid_id")
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request - invalid input");
          });
      });
      test("status: 404 - responds with error message if user attempts to search for an id that does not exist", () => {
        return request(app)
          .patch("/api/articles/938475")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found, please check the url and try again.");
          });
      });
    });
  });
  describe("ERRORS", () => {
    test("status: 404 responds with an error message when user attempts to reach an invalid path", () => {
      return request(app)
        .get("/api/gobbledygook")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Invalid path, please check your url and try again."
          );
        });
    });
  });
});
