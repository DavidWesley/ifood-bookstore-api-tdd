import { ENV } from "@/env.ts"
import { Logger } from "@/lib/logger.ts"
import { server } from "@/server.ts"

server.listen(ENV.PORT, () => {
    Logger.info(`Server is running on port ${ENV.PORT}`)
})
