import { InvalidRequestBodyException } from "../shared/exceptions";
import { isMissingKeys } from "../shared/utils";

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

export { CreateStudentDTO };
