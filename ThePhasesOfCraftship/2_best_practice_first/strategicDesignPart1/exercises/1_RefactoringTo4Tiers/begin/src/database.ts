import { PrismaClient } from "@prisma/client";

interface StudentPersistance {
  save(name: string): any;
  getAll(): any;
  getById(id: string): any;
  getAssignments(id: string): any;
  getGrades(id: string): any;
}

interface ClassesPersistence {
  save(name: string): any;
}

class Database {
  public students: StudentPersistance;
  public classes: ClassesPersistence;

  constructor(private prisma: PrismaClient) {
    this.students = this.buildStudentPersistence();
    this.classes = this.buildClassesPersistence();
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

  buildClassesPersistence(): ClassesPersistence {
    return { save: this.saveClass };
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

  private async saveClass(name: string) {
    const data = await this.prisma.class.create({
      data: {
        name,
      },
    });

    return data;
  }
}

export default Database;
