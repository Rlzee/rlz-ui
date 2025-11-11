import { Carousel } from "@ui/components/carousel";
import { Card } from "@ui/components/card";
import Autoplay from "embla-carousel-autoplay";

const code = `import { Carousel } from '@ui/components/carousel';
import { Card } from '@ui/components/card';
import Autoplay from 'embla-carousel-autoplay';

export default function Example() {
  return (
    <div className="flex items-center justify-center">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        plugins={[
          Autoplay({
            stopOnInteraction: false,
            delay: 2000,
          }),
        ]}
        className="w-full max-w-md mx-auto"
      >
        <Carousel.Content>
          {Array.from({ length: 5 }).map((_, index) => (
            <Carousel.Slide key={index}>
              <div className="p-1">
                <Card>
                  <Card.Body className="flex items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </Card.Body>
                </Card>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel.Content>
        <div className="flex justify-between items-center mt-2 gap-2">
          <Carousel.Indicators />
          <div className="flex items-center mt-2 gap-2">
            <Carousel.Previous />
            <Carousel.Next />
          </div>
        </div>
      </Carousel>
    </div>
  );
};`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        plugins={[
          Autoplay({
            stopOnInteraction: false,
            delay: 2000,
          }),
        ]}
        className="w-full max-w-md mx-auto"
      >
        <Carousel.Content>
          {Array.from({ length: 5 }).map((_, index) => (
            <Carousel.Slide key={index}>
              <div className="p-1">
                <Card>
                  <Card.Body className="flex items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </Card.Body>
                </Card>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel.Content>
        <div className="flex justify-between items-center mt-2 gap-2">
          <Carousel.Indicators />
          <div className="flex items-center mt-2 gap-2">
            <Carousel.Previous />
            <Carousel.Next />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export const CarouselDemo = {
  code,
  component: <Component />,
};
