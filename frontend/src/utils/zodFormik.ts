import type { FormikErrors } from "formik";
import type { z, ZodType } from "zod";

export const createZodFormikValidator =
  <T extends Record<string, unknown>>(schema: ZodType<T>) =>
  (values: T): FormikErrors<T> => {
    const parsed = schema.safeParse(values);
    if (parsed.success) return {};

    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!path || errors[path]) continue;
      errors[path] = issue.message;
    }

    return errors as FormikErrors<T>;
  };

export type InferZodValues<T extends ZodType> = z.infer<T>;
