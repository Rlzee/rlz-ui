"use client";

import {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  useState,
  useCallback,
  ComponentProps,
} from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

/* --------------------------- Context Carousel --------------------------- */

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  currentSlide: number;
  totalSlides: number;
  scrollTo: (index: number) => void;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

const useCarousel = () => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
};

/* ------------------------------ Carousel Provider ------------------------------ */

const CarouselProvider = ({
  children,
  opts,
  plugins,
  orientation = "horizontal",
  setApi,
}: CarouselProps & { children: ReactNode }) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setCurrentSlide(api.selectedScrollSnap());
    setTotalSlides(api.scrollSnapList().length);
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        currentSlide,
        totalSlides,
        scrollTo,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};

/* --------------------------- Carousel Inner --------------------------- */

const CarouselInner = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { scrollPrev, scrollNext } = useCarousel();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      data-slot="carousel"
      className={cn("relative focus:outline-none", className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

/* --------------------------- Root Carousel --------------------------- */

const Carousel = ({
  children,
  className,
  ...props
}: CarouselProps & { children: ReactNode; className?: string }) => {
  return (
    <CarouselProvider {...props}>
      <CarouselInner className={className}>{children}</CarouselInner>
    </CarouselProvider>
  );
};

/* --------------------------- Carousel Content --------------------------- */

const CarouselContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
};

/* --------------------------- Carousel Slide --------------------------- */

const CarouselSlide = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
};

/* --------------------------- Carousel Previous --------------------------- */

const CarouselPrevious = ({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ComponentProps<typeof Button>) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={className}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};

/* --------------------------- Carousel Next --------------------------- */

const CarouselNext = ({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ComponentProps<typeof Button>) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={className}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};

/* --------------------------- Carousel Indicators --------------------------- */

const CarouselIndicators = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { currentSlide, totalSlides, scrollTo } = useCarousel();

  return (
    <div
      data-slot="carousel-indicators"
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      {Array.from({ length: totalSlides }, (_, index) => (
        <button
          key={index}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-200",
            index === currentSlide
              ? "bg-primary scale-110"
              : "bg-secondary hover:bg-secondary/80 border border-border"
          )}
          onClick={() => scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

/* --------------------------- Carousel Counter --------------------------- */

const CarouselCounter = ({
  className,
  separator = "/",
  ...props
}: React.ComponentProps<"div"> & { separator?: string }) => {
  const { currentSlide, totalSlides } = useCarousel();

  return (
    <div
      data-slot="carousel-counter"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {currentSlide + 1} {separator} {totalSlides}
    </div>
  );
};

/* --------------------------- Exports --------------------------- */

const CarouselComposed = Object.assign(Carousel, {
  Inner: CarouselInner,
  Content: CarouselContent,
  Slide: CarouselSlide,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Provider: CarouselProvider,
  Indicators: CarouselIndicators,
  Counter: CarouselCounter,
});

export {
  CarouselComposed as Carousel,
  CarouselInner,
  CarouselContent,
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselProvider,
  CarouselIndicators,
  CarouselCounter,
  useCarousel,
};
