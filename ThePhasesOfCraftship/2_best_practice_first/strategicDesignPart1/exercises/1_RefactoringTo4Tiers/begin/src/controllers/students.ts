import express from "express";
import { ErrorHandler } from "../shared/errors";
import StudentsService from "../services/students";
import { parseForResponse } from "../shared/utils";
import { CreateStudentDTO, StudentId } from "../dtos/studetns";

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
    this.router.get("/", this.getAllStudents);
    this.router.get("/:id", this.getStudent);
    this.router.get("/:id/assignments", this.getAssignments);
    this.router.get("/:id/grades", this.getGrades);
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

  private async getAllStudents(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const data = await this.studentsService.getAllStudents();
      res.status(200).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getStudent(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = StudentId.fromRequestParams(req.params);
      const data = await this.studentsService.getStudent(dto);
      res.status(200).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getAssignments(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = StudentId.fromRequestParams(req.params);
      const data = await this.studentsService.getAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getGrades(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = StudentId.fromRequestParams(req.params);
      const data = await this.studentsService.getGrades(dto);

      res.status(200).json({
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
