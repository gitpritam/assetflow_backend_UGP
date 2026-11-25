/**
 * Format ZodError issues into an array of { field, message } objects.
 * @param {import("zod").ZodError} zodError
 * @returns {Array<{ field: string, message: string }>}
 */
const formatZodErrors = (zodError) =>
  zodError.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

export default formatZodErrors;
