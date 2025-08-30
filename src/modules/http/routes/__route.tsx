import { htmlFrom } from "$/modules/http/lib/jsx";
import { EnvironmentVariablesService } from "$/services/environment_variables";
import { RootLayout } from "$http/routes/__layout";
import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class Route {
  constructor(private readonly env: EnvironmentVariablesService) {}

  @Get()
  handleGet() {
    const { env } = this;

    return htmlFrom(
      <RootLayout title="/" nodeEnv={env.valueOf("NODE_ENV")}>
        <div className="mt-8 text-2xl font-bold text-center">
          Hello from Nest + Bun!
        </div>
      </RootLayout>,
    );
  }
}
