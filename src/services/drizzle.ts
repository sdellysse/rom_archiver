import type { EnvironmentVariablesService } from "$/services/environment_variables";
import type { LoggerService } from "$/services/logger";
import { Injectable } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";

@Injectable()
export class DrizzleService {
  constructor(
    private readonly env: EnvironmentVariablesService,
    private readonly logger: LoggerService,
  ) {}

  private _db: ReturnType<typeof drizzle> | null = null;
  db() {
    const { env, logger } = this;

    if (!this._db) {
      logger.info("Initializing database connection");
      this._db = drizzle(env.valueOf("DATABASE_URL"));
    }

    return this._db;
  }
}
