import Database from "../database";
import { ClassId, CreateClassDTO, EnrollStudentDTO } from "../dtos/classes";
import {
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
  StudentNotFoundException,
} from "../shared/exceptions";

class ClassesService {
  constructor(private db: Database) {}

  async createClass(dto: CreateClassDTO) {
    const { name } = dto;
    const response = await this.db.classes.save(name);

    return response;
  }

  async enrollStudent(dto: EnrollStudentDTO) {
    const { studentId, classId } = dto;

    const student = await this.db.students.getById(studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const cls = await this.db.classes.getById(classId);

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const StudentIsEnrolled = await this.db.classes.getEnrollment(
      studentId,
      classId
    );

    if (StudentIsEnrolled) {
      throw new StudentAlreadyEnrolledException();
    }

    const response = await this.db.classes.saveEnrollment(studentId, classId);

    return response;
  }

  async getAssignments(dto: ClassId) {
    const { id } = dto;
    const cls = await this.db.classes.getById(id);

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const response = await this.db.classes.getAssignments(id);

    return response;
  }
}

export default ClassesService;
