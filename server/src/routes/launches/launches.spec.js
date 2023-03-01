const request = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      await request(app).get("/v1/launches").expect("Content-Type", /json/).expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const launchData = {
      mission: "USSR Conquer Mission",
      rocket: "Cyka Blayt 21",
      target: "Kepler-1649 b",
      launchDate: "January 4, 2032",
    };
    const launchDataWithoutDate = {
      mission: "USSR Conquer Mission",
      rocket: "Cyka Blayt 21",
      target: "Kepler-1649 b",
    };
    const launchDataWithInvalidDate = {
      mission: "USSR Conquer Mission",
      rocket: "Cyka Blayt 21",
      target: "Kepler-1649 b",
      launchDate: "Stalin rocks",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Missing required launch property" });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });
});
