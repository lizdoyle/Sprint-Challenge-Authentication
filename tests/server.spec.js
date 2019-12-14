const request = require("supertest");

const server = require("../api/server");
const db = require("../database/dbConfig");
const bcrypt = require("bcryptjs");


 describe("GET /", () => {
   it("should return 200 OK", async () => {
     const res = await request(server).get("/");
     expect(res.status).toBe(200);
   });

   // does it return the right data type?
   it("should be json", async () => {
     const res = await request(server).get("/");
     expect(res.type).toBe("application/json");
   });

   // does it return the right data?
   it("should return the right object", async () => {
     const res = await request(server).get("/");
     expect(res.body).toEqual({ api: "This is working" });
   });
 });

describe("server", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  it("should set db environment to testing", function() {
    expect(process.env.DB_ENV).toBe("testing");
  });

  describe("POST /api/auth/login", () => {
    it("should return 401 status for wrong user", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "hannah1",
          password: "pass"
        })
        .set("Content-Type", "application/json");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid Credentials");
    });

    it("should return 200 status", async () => {
      const password = bcrypt.hashSync("password", 12)
      await db("users").insert([{ username: "lizdoyle", password: password }]);
      const res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "lizdoyle",
          password: "password"
        })
        .set("Content-Type", "application/json");
      expect(res.status).toBe(200);
    }, 10000);
  });

  describe("POST /api/auth/register", () => {
    it("should return 201 status", async () => {
      return request(server)
        .post("/api/auth/register")
        .send({
          username: "lizdoyle",
          password: "test"
        })
        .set("Content-Type", "application/json")
        .then(res => {
          expect(res.status).toBe(201);
        });
    }, 10000);

    it("needs username and password", async () => {
      return request(server)
        .post("/api/auth/register")
        .send({})
        .set("Content-Type", "application/json")
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message).toBe("You shall not pass");
        });
    }, 10000);
  });

  describe("GET /api/jokes", () => {
    it("Needs authorization", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("no credentials provided");
    });

    it("should accept token", async () => {
      const password = bcrypt.hashSync("password", 12);
      await db("users").insert([{ username: "lizdoyle", password: password }]);
      const res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "lizdoyle",
          password: "password"
        })
        .set("Content-Type", "application/json");
      const token = res.body.token;
      console.log(token);

      return request(server)
        .get("/api/jokes")
        .set("Authorization", token)
        .then(res => {
          expect(res.status).toBe(200);
        });
    }, 20000);
  });
});
