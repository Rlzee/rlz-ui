import { demoPaths } from "@rlz/ui/components/examples";

/** Documentation owns the scenarios; the preset engine only applies styling. */
export function playgroundExamples(slug: string) {
  const prefix = `${slug}/`;
  return Object.entries(demoPaths)
    .filter(([, path]) => path === slug || path.startsWith(prefix))
    .sort((a, b) => {
      const defaultPath = `${slug}/default`;
      return (
        Number(b[1] === defaultPath) - Number(a[1] === defaultPath) ||
        a[1].localeCompare(b[1])
      );
    })
    .map(([key, path]) => {
      const segment = path.split("/").pop() ?? path;
      const label = segment.replaceAll("-", " ");
      return {
        key,
        path,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      };
    });
}

export function playgroundScenarios(slug: string) {
  const states = new Set(["default", "disabled", "loading"]);
  const examples = playgroundExamples(slug);
  const scenarios = examples.filter(({ path }) =>
    states.has(path.split("/").pop() ?? "")
  );
  return scenarios.length ? scenarios : examples.slice(0, 1);
}
