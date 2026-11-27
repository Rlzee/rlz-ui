import type { SourcePreviewBundle, SourcePreviewSelection } from "./types";

type Implementation = (...args: any[]) => any;
type Wrapper = Implementation & { displayName?: string };
type ModuleExports = Record<string, any>;
const unavailableExample: Implementation = () => null;

/** Scoped to one canvas. No global React patching or DOM class mutation. */
export class SourcePreviewRuntime {
  private wrappers = new Map<string, Wrapper>();
  private implementations = new Map<string, Implementation>();
  private evaluating: Map<string, Implementation> | undefined;
  private contexts = new Map<string, unknown>();
  private resources = new Map<string, unknown>();
  private values = new Map<string, { signature: string; value: unknown }>();
  private contextDefaults: Record<string, string> = {};
  private resourceOptions: Record<string, string> = {};
  private selection: SourcePreviewSelection = {};
  private selectionContext: { Provider: unknown } | undefined;

  setSelection(selection: SourcePreviewSelection) {
    this.selection = selection;
  }

  load(bundle: SourcePreviewBundle, externals: Record<string, unknown>) {
    for (const [key, value] of Object.entries(bundle.contexts)) {
      if (
        Object.hasOwn(this.contextDefaults, key) &&
        this.contextDefaults[key] !== value
      )
        throw new Error(
          "A context default changed. Reset the source preview to apply this structural change."
        );
    }
    for (const [key, value] of Object.entries(bundle.resources ?? {}))
      if (
        Object.hasOwn(this.resourceOptions, key) &&
        this.resourceOptions[key] !== value
      )
        throw new Error(
          "A resource configuration changed. Reset the source preview to apply this structural change."
        );
    const staged = new Map(this.implementations);
    const wrappers = new Map(this.wrappers);
    const contexts = new Map(this.contexts);
    const resources = new Map(this.resources);
    const values = new Map(this.values);
    const targets = [...wrappers.values(), ...resources.values()].filter(
      (value): value is object =>
        typeof value === "function" ||
        (typeof value === "object" && value !== null)
    );
    const snapshots = new Map(
      targets.map((wrapper) => [
        wrapper,
        Object.getOwnPropertyDescriptors(wrapper),
      ])
    );
    const modules = new Map<string, ModuleExports>();
    const react = externals.react as
      | {
          createContext: (value: unknown) => { Provider: unknown };
          createElement: Implementation;
          useContext: (context: unknown) => SourcePreviewSelection | null;
        }
      | undefined;
    const selectionContext = bundle.selection
      ? this.selectionContext ?? react?.createContext(null)
      : undefined;
    const previousEvaluation = this.evaluating;
    this.evaluating = staged;
    const component = (
      key: string,
      implementation: Implementation
    ): Wrapper => {
      staged.set(key, implementation);
      if (!wrappers.has(key)) {
        const owner = this;
        const wrapper: Wrapper = function (this: unknown, ...args: unknown[]) {
          const current = (owner.evaluating ?? owner.implementations).get(key);
          if (!current)
            throw new Error(`Missing preview implementation: ${key}`);
          return current.apply(this, args);
        };
        wrapper.displayName = key.split(":").pop();
        wrappers.set(key, wrapper);
      }
      return wrappers.get(key)!;
    };
    const resource = (key: string, factory: () => unknown) => {
      if (!resources.has(key)) resources.set(key, factory());
      return resources.get(key);
    };
    const runtime = {
      props: (keys?: string[]) =>
        keys
          ? Object.fromEntries(
              keys
                .filter((key) => Object.hasOwn(this.selection, key))
                .map((key) => [key, this.selection[key]])
            )
          : this.selection,
      context: (key: string, factory: () => unknown) => {
        if (!contexts.has(key)) contexts.set(key, factory());
        return contexts.get(key);
      },
      selectedProps: (
        input: Record<string, unknown> | undefined,
        axes: string[],
        properties: string[]
      ) => {
        if (!selectionContext || !react)
          throw new Error("The preview selection scope is unavailable");
        const selection = react.useContext(selectionContext);
        const original = input ?? {};
        if (!selection) return original;
        const next = { ...original };
        for (const key of properties)
          if (original[key] === undefined && Object.hasOwn(selection, key))
            next[key] = selection[key];
        for (const key of axes)
          if (
            Object.hasOwn(selection, key) &&
            (original[key] === undefined ||
              bundle.selection?.axes[key]?.includes(String(original[key])))
          )
            next[key] = selection[key];
        return next;
      },
      component,
      resource,
      value: (key: string, signature: string, factory: () => unknown) => {
        const previous = values.get(key);
        if (previous?.signature === signature) return previous.value;
        const value = factory();
        values.set(key, { signature, value });
        return value;
      },
      forwardRef: (
        key: string,
        factory: Implementation,
        render: Implementation
      ) => {
        const stableRender = component(`${key}:render`, render);
        return resource(`${key}:forwardRef`, () => factory(stableRender));
      },
      memo: (key: string, type: unknown) => {
        const react = externals.react as
          | { createElement?: Implementation }
          | undefined;
        if (!react?.createElement)
          throw new Error("React is unavailable to the source preview");
        return component(`${key}:memo`, (props: unknown) =>
          react.createElement!(type, props)
        );
      },
    };
    const evaluate = (id: string): ModuleExports => {
      if (modules.has(id)) return modules.get(id)!;
      const module = bundle.modules[id];
      if (!module) throw new Error(`Missing preview module: ${id}`);
      const exports: ModuleExports = {};
      modules.set(id, exports);
      const require = (specifier: string) => {
        const target = module.imports[specifier];
        if (!target) throw new Error(`Unknown preview import: ${specifier}`);
        if (!target.startsWith("external:")) return evaluate(target);
        const name = target.slice("external:".length);
        if (!Object.hasOwn(externals, name))
          throw new Error(`Unavailable preview dependency: ${name}`);
        return externals[name];
      };
      // Only server-compiled, repository-owned modules enter this
      // loader. Presets remain data; the endpoint never accepts executable code.
      new Function("require", "exports", "__rlzPreview", module.code)(
        require,
        exports,
        runtime
      );
      return exports;
    };
    try {
      const renderable = (value: any) =>
        typeof value === "function" ||
        (value &&
          [
            Symbol.for("react.forward_ref"),
            Symbol.for("react.memo"),
            Symbol.for("react.lazy"),
          ].includes(value.$$typeof));
      const scope = (id: string, type: unknown) => {
        if (!bundle.selection) return type as Implementation;
        if (!selectionContext || !react)
          throw new Error("React is unavailable to the source preview");
        return component(`${id}:$scope`, (props: unknown) =>
          react.createElement(
            selectionContext.Provider,
            { value: this.selection },
            react.createElement(type, props)
          )
        );
      };
      const rawPreview = bundle.previewWarning
        ? unavailableExample
        : (evaluate(bundle.preview).default as Implementation);
      const example = bundle.exampleWarning
        ? unavailableExample
        : (evaluate(bundle.example).default as Implementation);
      if (!renderable(rawPreview) || !renderable(example))
        throw new Error("Source preview entry is not a component");
      const preview = scope(bundle.preview, rawPreview);
      const entries = (
        list: SourcePreviewBundle["examples"],
        selected = false
      ) =>
        (list ?? []).map(({ entry, ...metadata }) => {
          let Component = entry
            ? (evaluate(entry).default as Implementation)
            : undefined;
          if (entry && !renderable(Component))
            throw new Error("Source preview example is not a component");
          if (entry && selected) Component = scope(entry, Component);
          return { ...metadata, Component };
        });
      const scenarios = entries(bundle.scenarios, true);
      const examples = entries(bundle.examples);
      this.wrappers = wrappers;
      this.implementations = staged;
      this.contexts = contexts;
      this.resources = resources;
      this.values = values;
      this.contextDefaults = { ...this.contextDefaults, ...bundle.contexts };
      this.resourceOptions = { ...this.resourceOptions, ...bundle.resources };
      this.selectionContext = selectionContext ?? this.selectionContext;
      return { preview, example, scenarios, examples };
    } catch (error) {
      // Object.assign exports attach public parts to the stable root function.
      // Roll those properties back too if evaluation fails before commit.
      for (const [wrapper, descriptors] of snapshots) {
        for (const key of Reflect.ownKeys(wrapper)) {
          if (
            !Object.hasOwn(descriptors, key) &&
            Object.getOwnPropertyDescriptor(wrapper, key)?.configurable
          )
            Reflect.deleteProperty(wrapper, key);
        }
        Object.defineProperties(wrapper, descriptors);
      }
      throw error;
    } finally {
      this.evaluating = previousEvaluation;
    }
  }
}
