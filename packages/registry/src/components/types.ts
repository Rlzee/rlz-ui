export type PresetStyleValue = string | number;

export type PresetStyles = Record<string, PresetStyleValue>;

export type ComponentStyleConfig = {
  styles?: PresetStyles;
  parts?: Record<string, PresetStyles>;
  states?: Record<
    string,
    {
      styles?: PresetStyles;
      parts?: Record<string, PresetStyles>;
    }
  >;
  selectors?: Record<string, PresetStyles>;
};

export type PresetComponents = Record<string, ComponentStyleConfig>;
