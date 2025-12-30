import type { InitOptions } from "../../types/init";
import { logger } from "../../utils/logger";

export async function runInit({
  cwd,
  framework,
}: InitOptions): Promise<void> {
  logger.info("Initializing rlz-ui...");
}
