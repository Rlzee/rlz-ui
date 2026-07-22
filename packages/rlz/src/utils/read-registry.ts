import { readRegistry as registry } from "@rlz/registry";
import { UI_ROOT_URL } from "@/config";

export function readRegistry() {
  return registry(UI_ROOT_URL);
}
