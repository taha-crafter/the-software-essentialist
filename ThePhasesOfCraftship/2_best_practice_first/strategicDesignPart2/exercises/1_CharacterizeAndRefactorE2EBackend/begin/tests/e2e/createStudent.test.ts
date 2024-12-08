import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { app } from "../../src/index";

const feature = loadFeature("tests/features/createStudent.feature");

defineFeature(feature, (test) => {
  test("Successfully create a student", ({ given, when, then }) => {
    let studentData: { name: string; email: string };
    let response: request.Response;

    given(
      'I want to create a student named "John Doe" with email "john.doe@example.com"',
      () => {
        studentData = { name: "John Doe", email: "john.doe@example.com" };
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
});
