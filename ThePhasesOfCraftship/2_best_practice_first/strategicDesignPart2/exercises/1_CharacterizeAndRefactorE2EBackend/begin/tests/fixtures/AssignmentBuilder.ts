import { Assignment } from "@prisma/client";
import { ClassRoomBuilder } from "./classRoomBuilder";
import { prisma } from "../../src/database";

class AssignmentBuilder {
  private assignment: Partial<Assignment>;
  private classRoom?: ClassRoomBuilder;

  constructor() {
    this.assignment = {};
  }

  from(classRoom: ClassRoomBuilder) {
    this.classRoom = classRoom;
    return this;
  }

  withTitle(title: string) {
    this.assignment.title = title;
    return this;
  }

  async build() {
    if (!this.classRoom) {
      throw new Error("You must define the class room builder");
    }

    let classRoom = await this.classRoom.build();

    let assignment = await prisma.assignment.upsert({
      where: {
        // If you want to check for an existing assignment by title within the same class
        id:
          (
            await prisma.assignment.findFirst({
              where: {
                title: this.assignment.title as string,
                classId: classRoom.id,
              },
            })
          )?.id || "", // Provide an empty string if no matching assignment is found
      },
      update: {
        // What to update if the assignment already exists
        title: this.assignment.title as string,
      },
      create: {
        title: this.assignment.title as string,
        classId: classRoom.id,
      },
    });

    return { assignment, classRoom };
  }
}

export { AssignmentBuilder };
