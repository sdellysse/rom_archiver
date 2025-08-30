import { DrizzleService } from "$/services/drizzle";
import { EnvironmentVariablesService } from "$/services/environment_variables";
import { FilesystemService } from "$/services/filesystem";
import { LoggerService } from "$/services/logger";
import { HttpModule } from "$http/__module";
import {
  Global,
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from "@nestjs/common";
import { ScannerModule } from "./modules/scanner/__module";

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    DrizzleService,
    EnvironmentVariablesService,
    FilesystemService,
    LoggerService,
  ],
})
export class GlobalModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {}
}

@Module({
  imports: [GlobalModule, HttpModule, ScannerModule],
  controllers: [],
  providers: [],
})
export class RootModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {}
}
