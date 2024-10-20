import Database from "../database";
import {
  AssignmentId,
  AssignStudentDTO,
  CreateAssignmentDTO,
  GradeAssignmentDTO,
} from "../dtos/assignments";

class AssignmentsService {
  constructor(private db: Database) {}

  async createAssignment(dto: CreateAssignmentDTO) {
    const { classId, title } = dto;

    const response = await this.db.assignments.save(classId, title);

    return response;
  }

  async assignStudent(dto: AssignStudentDTO) {
    const { assignmentId, studentId } = dto;

    const response = await this.db.assignments.assignStudent(
      assignmentId,
      studentId
    );

    return response;
  }

  async submitAssignment(dto: AssignmentId) {
    const { id } = dto;

    const response = await this.db.assignments.submit(id);

    return response;
  }

  async gradeAssignment(dto: GradeAssignmentDTO) {
    const { id, grade } = dto;

    const response = await this.db.assignments.grade(id, grade);

    return response;
  }
}

export { AssignmentsService };
