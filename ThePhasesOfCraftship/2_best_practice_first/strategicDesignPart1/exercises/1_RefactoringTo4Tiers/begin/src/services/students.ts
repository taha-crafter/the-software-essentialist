import Database from "../database";
import { CreateStudentDTO } from "../dtos/studetns";

class StudentsService {
  constructor(private db: Database) {}

  async createStudent(dto: CreateStudentDTO) {
    const name = dto.name;
    const student = await this.db.students.save(name);
    return student;
  }
}

export default StudentsService;
