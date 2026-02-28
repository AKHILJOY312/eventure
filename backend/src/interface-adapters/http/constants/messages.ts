export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS: "User registered successfully",
  EMAIL_VERIFIED: "Email verified successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
  RESET_SUCCESS: "Password reset successful",
  RESET_TOKEN_VALID: "Reset token verified",
  NO_REFRESH_TOKEN: "No refresh token provided",
  EMAIL_SENT: "Email sent",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  EMAIL_REQUIRED: "Email is required",
  ACCESS_DENIED_NO_AUTH: "Access denied. No authentication.",
  ADMIN_ACCESS_REQUIRED: "Admin access required.",
} as const;

export const ERROR_MESSAGES = {
  INVALID_TOKEN: "Invalid token",
  LOGIN_FAILED: "Invalid email or password",
  SOMETHING_WENT_WRONG: "Something went wrong",
  FAILED_FETCH: "Failed to fetch projects",
  USER_NOT_FOUND: "User no longer exists",
  TOKEN_INVALID_OR_EXPIRED: "Not authorized, token failed",
  GOOGLE_ERROR: "Google login failed",
  AUTH_FAILED: "Authentication failed",
  NO_SESSION: "No active session",
  VALIDATION_ERROR: "Not valid input",
};

export const BOOKING_MESSAGES = {
  BOOKING_CREATED: "Booking created successfully",
  PRICE_CALCULATED: "Price calculated successfully",
  BOOKINGS_FETCHED: "Bookings retrieved successfully",
} as const;
