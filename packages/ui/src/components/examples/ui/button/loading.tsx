"use client";

import { useState } from "react";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Button loading={isLoading} onClick={handleClick}>
      Submit
    </Button>
  );
}
