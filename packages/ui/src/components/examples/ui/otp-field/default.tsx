import { OTPField } from "@rlz/ui/components/ui/otp-field";

export default function Example() {
  return (
    <OTPField length={6} aria-label="Verification code">
      <OTPField.Input aria-label="Digit 1" />
      <OTPField.Input aria-label="Digit 2" />
      <OTPField.Input aria-label="Digit 3" />
      <OTPField.Separator />
      <OTPField.Input aria-label="Digit 4" />
      <OTPField.Input aria-label="Digit 5" />
      <OTPField.Input aria-label="Digit 6" />
    </OTPField>
  );
}
