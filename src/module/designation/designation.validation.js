import z from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(50, { message: "Name must be at most 50 characters long" });

export const DesignationValidationSchema = z.object({
  name: nameSchema,
  status: z.boolean().default(true),
});

export const UpdateDesignationValidationSchema = z
  .object({
    name: nameSchema.optional(),
    status: z.boolean().optional(),
  })
  //refine diye custom validation kora hocche, jate update er somoy at least ekta field provide kora hoy
  .refine((data) => data.name !== undefined || data.status !== undefined, {
    message: "At least one field (name or status) must be provided for update",
  });

export default DesignationValidationSchema;
