import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { app } from "../../src/index";

const feature = loadFeature("tests/features/createClassRoom.feature");

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  test("Successfully create a classroom", ({ given, when, then }) => {
    let classroomData: any = {};
    let response: any = {};

    given(/^I want to create a classroom named "(.*)"$/, (name) => {
      classroomData = { name };
    });

    when("I request to create a classroom", async () => {
      response = await request(app).post("/classes").send(classroomData);
    });

    then("the classroom should be successfully created", () => {
      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject(classroomData);
    });
  });

  test("Fail to create a classroom without a name", ({ given, when, then }) => {
    let classroomData: any = {};
    let response: any = {};

    given("I want to create a classroom without a name", () => {
      classroomData = {};
    });

    when("I request to create a classroom", async () => {
      response = await request(app).post("/classes").send(classroomData);
    });

    then("the classroom creation should fail with a validation error", () => {
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("ValidationError");
    });
  });
});
