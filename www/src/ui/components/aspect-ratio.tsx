"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { ComponentProps } from "react";

const AspectRatio = (
  props: ComponentProps<typeof AspectRatioPrimitive.Root>
) => {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
};

export { AspectRatio };
