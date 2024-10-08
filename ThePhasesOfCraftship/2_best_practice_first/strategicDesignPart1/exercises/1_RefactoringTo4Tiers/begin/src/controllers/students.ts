import express from "express";
import { ErrorHandler } from "../shared/errors";
import Error from "../shared/constants";
import StudentsService from "../services/students";
import { parseForResponse } from "../shared/utils";
import { CreateStudentDTO } from "../dtos/studetns";

class StudetnsController {
  private router: express.Router;

  constructor(
    private studentsService: StudentsService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/", this.createStudent);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async createStudent(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = CreateStudentDTO.fromRequest(req.body);
      const data = await this.studentsService.createStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default StudetnsController;
