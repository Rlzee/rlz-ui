import { z } from "zod";
import { ICON_LIBS, type IconLib } from "./libs";

export const iconLibSchema = z.enum(
  Object.keys(ICON_LIBS) as [IconLib, ...IconLib[]]
);
