import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
  debug(message: string) {
    console.log(`DEBUG: ${message}`);
  }

  error(message: string) {
    console.error(`ERROR: ${message}`);
  }

  info(message: string) {
    console.log(` INFO: ${message}`);
  }

  warn(message: string) {
    console.warn(` WARN: ${message}`);
  }
}
