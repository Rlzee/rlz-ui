import { rlzConfig } from "./config";

export type AddComponentRunOptions = {
  cwd: string;
  componentName: string;
  config: rlzConfig;
  type: "ui" | "base";
};

export type FilesType = "utils" | "types" | "lib";

export type AddFilesRunOptions = {
  cwd: string;
  fileNames: string[];
  config: rlzConfig;
  type: FilesType;
};
