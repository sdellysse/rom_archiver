import { Injectable } from "@nestjs/common";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  HTTP_LISTEN_HOST: z.string().trim().default("0.0.0.0"),
  HTTP_LISTEN_PORT: z
    .string()
    .trim()
    .regex(/^\d+$/)
    .transform(Number)
    .default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});
type EnvSchema = z.infer<typeof envSchema>;

@Injectable()
export class EnvironmentVariablesService {
  private values: EnvSchema | null = null;
  valueOf<TKey extends keyof EnvSchema>(key: TKey): EnvSchema[TKey] {
    if (this.values === null) {
      this.values = envSchema.parse(process.env);
    }

    return this.values[key];
  }
}
