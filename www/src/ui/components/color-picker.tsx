"use client";

import {
  ComponentProps,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { cn } from "@/src/lib/utils";
import Saturation from "@uiw/react-color-saturation";
import { Slider } from "./slider";
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
      <div className={cn("w-[360px] p-4 space-y-4", className)} {...props}>
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
    <div className={cn("relative w-full", className)}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          height: "14px",
        }}
      />
      <Slider.Root
        value={[color.h]}
        onValueChange={(values) => setColor({ ...color, h: values[0] })}
        min={0}
        max={360}
        step={1}
        className="relative z-10"
        style={{ height: 14 }}
      >
        <Slider.Track className="!bg-transparent">
          <Slider.Range className="!bg-transparent !bg-none !from-transparent !to-transparent !shadow-none !border-none !inset-shadow-none" />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Root>
    </div>
  );
};

/* ----------------------------- Color Picker Alpha Slider ----------------------------- */

const ColorPickerAlpha = ({ className }: { className?: string }) => {
  const { color, setColor } = useColor();

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className="absolute inset-0 rounded-full bg-tra"
        style={{
          background: `linear-gradient(to right, 
            rgba(${hsvaToRgba(color).r}, ${hsvaToRgba(color).g}, ${
            hsvaToRgba(color).b
          }, 0) 0%, 
            rgba(${hsvaToRgba(color).r}, ${hsvaToRgba(color).g}, ${
            hsvaToRgba(color).b
          }, 1) 100%)`,
          height: "14px",
        }}
      />
      <Slider.Root
        value={[color.a * 100]}
        onValueChange={(values) => setColor({ ...color, a: values[0] / 100 })}
        min={0}
        max={100}
        step={1}
        className="relative z-10 border border-border rounded-md"
        style={{ height: 14 }}
      >
        <Slider.Track className="!bg-transparent">
          <Slider.Range className="!bg-transparent !bg-none !from-transparent !to-transparent !shadow-none !border-none !inset-shadow-none" />
        </Slider.Track>
        <Slider.Thumb />
      </Slider.Root>
    </div>
  );
};

/* ----------------------------- Color Picker Preview ----------------------------- */

const ColorPickerPreview = ({ className }: { className?: string }) => {
  const { color } = useColor();

  return (
    <div
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
    <Combobox>
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

  return <InputCopy value={getFormattedColor()} />;
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
