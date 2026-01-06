import * as React from "react";
import { Form as FormPrimitive } from "@base-ui/react/form";

export function Form(props: React.ComponentProps<typeof FormPrimitive>) {
  return <FormPrimitive data-slot="form" {...props} />;
}
