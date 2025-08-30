import { FilesystemService } from "$/services/filesystem";
import { LoggerService } from "$/services/logger";
import { Injectable } from "@nestjs/common";
import z from "zod";

export type ScanResult = {
  titles: Array<Title>;
};
export type Title = {
  baseRoms: Array<BaseRom>;
  patches: Array<Patch>;
  soundtracks: Array<Soundtrack>;
};
export type BaseRom = {
  pathname: string;
  language?: string | undefined;
  region?: string | undefined;
  version?: string | undefined;
};
export type Patch = {
  metadata: z.infer<typeof SnesDirectoryScannerService.patchMetadataSchema>;
  pathname: string;
};
export type Soundtrack = {
  pathname: string;
  tracks: Array<SoundtrackTracks>;
};
export type SoundtrackTracks = {
  number: number;
  title: string;
  pathname: string;
};

@Injectable()
export class SnesDirectoryScannerService {
  constructor(
    private readonly fs: FilesystemService,
    private readonly logger: LoggerService,
  ) {}

  public static readonly patchMetadataSchema = z.object({
    adds_msu1_soundtrack: z.boolean().default(false),
  });

  public async scan(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning Snes directory: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: ScanResult = {
      titles: [],
    };
    for (const entry of entries) {
      if (entry.name === "titles" && entry.isDirectory()) {
        logger.debug(`Found SNES titles directory: ${entry.name}`);
        retval.titles = await this.scanTitles({ path: `${path}/titles` });

        continue;
      }

      logger.warn(`Found unknown entry: ${entry.name}; skipping`);
    }

    return retval;
  }

  public async scanBaseRoms(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning SNES base ROMs directory: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: Array<BaseRom> = [];
    for (const entry of entries) {
      logger.debug(`Found SNES base ROM: ${entry.name}`);

      retval.push({
        pathname: `${path}/${entry.name}`,
        language: "unknown",
        region: "unknown",
        version: "unknown",
      });
    }

    return retval;
  }

  public async scanPatches(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning SNES patches directory: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: Array<Patch> = [];
    for (const entry of entries) {
      if (entry.name.endsWith(".json")) {
        const metadataEntry = entry;
        const patchEntry = entries.find(
          (it) => it.name === metadataEntry.name.replace(/\.json$/, ".ips"),
        );

        if (patchEntry === undefined) {
          logger.error(
            `Missing IPS patch for SNES patch: ${metadataEntry.name}`,
          );
          continue;
        }

        const patchMetadataContents = await fs.readFile({
          path: `${path}/${metadataEntry.name}`,
        });
        const parsedPatchMetadata = (
          this.constructor as typeof SnesDirectoryScannerService
        ).patchMetadataSchema.safeParse(patchMetadataContents);

        if (!parsedPatchMetadata.success) {
          logger.error(
            `Invalid SNES patch metadata: ${metadataEntry.name}: ${parsedPatchMetadata.error}`,
          );

          continue;
        }

        logger.debug(`Found SNES patch: ${metadataEntry.name}`);
        retval.push({
          metadata: parsedPatchMetadata.data,
          pathname: `${path}/${patchEntry.name}`,
        });

        continue;
      }

      logger.debug(`Found unknown entry: ${entry.name}; skipping`);
    }

    return retval;
  }

  public async scanSoundtracks(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning SNES soundtracks directory: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: Array<Soundtrack> = [];
    for (const entry of entries) {
      logger.debug(`Found SNES soundtrack: ${entry.name}`);

      retval.push({
        pathname: `${path}/${entry.name}`,
        tracks: await this.scanSoundtrackTracks({
          path: `${path}/${entry.name}`,
        }),
      });
    }

    return retval;
  }

  public async scanSoundtrackTracks(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning SNES soundtrack tracks directory: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: Array<SoundtrackTracks> = [];
    for (const entry of entries) {
      const matches = entry.name.match(/^(\d+) (.+)\.msu1$/);
      if (matches !== null) {
        const [numberAsString, title] = matches;
        logger.debug(`Found SNES soundtrack track: ${entry.name}`);
        retval.push({
          number: parseInt(numberAsString, 10),
          pathname: `${path}/${entry.name}`,
          title,
        });
      }
    }

    let previousNumber = 0;
    for (const track of retval) {
      if (track.number !== previousNumber + 1) {
        logger.warn(`Missing SNES soundtrack track: ${previousNumber + 1}`);
      }
      previousNumber = track.number;
    }

    return retval;
  }

  public async scanTitle(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning SNES game: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: Title = {
      baseRoms: [],
      patches: [],
      soundtracks: [],
    };
    for (const entry of entries) {
      if (entry.name === "base_roms" && entry.isDirectory()) {
        logger.debug(`Found SNES base ROMs directory: ${entry.name}`);
        retval.baseRoms = await this.scanBaseRoms({
          path: `${path}/base_roms`,
        });

        continue;
      }

      if (entry.name === "patches" && entry.isDirectory()) {
        logger.debug(`Found SNES patches directory: ${entry.name}`);
        retval.patches = await this.scanPatches({ path: `${path}/patches` });

        continue;
      }

      if (entry.name === "soundtracks" && entry.isDirectory()) {
        logger.debug(`Found SNES soundtracks directory: ${entry.name}`);
        retval.soundtracks = await this.scanSoundtracks({
          path: `${path}/soundtracks`,
        });

        continue;
      }

      logger.debug(`Found unknown entry: ${entry.name}; skipping`);
    }

    return retval;
  }

  public async scanTitles(arg: { path: string }) {
    const { logger, fs } = this;
    const { path } = arg;

    logger.debug(`Scanning SNES titles directory: ${path}`);
    const entries = await fs.listDirectory({ path });

    const retval: Array<Title> = [];
    for (const entry of entries) {
      if (entry.name.endsWith(".sfc")) {
        logger.debug(`Found SNES title: ${entry.name}`);
        retval.push(await this.scanTitle({ path: `${path}/${entry.name}` }));

        continue;
      }

      logger.debug(`Found unknown entry: ${entry.name}; skipping`);
    }

    return retval;
  }
}
