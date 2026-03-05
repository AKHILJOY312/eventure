// src/schemas/authSchemas.ts
import * as Yup from "yup";

// -----------------------------
// LOGIN SCHEMA
// -----------------------------

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .strict(true)
    .required("Email is required")
    .max(254, "Email is too long")
    .matches(
      /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .matches(/^(?!\s).*$/, "Password cannot start with whitespace"),
});

// -----------------------------
// REGISTER SCHEMA
// -----------------------------
export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

// -----------------------------
// FORGOT PASSWORD SCHEMA
// -----------------------------
export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

// -----------------------------
// RESET PASSWORD SCHEMA
// -----------------------------
export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

// -----------------------------
// UPDATE PROFILE SCHEMA
// -----------------------------
export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

// -----------------------------
// CHANGE PASSWORD (Inside Profile)
// -----------------------------
export const changePasswordSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),

  newPassword: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),

  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

export const channelCreationSchema = Yup.object({
  channelName: Yup.string()
    .trim()
    .required("Channel name is required")
    .min(2, "Minimum 2 characters")
    .max(30, "Maximum 30 characters")
    // Block dangerous patterns: path traversal, excessive dots/slashes, brackets, etc.
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9\s\-_]*[a-zA-Z0-9]$/,
      "Channel name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .test(
      "no-invalid-patterns",
      'Invalid channel name: cannot contain path traversal (../..), repeated slashes, brackets, or special patterns like "..//...///[[]]"',
      (value) => {
        if (!value) return true; // required already handled

        // Common dangerous patterns
        const forbiddenPatterns = [
          /\.\./, // ".."
          /\/\//, // "//"
          /\\\\/, // "\\"
          /\[.*\]/, // [anything]
          /\]{2,}/, // ]]
          /\(\)/, // ()
          /^[\s._-]+$/, // Only dots, spaces, underscores, hyphens
          /^\./, // Starts with dot
          /\.$/, // Ends with dot
          /[{}[\]<>]/, // Dangerous brackets
        ];

        return !forbiddenPatterns.some((pattern) => pattern.test(value));
      }
    ),

  description: Yup.string().max(200, "Max 200 characters").nullable(),

  visibleToRoles: Yup.array()
    .of(Yup.string().oneOf(["manager", "lead", "member"]))
    .min(1, "Select at least one role"),

  permissionsByRole: Yup.object().required(),
});
