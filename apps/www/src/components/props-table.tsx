import { Table } from "@ui/components/table";

export interface PropRow {
  prop: string;
  type: string;
  default: string;
  description?: string;
}

interface PropsTableProps {
  title?: string;
  props: PropRow[];
  className?: string;
}

const PropsTable = ({ title, props, className }: PropsTableProps) => {
  return (
    <div className={className}>
      {title && (
        <h4 className="mt-6 text-lg text-foreground font-medium">{title}</h4>
      )}
      <Table containerClassName="border-border border mt-2 rounded-lg bg-background-secondary">
        <Table.Header>
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
