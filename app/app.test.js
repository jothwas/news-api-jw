const request = require("supertest");
const app = require("./app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const req = require("express/lib/request");

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
      test("status: 200 - responds with an object of these fields for a specific article - author, title, article_id, body, topic, created_at, votes", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
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
      test('status: 200 - responds with an article object that has a "comment_count" property showing the correct number of comments for an article with comments', () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(
            ({
              body: {
                article: { comment_count },
              },
            }) => {
              expect(comment_count).toBe(11);
            }
          );
      });
      test('status: 200 - responds with an article object that has a "comment_count" property with a value of 0 for an article without comments', () => {
        return request(app)
          .get("/api/articles/4")
          .expect(200)
          .then(
            ({
              body: {
                article: { comment_count },
              },
            }) => {
              expect(comment_count).toBe(0);
            }
          );
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
            expect(msg).toBe("article not found");
          });
      });
    });
    describe("PATCH", () => {
      test("status: 200 - returns an object containing the specific fields requested", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
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
          .then(({ body: { article } }) => {
            expect(article).toEqual(article1DataCopy);
          });
      });
      test("status: 200 - updates votes by the positive integer passed in the Patch request and returns the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual({
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
          .then(({ body: { article } }) => {
            expect(article).toEqual({
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
      test("status: 400 - responds with error message if user attempts to patch with wrong data type", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "bananas" })
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
            expect(msg).toBe("article not found");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      test("status: 200 - responds with an array of user objects, each of which should have a username property only", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      test("status: 200 - responds with an array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  author: expect.any(String),
                  title: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test("status: 200 - the article objects are all sorted in descending order by their date", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
  });
  describe.only("/api/articles/:article_id/comments", () => {
    test('"status: 200 - responds with an array of comment objects, each of which should have the following properties: comment_id, votes, created_at, author, body', () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
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
    test("status: 200 - responds with an empty array when an article has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
          expect(comments).toEqual([]);
        });
    });
    test("status: 404 - returns 'Path not found' when searching for an article that doesn't exist", () => {
      return request(app)
        .get("/api/articles/123456/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
    test("status: 400 - responds with error message if user attempts to use an invalid article_id", () => {
      return request(app)
        .get("/api/articles/gobbledygook/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request - invalid input");
        });
    });
  });
  describe("ERRORS", () => {
    test("status: 404 responds with an error message when user attempts to reach an invalid path", () => {
      return request(app)
        .get("/api/gobbledygook")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
  });
});
