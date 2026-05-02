import Link from "next/link";
import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default function Example() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link render={<Link href="/" />}>Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>
          <ChevronRight />
        </Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link render={<Link href="/components" />}>
            Components
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>
          <ChevronRight />
        </Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link
            render={<Link href="/components/breadcrumb" />}
            isActive
          >
            Breadcrumb
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
