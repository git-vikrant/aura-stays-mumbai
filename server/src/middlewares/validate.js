import { apiError } from "../utils/response.js";

/**
 * Validates request body, query, or params against a Zod schema.
 */
export function validate(schema, source = "body") {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed; // Replace with sanitized/coerced data
      next();
    } catch (err) {
      if (err.errors) {
        const formatted = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message
        }));
        return apiError(res, "Validation failed", 400, formatted, "VALIDATION_ERROR");
      }
      return apiError(res, "Input validation error", 400, err.message, "VALIDATION_ERROR");
    }
  };
}
