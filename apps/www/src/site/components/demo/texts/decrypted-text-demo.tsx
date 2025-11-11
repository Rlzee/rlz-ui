import { DecryptedText } from "@/src/ui/components/texts/decrypted-text";

const code = `import { DecryptedText } from "@ui/components/texts/decrypted-text";

export default function Example() {
  return (
    <DecryptedText
      text="This text animates when in view"
      animateOn="view"
      revealDirection="center"
    />
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center h-48 rounded-md p-4">
      <DecryptedText
        text="This text animates when in view"
        animateOn="view"
        revealDirection="center"
      />
    </div>
  );
};

export const DecryptedTextDemo = {
  code,
  component: <Component />,
};
