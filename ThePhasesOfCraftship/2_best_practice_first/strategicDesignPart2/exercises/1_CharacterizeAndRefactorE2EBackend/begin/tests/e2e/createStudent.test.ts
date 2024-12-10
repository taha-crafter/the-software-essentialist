import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { app, Errors } from "../../src/index";
import { StudentBuilder } from "../fixtures/studentBuilder";

const feature = loadFeature("tests/features/createStudent.feature");

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  test("Successfully create a student", ({ given, when, then }) => {
    let studentData: { name: string; email: string };
    let response: request.Response;

    given(
      /^I want to create a student named "(.*)" with email "(.*)"$/,
      (name, email) => {
        studentData = { name, email };
      }
    );

    when("I request to create a student", async () => {
      response = await request(app).post("/students").send(studentData);
    });

    then("the student should be successfully created", () => {
      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject(studentData);
    });
  });

  test("Fail to create a student with missing email", ({
    given,
    when,
    then,
    and,
  }) => {
    let studentData: any = {};
    let response: any = {};

    given(/^I want to create a student named "(.*)" with no email$/, (name) => {
      studentData = { name, email: undefined };
    });

    when("I request to create a student", async () => {
      response = await request(app).post("/students").send(studentData);
    });

    then("the student should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
    });

    and("I should receive a validation error", () => {
      expect(response.body.error).toBe("ValidationError");
    });
  });

  test("Fail to create a student with an existing email", ({
    given,
    when,
    then,
    and,
  }) => {
    let studentEmail: string = "john.doe@gmail.com";
    let studentData: any = {};
    let response: any = {};

    given("a student with an email already exists", async () => {
      studentData = await new StudentBuilder()
        .withRandomName()
        .withEmail(studentEmail)
        .build();
    });

    when(
      "I request to create another student with the same email",
      async () => {
        response = await request(app).post("/students").send(studentData);
      }
    );

    then("the student should not be created", () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe(Errors.StudentAlreadyExists);
    });

    and(/^I should receive an error "(.*)"$/, (error) => {});
  });
});
