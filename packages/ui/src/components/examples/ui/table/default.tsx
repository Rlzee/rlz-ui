import { Table } from "@rlz/ui/components/ui/table";

export default function Example() {
  return (
    <Table>
      <Table.Caption>Recent invoices</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>INV-001</Table.Cell>
          <Table.Cell>Paid</Table.Cell>
          <Table.Cell>$120.00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>INV-002</Table.Cell>
          <Table.Cell>Pending</Table.Cell>
          <Table.Cell>$85.00</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={2}>Total</Table.Cell>
          <Table.Cell>$205.00</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
