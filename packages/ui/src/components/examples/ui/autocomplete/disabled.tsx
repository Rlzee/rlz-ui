import { Autocomplete } from "@rlz/ui/components/ui/autocomplete";

const fruits = [
  "Apple",
  "Banana",
  "Orange",
  "Pineapple",
  "Grape",
  "Mango",
  "Strawberry",
  "Blueberry",
  "Raspberry",
  "Blackberry",
];

export default function Example() {
  return (
    <Autocomplete items={fruits} disabled>
      <Autocomplete.Input
        className="w-60 mx-auto"
        aria-label="Search fruit"
        placeholder="Search fruit"
      />
      <Autocomplete.Popup>
        <Autocomplete.Empty>No fruits found.</Autocomplete.Empty>
        <Autocomplete.List>
          {(item: string) => (
            <Autocomplete.Item key={item} value={item}>
              {item}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete>
  );
}
