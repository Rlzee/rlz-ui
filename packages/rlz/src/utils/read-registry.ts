import { readRegistry as registry } from "@rlz/registry";
import { UI_REGISTRY_URL } from "@/config";

export function readRegistry() {
  return registry(UI_REGISTRY_URL);
}
