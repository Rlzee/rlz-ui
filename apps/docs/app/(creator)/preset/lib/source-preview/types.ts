export type SourcePreviewEntry = {
  id: string;
  label: string;
  entry?: string;
  warning?: string;
  primary?: boolean;
};

export type SourcePreviewSelection = Record<string, string | boolean | number>;
export type SourcePreviewSelectionDefinition = {
  axes: Record<string, string[]>;
  props: string[];
};

export type PreviewModule = {
  code: string;
  imports: Record<string, string>;
};

export type SourcePreviewBundle = {
  modules: Record<string, PreviewModule>;
  preview: string;
  example: string;
  previewWarning?: string;
  exampleWarning?: string;
  contexts: Record<string, string>;
  resources?: Record<string, string>;
  selection?: SourcePreviewSelectionDefinition;
  consumers?: Record<string, string[]>;
  warnings: string[];
  scenarios?: SourcePreviewEntry[];
  examples?: SourcePreviewEntry[];
};
