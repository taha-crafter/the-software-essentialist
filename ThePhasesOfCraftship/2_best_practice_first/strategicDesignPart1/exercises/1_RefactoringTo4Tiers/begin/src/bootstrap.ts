import Server from "./server";
import Database from "./database";

import {
  StudentsService,
  AssignmentsService,
  ClassesService,
} from "./services/";
import {
  StudetnsController,
  ClassesController,
  AssignmentsController,
} from "./controllers/";

import { errorHandler } from "./shared/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const db = new Database(prisma);

const studentsService = new StudentsService(db);
const classesService = new ClassesService(db);
const assignmentsService = new AssignmentsService(db);

const studentsController = new StudetnsController(
  studentsService,
  errorHandler
);
const classesController = new ClassesController(classesService, errorHandler);
const assignmentsController = new AssignmentsController(
  assignmentsService,
  errorHandler
);

const server = new Server(
  studentsController,
  classesController,
  assignmentsController
);

export default server;
