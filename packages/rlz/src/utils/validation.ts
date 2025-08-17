import { ZodError } from "zod";

/**
 * Formats Zod errors into readable error messages
 */
export const formatZodError = (error: ZodError): string => {
  const errors = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? ` at "${issue.path.join(".")}"` : "";
    return `${issue.message}${path}`;
  });

  return errors.join(", ");
};

/**
 * Checks if an error is a Zod error
 */
export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};

/**
 * Wrapper for functions that may throw Zod errors
 */
export const safeParseWithError = <T>(
  parseFunction: () => T,
  errorMessage: string
): T => {
  try {
    return parseFunction();
  } catch (error) {
    if (isZodError(error)) {
      throw new Error(`${errorMessage}: ${formatZodError(error)}`);
    }
    throw error;
  }
};
