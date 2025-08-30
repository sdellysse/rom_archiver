import { DirectoryScannerService } from "$scanner/services/directory_scanner";
import { SnesDirectoryScannerService } from "$scanner/services/directory_scanners/snes";
import {
  Module,
  type MiddlewareConsumer,
  type NestModule,
} from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [DirectoryScannerService, SnesDirectoryScannerService],
  exports: [DirectoryScannerService],
})
export class ScannerModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {}
}
