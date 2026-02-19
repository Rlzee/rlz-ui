import type { IconLib } from "./libs";
import type { IconName } from "./names";

export const ICON_MAP: Record<IconLib, Record<IconName, string>> = {
  lucide: {
    check: "Check",
    "chevron-right": "ChevronRight",
    circle: "Circle",
    x: "X",
    "chevron-down": "ChevronDown",
    plus: "Plus",
    minus: "Minus",
    "panel-left": "PanelLeft",
    "circle-alert": "CircleAlert",
    "circle-check": "CircleCheck",
    info: "Info",
    "loader-circle": "LoaderCircle",
    "triangle-alert": "TriangleAlert",
  },

  tabler: {
    check: "IconCheck",
    "chevron-right": "IconChevronRight",
    circle: "IconCircle",
    x: "IconX",
    "chevron-down": "IconChevronDown",
    plus: "IconPlus",
    minus: "IconMinus",
    "panel-left": "IconLayoutSidebarLeft",
    "circle-alert": "IconAlertCircle",
    "circle-check": "IconCircleCheck",
    info: "IconInfoCircle",
    "loader-circle": "IconLoader",
    "triangle-alert": "IconAlertTriangle",
  },
};
