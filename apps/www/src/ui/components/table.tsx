import { ComponentProps } from "react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Table ------------------------------ */

const Table = ({ className, containerClassName, ...props }: ComponentProps<"table"> & { containerClassName?: string }) => {
  return (
    <div data-slot="table-wrapper" className={cn("relative w-full overflow-x-auto", containerClassName)}>
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
};

/* ------------------------------ Table Header ------------------------------ */

const TableHeader = ({ className, ...props }: ComponentProps<"thead">) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
};

/* ------------------------------ Table Body ------------------------------ */

const TableBody = ({ className, ...props }: ComponentProps<"tbody">) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
};

/* ------------------------------ Table Footer ------------------------------ */

const TableFooter = ({ className, ...props }: ComponentProps<"tfoot">) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Table Row ------------------------------ */

const TableRow = ({ className, ...props }: ComponentProps<"tr">) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Table Head ------------------------------ */

const TableHead = ({ className, ...props }: ComponentProps<"th">) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-3 text-left align-middle font-semibold text-foreground [&:has([data-slot=table-sort-icon])]:pr-8 [&:has([role=checkbox])]:w-px [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Table Cell ------------------------------ */

const TableCell = ({ className, ...props }: ComponentProps<"td">) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle px-3 py-3 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Table Caption ------------------------------ */

const TableCaption = ({ className, ...props }: ComponentProps<"caption">) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const TableComposed = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});

export {
  TableComposed as Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
