"use client";

import {
  ComponentProps,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { cn } from "@/src/lib/utils";
import Hue from "@uiw/react-color-hue";
import Saturation from "@uiw/react-color-saturation";
import Alpha from "@uiw/react-color-alpha";
import {
  hexToHsva,
  hsvaToHex,
  hsvaToHsla,
  hsvaToRgba,
  hslaToHsva,
  rgbaToHsva,
} from "@uiw/color-convert";
import { Combobox } from "./combobox";
import { Check } from "lucide-react";
import { InputCopy } from "@/src/ui/components/custom/input/input-copy";

/* ---------------------------------- Types ---------------------------------- */

type HsvaColor = ReturnType<typeof hexToHsva>;
type ColorFormat = "hex" | "hsl" | "rgba";

interface ColorContextType {
  color: HsvaColor;
  setColor: (color: HsvaColor) => void;
  resetColor: () => void;
  format: ColorFormat;
  setFormat: (val: ColorFormat) => void;
}

/* -------------------------------- Context Color Picker -------------------------------- */

const ColorContext = createContext<ColorContextType | undefined>(undefined);

const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) throw new Error("useColor must be used within a ColorProvider");
  return context;
};

/* -------------------------------- Color Picker Provider -------------------------------- */

const ColorPickerProvider = ({
  children,
  color,
  setColor,
  resetColor,
  format,
  setFormat,
}: ColorContextType & { children: ReactNode }) => {
  return (
    <ColorContext.Provider
      data-slot="color-picker-provider"
      value={{ color, setColor, resetColor, format, setFormat }}
    >
      {children}
    </ColorContext.Provider>
  );
};

/* -------------------------------- Root Color Picker -------------------------------- */

const ColorPicker = ({
  className,
  children,
  defaultColor = "#3b82f6",
  ...props
}: ComponentProps<"div"> & { defaultColor?: string }) => {
  const [color, setColor] = useState<HsvaColor>(() => hexToHsva(defaultColor));
  const [format, setFormat] = useState<ColorFormat>("hsl");

  const resetColor = () => setColor(hexToHsva(defaultColor));

  return (
    <ColorPickerProvider
      color={color}
      setColor={setColor}
      resetColor={resetColor}
      format={format}
      setFormat={setFormat}
    >
      <div
        data-slot="color-picker"
        className={cn("w-[360px] p-4 space-y-4", className)}
        {...props}
      >
        {children}
      </div>
    </ColorPickerProvider>
  );
};

/* ---------------------------- Color Picker Saturation Block ---------------------------- */

const ColorPickerSaturation = ({ className }: { className?: string }) => {
  const { color, setColor } = useColor();

  return (
    <div className={cn("border border-border rounded-[0.3rem]", className)}>
      <Saturation
        data-slot="color-picker-saturation"
        hsva={color}
        onChange={setColor}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "4/2",
          borderRadius: "0.3rem",
        }}
      />
    </div>
  );
};

/* ------------------------------ Color Picker Hue Slider ------------------------------ */

const ColorPickerHue = ({ className }: { className?: string }) => {
  const { color, setColor } = useColor();

  return (
    <Hue
      data-slot="color-picker-hue"
      hue={color.h}
      onChange={(newHue) => setColor({ ...color, h: newHue.h })}
      style={{ height: 14 }}
      className={cn("w-full", className)}
    />
  );
};

/* ----------------------------- Color Picker Alpha Slider ----------------------------- */

const ColorPickerAlpha = ({ className }: { className?: string }) => {
  const { color, setColor } = useColor();

  return (
    <Alpha
      data-slot="color-picker-alpha"
      hsva={color}
      onChange={(newAlpha) => setColor({ ...color, a: newAlpha.a })}
      style={{ height: 14 }}
      className={cn("w-full", className)}
    />
  );
};

/* ----------------------------- Color Picker Preview ----------------------------- */

const ColorPickerPreview = ({ className }: { className?: string }) => {
  const { color } = useColor();

  return (
    <div
      data-slot="color-picker-preview"
      className={cn("w-full h-12 rounded-md border border-border", className)}
      style={{
        backgroundColor: `rgba(${hsvaToRgba(color).r}, ${
          hsvaToRgba(color).g
        }, ${hsvaToRgba(color).b}, ${color.a})`,
      }}
    />
  );
};

/* ------------------------------- Color Picker Format Selector ------------------------------- */

const ColorPickerFormatSelector = ({
  className,
  contentClassName,
}: {
  className?: string;
  contentClassName?: string;
}) => {
  const { format, setFormat } = useColor();

  return (
    <Combobox data-slot="color-picker-format-selector">
      <Combobox.Trigger>
        <Combobox.TriggerButton
          placeholder={format.toUpperCase() || "Select format"}
          className={cn("w-[100px]", className)}
        />
      </Combobox.Trigger>
      <Combobox.Content className={cn("w-[100px]", contentClassName)}>
        <Combobox.Group>
          {["hex", "hsl", "rgba"].map((fmt) => (
            <Combobox.Item
              key={fmt}
              onSelect={() => setFormat(fmt as ColorFormat)}
            >
              <span>{fmt.toUpperCase()}</span>
              <Check
                className={cn(
                  "ml-auto",
                  format === fmt ? "opacity-100" : "opacity-0"
                )}
              />
            </Combobox.Item>
          ))}
        </Combobox.Group>
      </Combobox.Content>
    </Combobox>
  );
};

/* ------------------------------- Color Picker Input ------------------------------- */

const ColorPickerInput = () => {
  const { color, format } = useColor();

  const getFormattedColor = () => {
    if (format === "hex") {
      return hsvaToHex(color);
    }

    if (format === "rgba") {
      const rgba = hsvaToRgba(color);
      return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(
        rgba.b
      )}, ${color.a.toFixed(2)})`;
    }

    const hsl = hsvaToHsla(color);

    if (color.a < 1) {
      return `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(
        hsl.l
      )}%, ${color.a.toFixed(2)})`;
    }

    return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(
      hsl.l
    )}%)`;
  };

  return (
    <InputCopy value={getFormattedColor()} data-slot="color-picker-input" />
  );
};

/* ------------------------------- Export ------------------------------- */

const ColorPickerComposed = Object.assign(ColorPicker, {
  Saturation: ColorPickerSaturation,
  Hue: ColorPickerHue,
  Alpha: ColorPickerAlpha,
  Preview: ColorPickerPreview,
  FormatSelector: ColorPickerFormatSelector,
  Input: ColorPickerInput,
});

export {
  ColorPickerComposed as ColorPicker,
  useColor,
  ColorPickerProvider,
  ColorPickerAlpha,
  ColorPickerHue,
  ColorPickerSaturation,
  ColorPickerPreview,
  ColorPickerFormatSelector,
  ColorPickerInput,
};
