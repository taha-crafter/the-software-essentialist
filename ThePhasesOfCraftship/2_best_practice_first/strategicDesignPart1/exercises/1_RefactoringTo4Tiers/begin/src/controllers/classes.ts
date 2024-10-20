import express from "express";

import ClassesService from "../services/classes";

import { ClassId, CreateClassDTO, EnrollStudentDTO } from "../dtos/classes";

import { ErrorHandler } from "../shared/errors";

import { parseForResponse } from "../shared/utils";

class ClassesController {
  private router: express.Router;
  constructor(
    private classesService: ClassesService,
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
    this.router.post("/", this.createClass);
    this.router.post("/enrollments", this.enrollStudent);
    this.router.get("/:id/assignments", this.getAssignments);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async createClass(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = CreateClassDTO.fromRequest(req.body);
      const data = this.classesService.createClass(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async enrollStudent(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = EnrollStudentDTO.fromRequest(req.body);
      const data = this.classesService.enrollStudent(dto);
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
      const dto = ClassId.fromRequestParams(req.params);

      const data = this.classesService.getAssignments(dto);

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

export default ClassesController;
