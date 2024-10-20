import express from "express";
import { AssignmentsService } from "../services/assignments";
import { ErrorHandler } from "../shared/errors";
import {
  AssignmentId,
  AssignStudentDTO,
  CreateAssignmentDTO,
  GradeAssignmentDTO,
} from "../dtos/assignments";
import { parseForResponse } from "../shared/utils";

class AssignmentsController {
  private router: express.Router;

  constructor(
    private assignmentsService: AssignmentsService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.routes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private routes() {
    this.router.post("/", this.createAssignment);
    this.router.post("/:id/student", this.assignStudent);
    this.router.post("/:id/submit", this.submitAssignment);
    this.router.post("/grade", this.gradeAssignment);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async createAssignment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = CreateAssignmentDTO.fromRequest(req.body);
      const data = this.assignmentsService.createAssignment(dto);
      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async assignStudent(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = AssignStudentDTO.fromRequest(req.body, req.params);
      const data = await this.assignmentsService.assignStudent(dto);
      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async submitAssignment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = AssignmentId.fromRequestParams(req.params);
      const data = await this.assignmentsService.submitAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async gradeAssignment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const dto = GradeAssignmentDTO.fromRequest(req.body);

      const data = this.assignmentsService.gradeAssignment(dto);

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

export default AssignmentsController;
