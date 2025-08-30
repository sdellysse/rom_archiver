import { Injectable } from "@nestjs/common";
import fs from "node:fs/promises";

@Injectable()
export class FilesystemService {
  public async listDirectory(arg: { path: string; recursive?: boolean }) {
    const { path, recursive } = arg;

    return fs.readdir(path, {
      encoding: "utf-8",
      withFileTypes: true,
      recursive: recursive ?? false,
    });
  }

  public async readFile(arg: { path: string }) {
    const { path } = arg;

    return fs.readFile(path, {
      encoding: "utf-8",
    });
  }
}
