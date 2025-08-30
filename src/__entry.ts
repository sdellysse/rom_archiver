import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { RootModule } from "./__module";
import { EnvironmentVariablesService } from "./services/environment_variables";
import { LoggerService } from "./services/logger";

const app = await NestFactory.create(RootModule);
const logger = app.get(LoggerService);
logger.info("Nest application created.");

const env = app.get(EnvironmentVariablesService);

logger.info("Starting HTTP server...");
await app.listen(
  env.valueOf("HTTP_LISTEN_PORT"),
  env.valueOf("HTTP_LISTEN_HOST"),
);
logger.info("HTTP server started.");

logger.info(
  `HTTP Server running on http://${env.valueOf("HTTP_LISTEN_HOST")}:${env.valueOf("HTTP_LISTEN_PORT")}`,
);
