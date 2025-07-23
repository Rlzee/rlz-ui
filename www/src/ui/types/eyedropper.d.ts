interface EyeDropper {
  new(): EyeDropper;
  open(): Promise<{ sRGBHex: string }>;
}

interface Window {
  EyeDropper?: {
    new(): EyeDropper;
  };
}

declare var EyeDropper: {
  new(): EyeDropper;
};
