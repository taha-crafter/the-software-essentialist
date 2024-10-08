import Database from "../database";
import { CreateStudentDTO, StudentId } from "../dtos/studetns";
import { StudentNotFoundException } from "../shared/exceptions";

class StudentsService {
  constructor(private db: Database) {}

  async createStudent(dto: CreateStudentDTO) {
    const name = dto.name;
    const student = await this.db.students.save(name);
    return student;
  }

  async getAllStudents() {
    const response = await this.db.students.getAll();
    return response;
  }

  async getStudent(dto: StudentId) {
    const { id } = dto;
    const response = await this.db.students.getById(id);
    if (!response) {
      throw new StudentNotFoundException();
    }

    return response;
  }

  async getAssignments(dto: StudentId) {
    const { id } = dto;
    const studentExists = !!(await this.db.students.getById(id));

    if (!studentExists) throw new StudentNotFoundException();

    const response = this.db.students.getAssignments(id);

    return response;
  }

  async getGrades(dto: StudentId) {
    const { id } = dto;
    const studentExists = !!(await this.db.students.getById(id));

    if (!studentExists) throw new StudentNotFoundException();

    const response = this.db.students.getGrades(id);

    return response;
  }
}

export default StudentsService;
