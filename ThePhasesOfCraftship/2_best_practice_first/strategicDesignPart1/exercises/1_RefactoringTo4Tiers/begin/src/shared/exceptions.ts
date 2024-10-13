class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super("Body is missing required key: " + missingKeys.join(","));
  }
}

class StudentNotFoundException extends Error {
  constructor() {
    super("Student not found");
  }
}

class ClassNotFoundException extends Error {
  constructor() {
    super("Class Not Found");
  }
}
o;
class StudentAlreadyEnrolledException extends Error {
  constructor() {
    super("Student is already enrolled in class");
  }
}

export {
  InvalidRequestBodyException,
  StudentNotFoundException,
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
};
