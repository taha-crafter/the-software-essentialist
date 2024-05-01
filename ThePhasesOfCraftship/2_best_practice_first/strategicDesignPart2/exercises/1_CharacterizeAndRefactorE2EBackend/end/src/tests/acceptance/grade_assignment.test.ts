import request from "supertest";
import { app } from "../../index";

import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { resetDatabase } from "../fixtures/reset";
import {
  Assignment,
  AssignmentBuilder,
  ClassBuilder,
  Student,
  StudentBuilder,
} from "../fixtures";

const feature = loadFeature(
  path.join(__dirname, "../features/grade_assignment.feature")
);

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  let requestBody: any = {};
  let response: any = {};
  let student: Student;
  let assignment: Assignment;
  let studentBuilder: StudentBuilder;

  beforeEach(async () => {
    studentBuilder = new StudentBuilder();
    ({
      students: [student],
      assignments: [assignment],
    } = await new ClassBuilder()
      .withAssignment(new AssignmentBuilder())
      .withStudent(studentBuilder)
      .withAssignedAssignments()
      .build());
  });

  test("Successfully grade an assignment", ({ given, when, then }) => {
    given("An student submited an assignment", async () => {
      await studentBuilder.submitAssignment(assignment.id);
    });

    when("I grade the assignment", async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
        grade: "A",
      };

      response = await request(app)
        .post(`/student-assignments/grade`)
        .send(requestBody);
    });

    then("It should be marked as graded", async () => {
      expect(response.status).toBe(201);
      expect(response.body.data.grade).toBe("A");
    });
  });

  test("Fail to grade an assignment when it is not submitted", ({
    when,
    then,
  }) => {
    when("I try to grade his assignment before he submits it", async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
        grade: "A",
      };

      response = await request(app)
        .post(`/student-assignments/grade`)
        .send(requestBody);
    });

    then("It should not be marked as graded", async () => {
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("NotSubmittedError");
    });
  });
});
