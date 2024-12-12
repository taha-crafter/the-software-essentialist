import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { app, Errors } from "../../src/index";
import { ClassRoomBuilder } from "../fixtures/classRoomBuilder";
import { StudentBuilder } from "../fixtures/studentBuilder";
import { faker } from "@faker-js/faker";
import { EnrolledStudentBuilder } from "../fixtures/enrolledStudentBuilder";

const feature = loadFeature("tests/features/enrollStudent.feature");

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  let classroom: any = {};
  let student: any = {};

  test("Successfully enroll a student in a classroom", ({
    given,
    when,
    then,
  }) => {
    let response: any = {};

    given("there is a class and a student", async () => {
      classroom = await new ClassRoomBuilder().withRandomName().build();
      student = await new StudentBuilder().withRandomDetails().build();
    });

    when("I enroll the student to the class", async () => {
      response = await request(app)
        .post("/class-enrollments")
        .send({ classId: classroom.id, studentId: student.id });
    });

    then("the student should be enrolled to the class successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toMatchObject({
        classId: classroom.id,
        studentId: student.id,
      });
    });
  });

  test("Fail to enroll a student in a non-existent classroom", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};

    given("there is a student and a class that doesn't exist", async () => {
      student = await new StudentBuilder().withRandomDetails().build();
      const classId = faker.string.uuid();
      requestBody = {
        studentId: student.id,
        classId,
      };
    });

    when("I try to enroll the student to the class", async () => {
      response = await request(app)
        .post("/class-enrollments")
        .send(requestBody);
    });

    then("the enrollment should fail", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(Errors.ClassNotFound);
    });
  });

  test("Fail to enroll a student twice", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};

    given("there is a student enrolled in a class", async () => {
      student = new StudentBuilder().withRandomDetails();
      classroom = new ClassRoomBuilder().withRandomName();

      const { enrolledStudent, classRoom } = await new EnrolledStudentBuilder()
        .from(classroom)
        .and(student)
        .build();

      requestBody = {
        studentId: enrolledStudent.studentId,
        classId: classRoom.id,
      };
    });

    when("I try to enroll the student again", async () => {
      response = await request(app)
        .post("/class-enrollments")
        .send(requestBody);
    });

    then("the enrollment should fail", () => {
      expect(response.body.error).toBe(Errors.StudentAlreadyEnrolled);
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });
});
