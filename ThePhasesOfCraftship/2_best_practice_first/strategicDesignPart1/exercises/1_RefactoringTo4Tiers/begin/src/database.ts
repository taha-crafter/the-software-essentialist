import { PrismaClient } from "@prisma/client";

interface StudentPersistance {
  save(name: string): any;
  getAll(): any;
  getById(id: string): any;
  getAssignments(id: string): any;
  getGrades(id: string): any;
}

class Database {
  public students: StudentPersistance;

  constructor(private prisma: PrismaClient) {
    this.students = this.buildStudentPersistence();
  }

  buildStudentPersistence(): StudentPersistance {
    return {
      save: this.saveStudent,
      getAll: this.getAll,
      getById: this.getStudentById,
      getAssignments: this.getStudentAssignments,
      getGrades: this.getStudentGrades,
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

  private async getAll() {
    const data = await this.prisma.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  private async getStudentById(id: string) {
    const data = await this.prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
    });

    return data;
  }

  private async getStudentAssignments(id: string) {
    const data = this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
      },
      include: {
        assignment: true,
      },
    });

    return data;
  }

  private async getStudentGrades(id: string) {
    const data = this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        grade: {
          not: null,
        },
      },
      include: {
        assignment: true,
      },
    });
  }
}

export default Database;
