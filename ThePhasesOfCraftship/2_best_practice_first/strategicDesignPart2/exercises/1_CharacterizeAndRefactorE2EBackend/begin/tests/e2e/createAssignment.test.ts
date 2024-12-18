import { app, Errors } from "../../src/index";
import request from "supertest";

import { loadFeature, defineFeature } from "jest-cucumber";
import { resetDatabase } from "../fixtures/reset";
import { Class } from "@prisma/client";
import { ClassRoomBuilder } from "../fixtures/classRoomBuilder";
import { AssignmentBuilder } from "../fixtures/AssignmentBuilder";

const feature = loadFeature("tests/features/createAssignment.feature");

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  test("Successfully create an assignment", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let classRoom: Class;

    given("a class exists", async () => {
      classRoom = await new ClassRoomBuilder().withName("Math").build();
    });

    when("I create an assignment", async () => {
      requestBody = {
        classId: classRoom.id,
        title: "Assignment 1",
      };

      response = await request(app).post("/assignments").send(requestBody);
    });

    then("the assignment is created", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toMatchObject(requestBody);
    });
  });

  test("Fail to create an assignment with a missing class", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let classRoom: Class;

    given("a class does not exist", () => {
      classRoom = { id: "non-existent-class", name: "does not exist" };
    });

    when("I create an assignment", async () => {
      requestBody = {
        classId: classRoom.id,
        title: "Assignment 1",
      };

      response = await request(app).post("/assignments").send(requestBody);
    });

    then("the assignment is not created", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(Errors.ClassNotFound);
    });
  });

  test("Fail to create the same assignment twice", ({
    given,
    and,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let classRoomBuilder: ClassRoomBuilder;

    given("a class exists", () => {
      classRoomBuilder = new ClassRoomBuilder().withName("Physics");
    });

    and("an assignment exists for the class", async () => {
      const { assignment, classRoom } = await new AssignmentBuilder()
        .from(classRoomBuilder)
        .withTitle("PhysicAssignment")
        .build();

      requestBody = {
        classId: classRoom.id,
        title: assignment.title,
      };
    });

    when("I create an assignment with the same title", async () => {
      response = await request(app).post("/assignments").send(requestBody);
    });

    then("the assignment should not be created", () => {
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(Errors.AssignmentAlreadyExistsForClass);
    });
  });
});
