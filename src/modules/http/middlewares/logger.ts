import { LoggerService } from "$/services/logger";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // For some reason LoggerService cannot be injected directly in the
  // constructor. I'll figure this out later but for now we'll just create it
  // here manually.
  private readonly logger: LoggerService;
  constructor() {
    this.logger = new LoggerService();
  }

  private lastRequestId = 0;
  use(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    const { logger } = this;

    const requestId = ++this.lastRequestId;
    logger.info(`REQ(${requestId}): ${req.method} ${req.url}`);

    const startTime = process.hrtime.bigint();
    res.on("finish", () => {
      const endTime = process.hrtime.bigint();
      const duration = endTime - startTime;
      const durationInMs = Number(duration / 1_000_000n);

      logger.info(
        `RES(${requestId}): ${res.statusCode} ${durationInMs.toFixed(2)}ms`,
      );
    });

    next();
  }
}
