class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super("Body is missing required key: " + missingKeys.join(","));
  }
}

export { InvalidRequestBodyException };
