const request = require("supertest");
const app = require("./app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("app", () => {
  describe("GET - /api/topics", () => {
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
  describe("GET - /api/articles/:article_id", () => {
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
          expect(msg).toBe(
            "Not found, please check the article_id used and try again."
          );
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
