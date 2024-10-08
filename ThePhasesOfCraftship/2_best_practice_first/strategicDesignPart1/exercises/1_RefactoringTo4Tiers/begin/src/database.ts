import { PrismaClient } from "@prisma/client";

interface StudentPersistance {
  save(name: string): any;
}

class Database {
  public students: StudentPersistance;

  constructor(private prisma: PrismaClient) {
    this.students = this.buildStudentPersistence();
  }

  buildStudentPersistence(): StudentPersistance {
    return {
      save: this.saveStudent,
    };
  }

  private async saveStudent(name: string) {
    const data = await this.prisma.student.create({
      data: {
        name,
      },
    });

    return data;
  }
}

export default Database;
