"use client";

import { useMemo } from "react";
import { useAtom } from "jotai";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { resolveAnimationPart } from "../lib/animation-parts";
import { slugFromId } from "../lib/slug";
import { animationPartAtom } from "../state/animation-panel-state";

export function useAnimationPart() {
  const [selected] = useSelectedComponent();
  const slug = selected ? slugFromId(selected.id) : "";
  const parts = useMemo(() => partsOf(slug), [slug]);
  const [partName, setPartName] = useAtom(animationPartAtom);
  const selectedPart = resolveAnimationPart(parts, partName);

  return { slug, parts, partName, setPartName, selectedPart };
}
