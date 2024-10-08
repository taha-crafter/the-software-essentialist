import { InvalidRequestBodyException } from "../shared/exceptions";
import { isMissingKeys, isUUID } from "../shared/utils";

class CreateStudentDTO {
  constructor(public name: string) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["name"];
    const RequestIsInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (RequestIsInvalid) throw new InvalidRequestBodyException(requiredKeys);

    const { name } = body as { name: string };

    return new CreateStudentDTO(name);
  }
}

class StudentId {
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

    return new StudentId(id);
  }
}

export { CreateStudentDTO, StudentId };
