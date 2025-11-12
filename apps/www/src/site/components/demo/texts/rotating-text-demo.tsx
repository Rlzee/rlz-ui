import { RotatingText } from "@ui/components/texts/rotating-text";

const code = `import { RotatingText } from "@ui/components/texts/rotating-text";

export default function Example() {
  return (
    <RotatingText
      texts={["rlz", "best", "ui"]}
      mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
      staggerFrom={"last"}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-120%" }}
      staggerDuration={0.025}
      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      rotationInterval={2000}
    />
  );
}`;

const Component = () => {
  return (
    <div className="text-center w-[100px] mx-auto">
      <RotatingText
        texts={["rlz", "best", "ui"]}
        mainClassName="px-2 sm:px-2 md:px-3 bg-foreground dark:text-black text-white text-xl font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
        staggerFrom={"last"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />
    </div>
  );
};

export const RotatingTextDemo = {
  code,
  component: <Component />,
};
