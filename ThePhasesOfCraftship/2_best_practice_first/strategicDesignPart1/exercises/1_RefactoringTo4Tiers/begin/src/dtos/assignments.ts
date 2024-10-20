import { InvalidRequestBodyException } from "../shared/exceptions";
import { isMissingKeys, isUUID } from "../shared/utils";

class CreateAssignmentDTO {
  constructor(public classId: string, public title: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["classId", "title"];

    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw InvalidRequestBodyException;
    }

    const { classId, title } = body as { classId: string; title: string };

    return new CreateAssignmentDTO(classId, title);
  }
}

class AssignStudentDTO {
  constructor(public assignmentId: string, public studentId: string) {}

  static fromRequestParam(params: unknown) {
    const paramsAreInvalid =
      !params || typeof params !== "object" || "id" in params === false;

    if (paramsAreInvalid) {
      throw new InvalidRequestBodyException(["id"]);
    }

    const { id } = params as { id: string };

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return id;
  }

  static fromRequest(body: unknown, params: unknown) {
    const assignmentId = this.fromRequestParam(params);

    const requiredKeys = ["studentId"];

    const requestIsInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (requestIsInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId } = body as { studentId: string };

    return new AssignStudentDTO(assignmentId, studentId);
  }
}

class GradeAssignmentDTO {
  constructor(public id: string, public grade: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["id", "grade"];

    const requestIsInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (requestIsInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id, grade } = body as { id: string; grade: string };

    return new GradeAssignmentDTO(id, grade);
  }
}

class AssignmentId {
  constructor(public id: string) {}

  static fromRequestParams(params: unknown) {
    const paramsAreInvalid =
      !params || typeof params !== "object" || "id" in params === false;

    if (paramsAreInvalid) {
      throw new InvalidRequestBodyException(["id"]);
    }

    const { id } = params as { id: string };

    return new AssignmentId(id);
  }
}

export {
  CreateAssignmentDTO,
  AssignStudentDTO,
  AssignmentId,
  GradeAssignmentDTO,
};
