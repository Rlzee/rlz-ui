"use client";

import * as React from "react";
import { Table as TableComponent } from "../../ui/components/table";
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  Column,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  EyeOff,
  Ellipsis,
} from "lucide-react";
import { Combobox } from "@/src/ui/components/combobox";
import { Button } from "@/src/ui/components/button";
import { Table } from "@tanstack/react-table";
import { DropdownMenu } from "@/src/ui/components/dropdown-menu";
import { cn } from "@/src/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

/* ------------------------------ Data Table ------------------------------ */

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  className?: string;
  pagination?: Omit<
    React.ComponentProps<typeof DataTablePagination<TData>>,
    "table"
  >;
}

function DataTable<TData extends RowData>({
  columns,
  data,
  className,
  pagination,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div
        className={cn("rounded-md border bg-background-secondary", className)}
      >
        <TableComponent data-slot="data-table">
          <TableComponent.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableComponent.Row key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableComponent.Head
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.column.columnDef.meta?.className ?? ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableComponent.Head>
                ))}
              </TableComponent.Row>
            ))}
          </TableComponent.Header>
          <TableComponent.Body>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableComponent.Row
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableComponent.Cell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableComponent.Cell>
                  ))}
                </TableComponent.Row>
              ))
            ) : (
              <TableComponent.Row>
                <TableComponent.Cell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available.
                </TableComponent.Cell>
              </TableComponent.Row>
            )}
          </TableComponent.Body>
        </TableComponent>
      </div>
      <DataTablePagination table={table} {...pagination} />
    </div>
  );
}

/* ------------------------------ Data Table Pagination ------------------------------ */

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  rowSelection?: boolean;
  rowPerPage?: boolean;
  pagination?: boolean;
}

function DataTablePagination<TData>({
  table,
  rowSelection = true,
  rowPerPage = true,
  pagination = true,
}: DataTablePaginationProps<TData>) {
  return (
    <div
      data-slot="data-table-pagination"
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex-1">
        {rowSelection && (
          <div className="hidden text-sm text-muted-foreground sm:block">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} rows selected
          </div>
        )}
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        {rowPerPage && (
          <div className="flex items-center space-x-2">
            <p className="hidden text-sm font-medium sm:block">Rows per page</p>
            <Combobox>
              <Combobox.Trigger>
                <Combobox.TriggerButton
                  className="h-8 w-[70px]"
                  placeholder={`${table.getState().pagination.pageSize}`}
                />
              </Combobox.Trigger>
              <Combobox.Content side="top" className="w-[70px]">
                <Combobox.List>
                  <Combobox.Group>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <Combobox.Item
                        key={pageSize}
                        value={`${pageSize}`}
                        onSelect={() => {
                          table.setPageSize(Number(pageSize));
                        }}
                      >
                        {pageSize}
                      </Combobox.Item>
                    ))}
                  </Combobox.Group>
                </Combobox.List>
              </Combobox.Content>
            </Combobox>
          </div>
        )}
        {pagination && (
          <>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Data Table Column Header ------------------------------ */

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      data-slot="data-table-column-header"
      className={cn("flex items-center space-x-2", className)}
    >
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-muted"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          <DropdownMenu.Item onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            Asc
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            Desc
          </DropdownMenu.Item>
          {column.getCanHide() && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Hide
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

/* ------------------------------ Data Table Row Actions ------------------------------ */

interface RowAction<TData> {
  label: string;
  icon?: React.ReactNode;
  onClick: (data: TData) => void;
  className?: string;
  shortcut?: React.ReactNode | string;
  separator?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: RowAction<TData>[];
}

function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu modal={false} data-slot="data-table-row-actions">
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <div key={index}>
            {action.separator && <DropdownMenu.Separator />}
            <DropdownMenu.Item
              onClick={() => action.onClick(row.original)}
              className={action.className}
            >
              {action.label}
              {action.shortcut && (
                <DropdownMenu.Shortcut
                  shortcutKey={
                    typeof action.shortcut === "string"
                      ? action.shortcut
                      : undefined
                  }
                >
                  {typeof action.shortcut === "string" ? null : action.shortcut}
                </DropdownMenu.Shortcut>
              )}
            </DropdownMenu.Item>
          </div>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/* ------------------------------ Exports ------------------------------ */

export {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  DataTablePagination,
};
