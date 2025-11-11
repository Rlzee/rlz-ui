import { Table } from "@ui/components/table";

const code = `import { Table } from "@ui/components/table";

export default function Example() {
  return (
    <Table>
      <Table.Caption>A list of all components in the project</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>File Name</Table.Head>
          <Table.Head>Type</Table.Head>
          <Table.Head>Size</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>button.tsx</Table.Cell>
          <Table.Cell>Component</Table.Cell>
          <Table.Cell>1.2 KB</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>input.tsx</Table.Cell>
          <Table.Cell>Component</Table.Cell>
          <Table.Cell>800 B</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>tree.tsx</Table.Cell>
          <Table.Cell>Component</Table.Cell>
          <Table.Cell>1.5 KB</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell>3 Components</Table.Cell>
          <Table.Cell>3.5 KB</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Table>
        <Table.Caption>A list of all components in the project</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>File Name</Table.Head>
            <Table.Head>Type</Table.Head>
            <Table.Head>Size</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>button.tsx</Table.Cell>
            <Table.Cell>Component</Table.Cell>
            <Table.Cell>1.2 KB</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>input.tsx</Table.Cell>
            <Table.Cell>Component</Table.Cell>
            <Table.Cell>800 B</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>tree.tsx</Table.Cell>
            <Table.Cell>Component</Table.Cell>
            <Table.Cell>1.5 KB</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>3 Components</Table.Cell>
            <Table.Cell>3.5 KB</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
};

export const TableDemo = {
  code,
  component: <Component />,
};
