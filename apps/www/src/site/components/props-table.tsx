import { Table } from "@ui/components/table";
import { type PropRow } from "@site/types/props";
import { cn } from "@ui/lib/utils";

interface PropsTableProps {
  title?: string;
  props: PropRow[];
  className?: string;
}

const PropsTable = ({ title, props, className }: PropsTableProps) => {
  return (
    <div className={cn("py-3.5", className)}>
      {title && (
        <h4 className="text-md text-foreground font-normal capitalize">{title}</h4>
      )}
      <Table containerClassName="mt-2 rounded-lg border-border border">
        <Table.Header className="bg-background-secondary">
          <Table.Row>
            <Table.Cell className="w-[200px] font-medium">Prop</Table.Cell>
            <Table.Cell className="w-[300px] font-medium">Type</Table.Cell>
            <Table.Cell className="w-[150px] font-medium">Default</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.map((propRow, index) => (
            <Table.Row key={index}>
              <Table.Cell className="w-[200px] font-mono text-sm">
                {propRow.prop}
              </Table.Cell>
              <Table.Cell className="w-[300px] font-mono text-sm text-muted-foreground">
                {propRow.type}
              </Table.Cell>
              <Table.Cell className="w-[150px] font-mono text-sm">
                {propRow.default}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export { PropsTable };
