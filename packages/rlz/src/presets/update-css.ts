import fs from "fs-extra";
import postcss from "postcss";
import {
  presetAnimationsCss,
  presetUtilitiesCss,
  presetUtilityClasses,
} from "@rlz/registry";
import type {
  PresetColorToken,
  PresetColorConfig,
  PresetBaseConfig,
} from "@rlz/registry";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceVariable(css: string, cssVar: string, value: string): string {
  const regex = new RegExp(`(${escapeRegExp(cssVar)}\\s*:\\s*)[^;]+(;?)`, "g");

  return css.replace(regex, `$1${value}$2`);
}

function updateBlock(
  css: string,
  selector: string,
  colors: PresetColorToken[],
  mode: "light" | "dark"
): string {
  const selectorRegex = new RegExp(
    `(${escapeRegExp(selector)}\\s*\\{)([\\s\\S]*?)(\\})`,
    "g"
  );

  return css.replace(selectorRegex, (_, start, content, end) => {
    let updatedContent = content;

    for (const color of colors) {
      updatedContent = replaceVariable(
        updatedContent,
        color.cssVar,
        color[mode].value
      );
    }

    return `${start}${updatedContent}${end}`;
  });
}

function updateUtilities(
  css: string,
  utilities: Record<string, string>
): string {
  if (!Object.keys(utilities).length) return css;

  // Validate names with the shared export serializer before touching the sheet.
  presetUtilitiesCss(utilities);
  const sheet = postcss.parse(css);
  const remaining = new Map(Object.entries(utilities));
  let targetLayer: postcss.AtRule | undefined;

  sheet.walkAtRules("layer", (layer) => {
    if (layer.params !== "utilities") return;
    targetLayer ??= layer;

    // Only direct, single-class rules belong to this contract. Nested states and
    // unrelated selectors must not be mistaken for a shared utility definition.
    for (const node of [...(layer.nodes ?? [])]) {
      if (node.type !== "rule" || !node.selector.startsWith(".")) continue;
      const name = node.selector.slice(1);
      if (!Object.prototype.hasOwnProperty.call(utilities, name)) continue;
      const classes = presetUtilityClasses(utilities[name]!);
      remaining.delete(name);

      const applications = node.nodes.filter(
        (child) => child.type === "atrule" && child.name === "apply"
      );
      const application = applications.shift();
      for (const duplicate of applications) duplicate.remove();
      if (classes) {
        if (application?.type === "atrule") application.params = classes;
        else node.append(postcss.atRule({ name: "apply", params: classes }));
      } else {
        application?.remove();
        if (!node.nodes.length) node.remove();
      }
    }
  });

  const additions = postcss.parse(
    presetUtilitiesCss(Object.fromEntries(remaining))
  ).first;
  if (additions?.type === "atrule") {
    if (targetLayer) {
      targetLayer.append(additions.nodes ?? []);
    } else {
      sheet.append(additions);
    }
  }

  return sheet.toString();
}

export async function updateCssPreset(
  cssPath: string,
  preset: {
    base?: PresetBaseConfig;
    colors?: PresetColorConfig[];
  }
): Promise<void> {
  let css = await fs.readFile(cssPath, "utf8");

  if (preset.colors?.length) {
    const tokens = preset.colors.flatMap((section) => section.tokens);

    css = updateBlock(css, ":root", tokens, "light");
    css = updateBlock(css, ".dark", tokens, "dark");
  }

  if (preset.base?.layout?.radius !== undefined) {
    css = replaceVariable(css, "--radius", `${preset.base.layout.radius}rem`);
  }

  if (preset.base?.layout?.spacing !== undefined) {
    css = replaceVariable(css, "--spacing", `${preset.base.layout.spacing}rem`);
  }

  if (preset.base?.typography?.letterSpacing !== undefined) {
    css = replaceVariable(
      css,
      "--tracking-normal",
      `${preset.base.typography.letterSpacing}em`
    );
  }

  // The shadow box, six primitives at a time - the way `--radius` above is written,
  // with the unit the sheet declares it with. Only the box is written: the app's own
  // `@theme inline` draws every `shadow-*` step from it. A preset that carries no box
  // leaves the sheet's own alone.
  const shadows = preset.base?.shadows;

  if (shadows) {
    css = replaceVariable(css, "--shadow-x", `${shadows.offsetX}px`);
    css = replaceVariable(css, "--shadow-y", `${shadows.offsetY}px`);
    css = replaceVariable(css, "--shadow-blur", `${shadows.blur}px`);
    css = replaceVariable(css, "--shadow-spread", `${shadows.spread}px`);
    css = replaceVariable(css, "--shadow-opacity", `${shadows.opacity}`);
    css = replaceVariable(css, "--shadow-color", shadows.color);
  }

  if (preset.base?.animations !== undefined) {
    // Replace only the section owned by the preset, leaving app animations alone.
    const start = "/* rlz preset animations */";
    const end = "/* end rlz preset animations */";
    const section = new RegExp(
      `${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}\\r?\\n?`,
      "g"
    );
    const animations = presetAnimationsCss(preset.base.animations);
    const block = animations ? `${start}\n${animations}\n${end}\n` : "";

    css = section.test(css)
      ? css.replace(section, () => block)
      : block
      ? `${css.trimEnd()}\n\n${block}`
      : css;
  }

  if (preset.base?.utilities !== undefined) {
    css = updateUtilities(css, preset.base.utilities);
  }

  await fs.writeFile(cssPath, css, "utf8");
}
