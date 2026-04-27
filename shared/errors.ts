type ErrorDef = {
  message: string | ((...args: string[]) => string);
  statusCode: number;
};

const ERROR_DEFINITIONS = {
  ALREADY_SUBMITTED_TODAY: { message: "Bilan already submitted today", statusCode: 409 },
  UNKNOWN_QUESTION_ID:     { message: (id: string) => `Unknown questionId: ${id}`, statusCode: 400 },
  UNAUTHORIZED:            { message: "Unauthorized", statusCode: 401 },
} satisfies Record<string, ErrorDef>;


type ErrorCode = keyof typeof ERROR_DEFINITIONS; 

export class CustomError extends Error {
  public code: ErrorCode;
  public statusCode: number;

  constructor(code: ErrorCode, ...args: string[]) {
    const def = ERROR_DEFINITIONS[code];
    const message = typeof def.message === "function"
      ? (def.message as (...args: string[]) => string)(...args)
      : def.message;
    super(message);
    this.code = code;
    this.statusCode = def.statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}