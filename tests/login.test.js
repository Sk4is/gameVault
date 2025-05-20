const request = require("supertest");
const { app, db } = require("../src/server");

describe("POST /api/register", () => {
  it("should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 if user already exists", async () => {
    const user = {
      name: "Test User",
      email: `duplicate@example.com`,
      password: "password123",
    };

    await request(app).post("/api/register").send(user);

    const res = await request(app).post("/api/register").send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should return 201 for successful registration", async () => {
    const uniqueEmail = `newuser_${Date.now()}@example.com`;

    const res = await request(app).post("/api/register").send({
      name: "New User",
      email: uniqueEmail,
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });
});

afterAll((done) => {
  db.end(() => done());
});
