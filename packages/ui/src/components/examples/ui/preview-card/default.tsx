import { PreviewCard } from "@rlz/ui/components/ui/preview-card";

export default function Example() {
  return (
    <PreviewCard>
      <p className="text-base text-foreground">
        The principles of good{" "}
        <PreviewCard.Trigger
          className="underline font-medium"
          href="https://en.wikipedia.org/wiki/Typography"
        >
          typography
        </PreviewCard.Trigger>{" "}
        remain in the digital age.
      </p>

      <PreviewCard.Popup>
        <PreviewCard.Arrow />
        <img
          width="224"
          height="150"
          className="block max-w-none rounded-lg"
          src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=300"
          alt="Station Hofplein signage in Rotterdam, Netherlands"
        />
        <p className="m-0 text-sm text-pretty text-foreground">
          <strong>Typography</strong> is the art and science of arranging type
          to make written language clear, visually appealing, and effective in
          communication.
        </p>
      </PreviewCard.Popup>
    </PreviewCard>
  );
}
