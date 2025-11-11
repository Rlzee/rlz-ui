import { InputOtp } from "@/src/ui/components/input-otp";

const code = `import { InputOtp } from "@ui/components/input-otp";

export function Example() {
  return (
    <InputOtp>
      <InputOtp.Group>
        <InputOtp.Slot />
        <InputOtp.Slot />
        <InputOtp.Slot />
        <InputOtp.Slot />
      </InputOtp.Group>
      <InputOtp.Separator />
      <InputOtp.Group>
        <InputOtp.Slot />
        <InputOtp.Slot />
        <InputOtp.Slot />
        <InputOtp.Slot />
      </InputOtp.Group>
    </InputOtp>
  );
}`;

const Component = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <InputOtp>
        <InputOtp.Group>
          <InputOtp.Slot />
          <InputOtp.Slot />
          <InputOtp.Slot />
          <InputOtp.Slot />
        </InputOtp.Group>
        <InputOtp.Separator />
        <InputOtp.Group>
          <InputOtp.Slot />
          <InputOtp.Slot />
          <InputOtp.Slot />
          <InputOtp.Slot />
        </InputOtp.Group>
      </InputOtp>
    </div>
  );
};

export const InputOtpDemo = {
  code,
  component: <Component />,
};
