export type RegistryType = "component" | "lib" | "hook";

export type RegistryItem = {
  name: string;
  type: RegistryType;
  description?: string;
  path: string;
  destPath?: string;
  version: string;
  dependencies?: string[];
  registryDependencies?: string[];
  allowManualInstall?: boolean | "deprecated";
};
