import request from "supertest";
import { app } from "@/infra/web/server";

describe("Auth API (integration)", () => {
  it("returns 400 for invalid login payload", async () => {
    const response = await request(app).post("/api/auth/sessions").send({
      email: "invalid-email",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
