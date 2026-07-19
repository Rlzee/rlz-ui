import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { Empty } from "@rlz/ui/components/ui/empty";
import { CodeBox } from "./code-box";
import { Globe, RefreshCw, SquareArrowOutUpRight } from "lucide-react";

export function CustomPreview() {
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-0.5 border-b">
        <InputGroup
          className="data-[variant=primary]:bg-transparent border-none"
          focusVisible={false}
        >
          <InputGroup.Addon align="inline-start">
            <Globe />
          </InputGroup.Addon>
          <Input
            unstyled
            placeholder="Enter website URL (e.g. http://localhost:3000/login)"
          />
          <InputGroup.Addon align="inline-end" className="gap-0.5">
            <Button size="icon-xs" variant="ghost">
              <RefreshCw />
            </Button>
            <Button size="icon-xs" variant="ghost">
              <SquareArrowOutUpRight />
            </Button>
          </InputGroup.Addon>
        </InputGroup>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <Empty>
          <Empty.Header className="max-w-md">
            <Empty.Media variant="secondary">
              <Globe />
            </Empty.Media>
            <Empty.Title>Preview your Website in Rlz-ui</Empty.Title>
            <Empty.Description className="text-left">
              <span className="font-medium text-muted">1. </span>Add the script
              below to your website based on your framework
            </Empty.Description>
            <Empty.Description>
              <span className="font-medium text-muted">2. </span>
              Paste your website&apos;s URL (e.g.,{" "}
              <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-accent border">
                http://localhost:3000
              </code>{" "}
              ) above to preview it with the theme applied in real-time
            </Empty.Description>
          </Empty.Header>
          <Empty.Actions>
            <CodeBox />
          </Empty.Actions>
        </Empty>
      </div>
    </>
  );
}
