import { InvalidRequestBodyException } from "../shared/exceptions";
import { isMissingKeys, isUUID } from "../shared/utils";

class CreateClassDTO {
  constructor(public name: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["name"];

    const requestIsInvaid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (requestIsInvaid) throw new InvalidRequestBodyException(requiredKeys);

    const { name } = body as { name: string };

    return new CreateClassDTO(name);
  }
}

class EnrollStudentDTO {
  constructor(public studentId: string, public classId: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["classId", "studentId"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, classId } = body as {
      studentId: string;
      classId: string;
    };

    return new EnrollStudentDTO(studentId, classId);
  }
}

class ClassId {
  constructor(public id: string) {}

  static fromRequestParams(params: unknown) {
    const ParamsAreInvalid =
      !params || typeof params !== "object" || "id" in params === false;

    if (ParamsAreInvalid) {
      throw new InvalidRequestBodyException(["id"]);
    }

    const { id } = params as { id: string };
    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return new ClassId(id);
  }
}

export { CreateClassDTO, EnrollStudentDTO, ClassId };
