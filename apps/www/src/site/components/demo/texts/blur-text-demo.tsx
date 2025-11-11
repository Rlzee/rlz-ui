import { BlurText } from "@ui/components/texts/blur-text";

const code = `import { BlurText } from "@ui/components/texts/blur-text";

export default function Example() {
  return (
    <BlurText
      text="Ceci est un exemple d'animation par mots avec effet de flou"
      className="text-3xl font-bold text-blue-400"
    />
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center h-48 rounded-md p-4">
      <BlurText
        text="Ceci est un exemple d'animation par mots avec effet de flou"
        className="text-3xl font-bold text-blue-400"
      />
    </div>
  );
};

export const BlurTextDemo = {
  code,
  component: <Component />,
};
