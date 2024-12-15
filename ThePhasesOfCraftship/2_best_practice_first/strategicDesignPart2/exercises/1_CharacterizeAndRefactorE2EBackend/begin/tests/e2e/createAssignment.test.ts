import { app } from "../../src/index";
import request from "supertest";

import { loadFeature, defineFeature } from "jest-cucumber";
import { resetDatabase } from "../fixtures/reset";
import { Class } from "@prisma/client";
import { ClassRoomBuilder } from "../fixtures/classRoomBuilder";

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
});
