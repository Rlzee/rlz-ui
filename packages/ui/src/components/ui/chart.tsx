"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { TooltipValueType } from "recharts";

import { cn } from "@rlz/ui/lib/cn";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string; // "var(--chart-N)" | custom color | omitted = auto-assigned
  }
>;

// Default palette, cycled automatically for series without a color.
const DEFAULT_CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

// Fills in missing colors from the default palette for any series that
// didn't specify one.
function resolveChartConfig(config: ChartConfig): ChartConfig {
  const keys = Object.keys(config);
  return Object.fromEntries(
    keys.map((key, i) => [
      key,
      {
        ...config[key],
        color:
          config[key].color ??
          DEFAULT_CHART_COLORS[i % DEFAULT_CHART_COLORS.length],
      },
    ])
  );
}

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartRoot />");
  }
  return context;
}

// Resolves the right ChartConfig key from a Recharts payload item. Needed
// for chart types where the key isn't directly dataKey/name — e.g. Pie or
// RadialBar charts, where dataKey is often generic across all slices and
// the real identifying info sits elsewhere: either as a string carried by
// the `key` field itself, or nested in `item.payload`, the source data
// object before Recharts transforms it.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

function ChartRoot({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  initialDimension?: { width: number; height: number };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  const resolvedConfig = React.useMemo(
    () => resolveChartConfig(config),
    [config]
  );

  return (
    <ChartContext.Provider value={{ config: resolvedConfig }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={resolvedConfig} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// Injects --color-<key> per series, scoped to this chart instance. No
// light/dark logic needed here: --chart-N tokens already switch on their
// own via the .dark rule defined in the global theme.
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.color);

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig.map(([key, cfg]) => `  --color-${key}: ${cfg.color};`).join("\n")}
}
`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

// TooltipContentProps is the type Recharts uses to call `content`
// (active, payload, label...) — different from the <Tooltip> component's
// own props.
type BaseTooltipContentProps = RechartsPrimitive.TooltipContentProps<
  TooltipValueType,
  string
>;

type ChartTooltipContentProps = Partial<BaseTooltipContentProps> & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (
    label: React.ReactNode,
    payload: BaseTooltipContentProps["payload"]
  ) => React.ReactNode;
  className?: string;
  // Explicit key override for cases where dataKey/name don't directly
  // match a ChartConfig key.
  nameKey?: string;
  labelKey?: string;
};

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  className,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const resolvedLabel = React.useMemo(() => {
    if (labelKey && typeof label !== "undefined") {
      return config[labelKey]?.label ?? label;
    }
    return typeof label === "string" ? config[label]?.label ?? label : label;
  }, [label, labelKey, config]);

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      data-slot="chart-tooltip-content"
      className={cn(
        "grid min-w-32 gap-1.5 rounded-md border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md",
        className
      )}
    >
      {!hideLabel && resolvedLabel != null && (
        <div className="font-medium">
          {labelFormatter
            ? labelFormatter(resolvedLabel, payload)
            : resolvedLabel}
        </div>
      )}
      <div className="grid gap-1.5">
        {payload
          // Recharts can mark a series "none" to keep it in the data
          // without showing it in the tooltip.
          .filter(
            (item: BaseTooltipContentProps["payload"][number]) =>
              item.type !== "none"
          )
          .map((item: BaseTooltipContentProps["payload"][number]) => {
            // dataKey can be a string OR an accessor function in Recharts;
            // we skip the function case, we just need a displayable key.
            const resolvedKey =
              typeof item.dataKey === "function"
                ? item.name
                : nameKey ?? item.dataKey ?? item.name;
            const key = resolvedKey != null ? String(resolvedKey) : undefined;
            const itemConfig = key
              ? getPayloadConfigFromPayload(config, item, key)
              : undefined;
            // Falls back to item.payload.fill for chart types where color
            // lives on the data object itself (e.g. Pie, RadialBar) rather
            // than on item.color directly.
            const indicatorColor =
              item.color ??
              (item.payload as { fill?: string } | undefined)?.fill ??
              itemConfig?.color;

            return (
              <div key={key} className="flex w-full items-center gap-2">
                {!hideIndicator && (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <div className="flex flex-1 justify-between leading-none">
                  <span className="text-muted-foreground">
                    {itemConfig?.label ?? item.name}
                  </span>
                  <span className="font-mono font-medium tabular-nums">
                    {item.value == null
                      ? null
                      : typeof item.value === "number"
                      ? item.value.toLocaleString()
                      : String(item.value)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

// LegendPayload is the type Recharts exports for a legend payload item —
// different from LegendProps (the props passed to <Legend>).
type ChartLegendContentProps = React.ComponentProps<"div"> &
  Omit<RechartsPrimitive.DefaultLegendContentProps, "payload"> & {
    // Retyped: Recharts doesn't allow `undefined` here, but it's legitimate
    // before the chart's first render.
    payload?: readonly RechartsPrimitive.LegendPayload[];
    hideIcon?: boolean;
    nameKey?: string;
  };

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
  ...props
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      data-slot="chart-legend-content"
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
      {...props}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const resolvedKey = nameKey ?? item.dataKey ?? item.value;
          const key = resolvedKey != null ? String(resolvedKey) : undefined;
          const itemConfig = key
            ? getPayloadConfigFromPayload(config, item, key)
            : undefined;

          return (
            <div
              key={key ?? item.value}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <span
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-muted-foreground">
                {itemConfig?.label ?? item.value}
              </span>
            </div>
          );
        })}
    </div>
  );
}

/* eslint-disable react-refresh/only-export-components */
const ChartExports = Object.assign(ChartRoot, {
  Style: ChartStyle,
  Tooltip: ChartTooltip,
  TooltipContent: ChartTooltipContent,
  Legend: ChartLegend,
  LegendContent: ChartLegendContent,
});

export {
  useChart,
  resolveChartConfig,
  ChartExports as Chart,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};

// Re-exported under its own namespace so BarChart, XAxis, CartesianGrid...
// are available without a separate `recharts` import, without risking a
// name collision with our own exports above.
export * as Recharts from "recharts";
