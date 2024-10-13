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

export { CreateClassDTO };
