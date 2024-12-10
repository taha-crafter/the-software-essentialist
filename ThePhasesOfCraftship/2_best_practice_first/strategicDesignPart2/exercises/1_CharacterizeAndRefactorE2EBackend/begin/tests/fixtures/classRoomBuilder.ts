import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import { Class } from "@prisma/client";

const COURSES = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English",
  "Art",
];

class ClassRoomBuilder {
  private classRoom: Partial<Class>;

  constructor() {
    this.classRoom = {
      name: faker.helpers.arrayElement(COURSES),
    };
  }

  withName(name: string) {
    this.classRoom.name = name;
    return this;
  }

  withRandomName() {
    this.classRoom.name = faker.helpers.arrayElement(COURSES);
    return this;
  }

  async build() {
    let classRoom = await prisma.class.upsert({
      where: {
        name: this.classRoom.name as string,
      },
      create: {
        name: this.classRoom.name as string,
      },
      update: {
        name: this.classRoom.name as string,
      },
    });

    return classRoom as Class;
  }
}

export { ClassRoomBuilder };
