import { vitest } from "vitest"
import { Logger } from "winston"

export const logger = {
    info: vitest.fn as any,
    warn: vitest.fn as any,
    error: vitest.fn as any,
} as Logger
