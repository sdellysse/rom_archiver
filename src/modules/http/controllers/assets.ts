import { EnvironmentVariablesService } from "$/services/environment_variables";
import { Controller, Get, Header } from "@nestjs/common";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import postcss from "postcss";

@Controller()
export class AssetsController {
  constructor(private readonly env: EnvironmentVariablesService) {}

  @Get("/main.css")
  @Header("Content-Type", "text/css")
  async getMainCss() {
    const { env } = this;

    if (env.valueOf("NODE_ENV") === "production") {
      throw new Error(
        "AssetsController.getMainCss should not be called in production",
      );
    }

    const content = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `;

    const processor = postcss([tailwindcss(), autoprefixer()]);
    const { css } = await processor.process(content, {
      from: "assets.css",
    });

    return css;
  }

  @Get("/main.js")
  @Header("Content-Type", "application/javascript")
  async getMainJs() {
    const { env } = this;

    if (env.valueOf("NODE_ENV") === "production") {
      throw new Error(
        "AssetsController.getMainJs should not be called in production",
      );
    }

    const content = `
      import "https://unpkg.com/htmx.org@1.9.2";
      import "https://unpkg.com/hyperscript.org@0.9.7";
    `;

    return content;
  }
}
