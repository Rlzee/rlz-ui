import { rlzConfig } from "@/config/types";

export type AddComponentRunOptions = {
  cwd: string;
  componentName: string;
  config: rlzConfig;
  type: FilesType | string;
};

export type FilesType = Exclude<keyof rlzConfig["dirs"], "root" | "components">;

export type AddFilesRunOptions = {
  cwd: string;
  fileNames: string[];
  config: rlzConfig;
  type: FilesType;
};
