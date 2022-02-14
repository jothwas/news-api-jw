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
