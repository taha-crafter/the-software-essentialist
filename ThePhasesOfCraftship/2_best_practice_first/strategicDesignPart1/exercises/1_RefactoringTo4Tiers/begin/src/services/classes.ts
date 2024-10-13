import Database from "../database";
import { CreateClassDTO } from "../dtos/classes";

class ClassesService {
  constructor(private db: Database) {}

  async createClass(dto: CreateClassDTO) {
    const { name } = dto;
    const response = await this.db.classes.save(name);

    return response;
  }
}

export default ClassesService;
