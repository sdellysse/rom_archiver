import { AssetsController } from "$http/controllers/assets";
import { LoggerMiddleware } from "$http/middlewares/logger";
import { Route as Route__ } from "$http/routes/__route";
import {
  Module,
  type MiddlewareConsumer,
  type NestModule,
} from "@nestjs/common";

@Module({
  imports: [],
  controllers: [
    // Pull in asset controller first
    AssetsController,

    // And now the routes
    Route__,
  ],
  providers: [],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
