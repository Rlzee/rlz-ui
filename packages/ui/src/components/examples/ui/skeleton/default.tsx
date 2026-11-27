import { Skeleton } from "@rlz/ui/components/ui/skeleton";

export default function Example() {
  return (
    <div className="flex w-64 items-center gap-4" aria-label="Loading profile">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
