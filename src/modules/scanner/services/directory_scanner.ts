import { FilesystemService } from "$/services/filesystem";
import { LoggerService } from "$/services/logger";
import type { ScanResult as SnesScanResult } from "$scanner/services/directory_scanners/snes";
import { SnesDirectoryScannerService } from "$scanner/services/directory_scanners/snes";
import { Injectable } from "@nestjs/common";

export type ScanResult = {
  snes?: SnesScanResult | undefined;
};

@Injectable()
export class DirectoryScannerService {
  constructor(
    private readonly dsSnes: SnesDirectoryScannerService,
    private readonly fs: FilesystemService,
    private readonly logger: LoggerService,
  ) {}

  public async scan(arg: { path: string }) {
    const { dsSnes, logger } = this;
    const { path } = arg;
    const entries = await this.fs.listDirectory({ path });

    const retval: ScanResult = {};
    for (const entry of entries) {
      if (entry.name === "snes" && entry.isDirectory()) {
        logger.debug(`Found SNES directory: ${entry.name}`);
        retval.snes = await dsSnes.scan({ path: `${path}/snes` });

        continue;
      }

      logger.warn(`Found unknown entry: ${entry.name}; skipping`);
    }
  }
}
