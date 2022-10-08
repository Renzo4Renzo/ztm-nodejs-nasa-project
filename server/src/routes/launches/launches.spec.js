const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    await request(app).get("/launches").expect("Content-Type", /json/).expect(200);
  });
});

describe("Test POST /launches", () => {
  const launchData = {
    mission: "USSR Conquer Mission",
    rocket: "Cyka Blayt 21",
    target: "Kepler-186 f",
    launchDate: "January 4, 2032",
  };
  const launchDataWithoutDate = {
    mission: "USSR Conquer Mission",
    rocket: "Cyka Blayt 21",
    target: "Kepler-186 f",
  };
  const launchDataWithInvalidDate = {
    mission: "USSR Conquer Mission",
    rocket: "Cyka Blayt 21",
    target: "Kepler-186 f",
    launchDate: "Stalin rocks",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app).post("/launches").send(launchData).expect("Content-Type", /json/).expect(201);

    const requestDate = new Date(launchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Missing required launch property" });
  });

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Invalid launch date" });
  });
});
