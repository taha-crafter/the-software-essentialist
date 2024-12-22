import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { resetDatabase } from "../fixtures/reset";
import { app, Errors } from "../../src/index";
import { StudentBuilder } from "../fixtures/studentBuilder";
import { AssignmentBuilder } from "../fixtures/assignmentBuilder";
import { ClassRoomBuilder } from "../fixtures/classRoomBuilder";
import { Assignment, ClassEnrollment, Student } from "@prisma/client";
import { EnrolledStudentBuilder } from "../fixtures/enrolledStudentBuilder";

const feature = loadFeature("tests/features/assignStudentToAssignment.feature");

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  test("Successfully assign student to assignment", ({
    given,
    and,
    when,
    then,
  }) => {
    let RequestBody: any = {};
    let response: any = {};
    let enrolledStudent: ClassEnrollment;
    let assignment: Assignment;
    let classRoomBuilder: ClassRoomBuilder;

    given(
      /^a student named "(.*)" exists and enrolled in a class$/,
      async (studentName: string) => {
        classRoomBuilder = new ClassRoomBuilder().withName("Math");
        const studentBuilder = new StudentBuilder().withName(studentName);

        let enrollmentResult = await new EnrolledStudentBuilder()
          .from(classRoomBuilder)
          .and(studentBuilder)
          .build();

        enrolledStudent = enrollmentResult.enrolledStudent;
      }
    );

    and(
      /^an assignment named "(.*)" exists for the class$/,
      async (assignmentTitle: string) => {
        const result = await new AssignmentBuilder()
          .from(classRoomBuilder)
          .withTitle(assignmentTitle)
          .build();

        assignment = result.assignment;
      }
    );

    when(
      /^I assign "(.*)" to "(.*)"$/,
      async (studentName: string, assignmentTitle: string) => {
        RequestBody = {
          studentId: enrolledStudent.studentId,
          assignmentId: assignment.id,
        };

        response = await request(app)
          .post("/student-assignments")
          .send(RequestBody);
      }
    );

    then(/^"(.*)" should be assigned to "(.*)" successfully$/, (arg0, arg1) => {
      expect(response.status).toBe(201);
      expect(response.body.data.studentId).toBe(enrolledStudent.studentId);
      expect(response.body.data.assignmentId).toBe(assignment.id);
      expect(response.body.error).toBeUndefined();
    });
  });
});
