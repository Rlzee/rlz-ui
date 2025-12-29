export type WithClassNameOmit<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  "className"
> & {
  className?: string | ((state: any) => string | undefined);
};
