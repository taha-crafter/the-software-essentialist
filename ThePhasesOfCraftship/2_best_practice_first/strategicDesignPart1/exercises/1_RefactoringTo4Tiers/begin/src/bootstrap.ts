import { PrismaClient } from "@prisma/client";

import Database from "./database";
import StudentsService from "./services/students";
import StudetnsController from "./controllers/students";

import Server from "./server";

import { errorHandler } from "./shared/errors";
