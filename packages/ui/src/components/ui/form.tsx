import { Form as FormPrimitive } from "@base-ui/react/form";

export function Form(props: FormPrimitive.Props) {
  return <FormPrimitive data-slot="form" {...props} />;
}
