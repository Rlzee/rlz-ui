import { rlzConfig } from "@/config/types";

export type AddComponentRunOptions = {
  cwd: string;
  componentName: string;
  config: rlzConfig;
  type: string;
};

export type FilesType = "utils" | "types" | "lib";

export type AddFilesRunOptions = {
  cwd: string;
  fileNames: string[];
  config: rlzConfig;
  type: FilesType;
};
