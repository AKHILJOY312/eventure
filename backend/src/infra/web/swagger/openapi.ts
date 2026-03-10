import { ENV } from "@/config/env.config";

const API_BASE = process.env.API_BASE_URL || `http://localhost:${ENV.PORT}`;

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Event Management API",
    version: "1.0.0",
    description: "Backend API documentation for auth, admin, bookings, and discovery.",
  },
  servers: [
    {
      url: `${API_BASE}/api`,
      description: "Main API server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  tags: [
    { name: "Auth" },
    { name: "Discover" },
    { name: "Bookings" },
    { name: "Admin" },
  ],
  paths: {
    "/auth/users": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "confirmPassword"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                  confirmPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Registered" },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/auth/users/verify-email": {
      patch: {
        tags: ["Auth"],
        summary: "Verify email OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string", format: "email" },
                  otp: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Verified" } },
      },
    },
    "/auth/users/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Current user details" } },
      },
    },
    "/auth/sessions": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Logged in" } },
      },
    },
    "/auth/sessions/current": {
      put: {
        tags: ["Auth"],
        summary: "Refresh access token",
        responses: { "200": { description: "Access token refreshed" } },
      },
      delete: {
        tags: ["Auth"],
        summary: "Logout",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Logged out" } },
      },
    },
    "/discover/services": {
      get: {
        tags: ["Discover"],
        summary: "Search services",
        parameters: [
          { in: "query", name: "keyword", schema: { type: "string" } },
          { in: "query", name: "category", schema: { type: "string" } },
          { in: "query", name: "location", schema: { type: "string" } },
          { in: "query", name: "minPrice", schema: { type: "number" } },
          { in: "query", name: "maxPrice", schema: { type: "number" } },
          { in: "query", name: "page", schema: { type: "number" } },
          { in: "query", name: "limit", schema: { type: "number" } },
        ],
        responses: { "200": { description: "Services list" } },
      },
    },
    "/discover/services/availability": {
      get: {
        tags: ["Discover"],
        summary: "Filter services by availability",
        parameters: [
          { in: "query", name: "date", required: true, schema: { type: "string", format: "date" } },
          { in: "query", name: "category", schema: { type: "string" } },
          { in: "query", name: "location", schema: { type: "string" } },
          { in: "query", name: "page", schema: { type: "number" } },
          { in: "query", name: "limit", schema: { type: "number" } },
        ],
        responses: { "200": { description: "Available services list" } },
      },
    },
    "/discover/services/{serviceId}": {
      get: {
        tags: ["Discover"],
        summary: "Get service details",
        parameters: [
          { in: "path", name: "serviceId", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Service details" } },
      },
    },
    "/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Create booking",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["serviceId", "dates"],
                properties: {
                  serviceId: { type: "string" },
                  dates: { type: "array", items: { type: "string", format: "date" } },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Booking created" } },
      },
    },
    "/bookings/me": {
      get: {
        tags: ["Bookings"],
        summary: "Get current user bookings",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Bookings list" } },
      },
    },
    "/bookings/price/calculate": {
      get: {
        tags: ["Bookings"],
        summary: "Calculate booking price",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "serviceId", required: true, schema: { type: "string" } },
          { in: "query", name: "dates", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Calculated price" } },
      },
    },
    "/admin/services": {
      get: {
        tags: ["Admin"],
        summary: "List admin services",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Admin services" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Create service",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Service created" } },
      },
    },
    "/admin/services/{serviceId}": {
      patch: {
        tags: ["Admin"],
        summary: "Update service",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "serviceId", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Service updated" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete service",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "serviceId", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Service deleted" } },
      },
    },
    "/admin/services/{serviceId}/bookings": {
      get: {
        tags: ["Admin"],
        summary: "Get service bookings",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "serviceId", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Service bookings" } },
      },
    },
    "/admin/services/{serviceId}/bookings/{bookingId}/status": {
      patch: {
        tags: ["Admin"],
        summary: "Update booking status",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "serviceId", required: true, schema: { type: "string" } },
          { in: "path", name: "bookingId", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Booking status updated" } },
      },
    },
  },
} as const;
