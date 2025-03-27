import supertest from "supertest";
import { app } from "../server";
import { getById } from "../stores/whisper.mjs";
import {
  restoreDb,
  populateDb,
  getFixtures,
  ensureDbConnection,
  normalize,
  closeDbConnection,
} from "./utils.js";

let whispers;
let inventedId;
let existingId;
let firstUser;
let secondUser;

describe("Server", () => {
  beforeAll(ensureDbConnection);
  beforeEach(async () => {
    console.log("Restoring and populating db");
    await restoreDb();
    await populateDb(whispers);
    const fixtures = await getFixtures();
    whispers = fixtures.whispers;
    inventedId = fixtures.inventedId;
    existingId = fixtures.existingId;
    firstUser = fixtures.firstUser;
    secondUser = fixtures.secondUser;

    console.log("Fixtures loaded:", {
      whispers,
      inventedId,
      existingId,
      firstUser,
      secondUser,
    });
  });
  afterAll(closeDbConnection);

  describe("GET /login", () => {
    it("Should return a 200 with a login page", async () => {
      const res = await supertest(app).get("/login");
      expect(res.status).toBe(200);
      expect(res.text).toContain("Welcome Back!");
    });
  });
  describe("GET /signup", () => {
    it("Should return a 200 with a signup page", async () => {
      const res = await supertest(app).get("/signup");

      expect(res.status).toBe(200);
      expect(res.text).toContain("Create your account!");
    });
  });

  describe("POST /signup", () => {
    const newUser = {
      username: "sakti_doe2",
      password: "123456ASDasd@#",
      email: "prabowo@sakti.com",
    };
    it("Should return a 400 when the body is empty", async () => {
      const res = await supertest(app).post("/signup").send({});
      expect(res.status).toBe(400);
    });

    it("Should return a 400 when the body is not completed", async () => {
      const res = await supertest(app)
        .post("/signup")
        .send({ username: newUser.username });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "User validation failed: password: Password is required, email: Email is required"
      );
    });
    it("should return a 400 when the password is weak", async () => {
      const res = await supertest(app)
        .post("/signup")
        .send({ ...newUser, password: "weak" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "User validation failed: password: Password must be at least 8 characters long"
      );
    });
    it("Should return a 200 and a token when the user is created", async () => {
      const res = await supertest(app).post("/signup").send(newUser);

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
    });
  });
  describe("POST /login", () => {
    it("Should return a 400 when the body is empty", async () => {
      const res = await supertest(app).post("/login").send({});
      expect(res.status).toBe(400);
    });

    it("Should return a 400 when body is not completed", async () => {
      const res = await supertest(app)
        .post("/login")
        .send({ username: "prabowo_doe" });
      expect(res.status).toBe(400);
    });

    it("Should return a 400 when the user is not found", async () => {
      const res = await supertest(app)
        .post("/login")
        .send({
          username: `${firstUser.username}_invented`,
          passowrd: firstUser.password,
        });

      expect(res.status).toBe(400);
    });
    it("Should return a 400 when the password is incorrect", async () => {
      const res = await supertest(app)
        .post("/login")
        .send({
          username: firstUser.username,
          password: `${firstUser.password}_invented`,
        });

      expect(res.status).toBe(400);
    });
    it("Should return a 200 and an accessToken when the user is created", async () => {
      const res = await supertest(app)
        .post("/login")
        .send({ username: firstUser.username, password: firstUser.password });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
    });
  });
  describe("GET /about", () => {
    it("Should return a 200 with the total whispers in the platform", async () => {
      const response = await supertest(app)
        .get("/about")
        .set("Autehntication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(200);
      expect(response.text).toContain(
        `Currently there are ${whispers.length} whispers available`
      );
    });
  });
  describe("GET /api/v1/whisper", () => {
    it("Should return a 401 when the user is not authenticated", async () => {
      const res = await supertest(app).get("/api/v1/whisper/");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });
    it("Should return an empty array when there's no data", async () => {
      await restoreDb(); // empty the db
      const response = await supertest(app)
        .get("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Should return all the whispers", async () => {
      const response = await supertest(app)
        .get("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(whispers);
    });
  });
  describe("GET /api/v1/whisper/:id", () => {
    it("Should return a 401 when the user is not authenticated", async () => {
      const res = await supertest(app).get(`/api/v1/whisper/${existingId}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app)
        .get(`/api/v1/whisper/${inventedId}`)
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(404);
    });
    it("Should return a whisper details", async () => {
      const response = await supertest(app)
        .get(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(whispers.find((w) => w.id === existingId));
    });
  });
  describe("POST /api/v1/whisper", () => {
    it("Should return a 400 when the body is empty", async () => {
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({});
      expect(response.status).toBe(400);
    });
    it("Should return a 400 when the body is invalid", async () => {
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ invented: "This is a new whisper" });
      expect(response.status).toBe(400);
    });
    it("Should return a 401 when the user is not authenticated", async () => {
      const newWhisper = { message: "ngewe" };
      const { message } = newWhisper;
      const res = await supertest(app).post("/api/v1/whisper").send(message);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });
    it("Should return a 201 when the whisper is created", async () => {
      const newWhisper = { message: "This is a new whisper" };
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ message: newWhisper.message });
      expect(response.status).toBe(201);
      expect(response.body.message).toEqual(newWhisper.message);

      // Database changes
      const storedWhisper = await getById(response.body.id);
      expect(normalize(storedWhisper).message).toStrictEqual(
        newWhisper.message
      );
    });
  });
  describe("PUT /api/v1/whisper/:id", () => {
    it("Should return a 400 when the body is empty", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({});
      expect(response.status).toBe(400);
    });
    it("Should return a 400 when the body is invalid", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ invented: "This a new field" });
      expect(response.status).toBe(400);
    });
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${inventedId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ message: "Whisper updated" });
      expect(response.status).toBe(404);
    });
    it("Should return a 401 when the user is not authenticated", async () => {
      const res = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .send({ message: "whisper updated" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });

    it("Should return a 403 when the user is not the author", async () => {
      const res = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${secondUser.token}`)
        .send({
          message: "Whisper updated",
        });
      expect(res.status).toBe(403);
    });
    it.only("Should return a 200 when the whisper is updated", async () => {
      console.log("Starting update test with existingId:", existingId);
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`)
        .send({ message: "Whisper updated" });

      console.log(
        "Update response when the whisper is updated:",
        response.body,
        response.status
      );
      expect(response.status).toBe(200);

      // Database changes
      const storedWhisper = await getById(existingId);
      console.log("Get whisper by id:", storedWhisper);

      expect(normalize(storedWhisper).id).toBe(existingId);
      expect(normalize(storedWhisper).message).toBe("Whisper updated");
    });
  });
  describe("DELETE /api/v1/whisper/:id", () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/whisper/${inventedId}`)
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(404);
    });
    it("Should return a 401 when the user is not authenticated", async () => {
      const res = await supertest(app).delete(`/api/v1/whisper/${existingId}`);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });
    it("Should return a 403 when the user is not the author", async () => {
      const res = await supertest(app)
        .delete(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${secondUser.token}`);

      expect(res.status).toBe(403);
    });

    it("Should return a 200 when the whisper is deleted", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/whisper/${existingId}`)
        .set("Authentication", `Bearer ${firstUser.token}`);
      expect(response.status).toBe(200);

      // Database changes
      const storedWhisper = await getById(existingId);
      expect(storedWhisper).toBe(null);
    });
  });
});
