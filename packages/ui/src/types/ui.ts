export type WithClassNameOmit<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  "className"
> & {
  className?: string | ((state: any) => string | undefined);
};

export type WithConditionalProps<Flag extends string, PropsType> =
  | ({
      [K in Flag]?: false;
    } & {
      [K in keyof PropsType]?: never;
    })
  | ({
      [K in Flag]: true;
    } & PropsType);
