"use client";

import * as React from "react";

import type {
  ComponentCapabilities,
  PresetComponentCustomization,
} from "@rlz/registry";

import { currentBool, currentVariantValue } from "../lib/component-edits";

import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import { Input, type InputProps } from "@rlz/ui/components/ui/input";
import { Card } from "@rlz/ui/components/ui/card";
import { Dialog } from "@rlz/ui/components/ui/dialog";

type DialogVariant = "default" | "bare" | "bare-top" | "bare-bottom";

type LiveDemoProps = {
  slug: string;
  capabilities: ComponentCapabilities;
  edit?: PresetComponentCustomization;
};

/**
 * Playground target: a single instance of the real component wired to the
 * current Creator edits. Prop-driven previews can't be fully generic, so each
 * pilot has an explicit render branch here; an unknown slug returns null and
 * the playground simply shows its demos instead.
 */
export function LiveDemo({ slug, capabilities, edit }: LiveDemoProps) {
  const variantOf = (name: string) => {
    const axis = capabilities.variants?.find((item) => item.name === name);
    return axis ? currentVariantValue(axis, edit) : undefined;
  };

  switch (slug) {
    case "button":
      return (
        <Button
          variant={variantOf("variant") as ButtonProps["variant"]}
          size={variantOf("size") as ButtonProps["size"]}
          style={radiusStyle(edit)}
        >
          Button
        </Button>
      );

    case "input":
      return (
        <Input
          variant={variantOf("variant") as InputProps["variant"]}
          placeholder="Type here"
          className="w-56"
        />
      );

    case "card": {
      const style: React.CSSProperties = {};
      if (edit?.styles?.radius !== undefined) {
        style.borderRadius = `${edit.styles.radius}rem`;
      }
      if (edit?.styles?.gap !== undefined) {
        style.gap = `${edit.styles.gap}rem`;
      }
      if (edit?.styles?.padding !== undefined) {
        style.padding = `${edit.styles.padding}rem`;
      }

      return (
        <Card
          style={Object.keys(style).length ? style : undefined}
          className="w-full max-w-sm"
        >
          <Card.Header>
            <Card.Title>Card title</Card.Title>
            <Card.Description>
              Card description supporting the body content.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <span className="text-sm text-muted-foreground">
              Card body content.
            </span>
          </Card.Body>
          <Card.Footer>
            <Button size="sm">Action</Button>
          </Card.Footer>
        </Card>
      );
    }

    case "dialog":
      return (
        <Dialog variant={variantOf("variant") as DialogVariant}>
          <Dialog.Trigger render={<Button variant="outline" size="sm" />}>
            Open dialog
          </Dialog.Trigger>
          <Dialog.Popup
            backdrop={currentBool("backdrop", edit)}
            backdropBlur={currentBool("backdropBlur", edit)}
            showCloseButton={currentBool("showCloseButton", edit)}
            style={radiusStyle(edit)}
          >
            <Dialog.Header>
              <Dialog.Title>Dialog title</Dialog.Title>
              <Dialog.Description>Dialog description.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <span className="text-sm text-muted-foreground">
                Dialog content.
              </span>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button size="sm" />}>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog>
      );

    default:
      return null;
  }
}

// Radius override applied only when the user actually touched it, so an
// untouched component keeps its own rounded class.
function radiusStyle(edit?: PresetComponentCustomization) {
  return edit?.styles?.radius !== undefined
    ? { borderRadius: `${edit.styles.radius}rem` }
    : undefined;
}
