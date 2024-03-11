import path from "node:path"
import * as dotEnv from "dotenv"
import { z } from "zod"

// biome-ignore lint/complexity/useLiteralKeys: avoiding lint confusion
const envFile = process.env?.["NODE_ENV"] !== "production" ? `.env.${process.env?.["NODE_ENV"]}` : ".env"

const __dirname = import.meta.dirname
const ENV_FILE_PATH = path.resolve(__dirname, "..", envFile)

dotEnv.config({ path: ENV_FILE_PATH })

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().positive().min(80).max(65_000).default(3000),
    // DB_HOST: z.string().ip().default("127.0.0.1"),
    // DB_USERNAME: z.string(),
    // DB_PASSWORD: z.string(),
    // DB_DIALECT: z.string(),
    // DB_DATABASE: z.string(),
})

let _ENV: z.output<typeof envSchema>

try {
    _ENV = envSchema.parse(process.env)
} catch {
    process.stderr.write("[ENV] Variáveis de ambiente do servidor pendentes")
    process.exit(1)
}

export const ENV = _ENV
