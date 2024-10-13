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
  saveEnrollment(studentId: string, classId: string): any;
  getById(id: string): any;
  getAssignments(id: string): any;
  getEnrollment(studentId: string, classId: string): any;
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
    return {
      save: this.saveClass,
      saveEnrollment: this.saveEnrollment,
      getById: this.getClassById,
      getAssignments: this.getClassAssignments,
      getEnrollment: this.getEnrollment,
    };
  }

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

    return data;
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
    const data = await this.prisma.studentAssignment.findMany({
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
    const data = await this.prisma.studentAssignment.findMany({
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

    return data;
  }

  private async saveClass(name: string) {
    const data = await this.prisma.class.create({
      data: {
        name,
      },
    });

    return data;
  }

  private async saveEnrollment(studentId: string, classId: string) {
    const data = await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });

    return data;
  }

  private async getClassById(id: string) {
    const data = await this.prisma.class.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  private async getClassAssignments(id: string) {
    const data = await this.prisma.assignment.findMany({
      where: {
        classId: id,
      },
      include: {
        class: true,
        studentTasks: true,
      },
    });

    return data;
  }

  private async getEnrollment(studentId: string, classId: string) {
    const data = await this.prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });

    return data;
  }
}

export default Database;
