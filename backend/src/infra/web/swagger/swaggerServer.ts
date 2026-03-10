import express from "express";
import swaggerUi from "swagger-ui-express";
import { ENV } from "@/config/env.config";
import { openApiSpec } from "./openapi";
import { logger } from "@/infra/logger/logger";

export function startSwaggerServer(): void {
  const docsApp = express();

  docsApp.get("/openapi.json", (_req, res) => {
    res.json(openApiSpec);
  });

  docsApp.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      explorer: true,
    }),
  );

  docsApp.listen(ENV.SWAGGER_PORT, () => {
    logger.info(
      `Swagger UI running on http://localhost:${ENV.SWAGGER_PORT}/docs`,
    );
  });
}
