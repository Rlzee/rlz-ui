import { Accordion } from "@rlz/ui/components/ui/accordion";

const items = [
  {
    id: 1,
    title: "Accordion Item 1",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, minima. Mollitia expedita, doloribus dolores quae officia esse asperiores odio quibusdam hic placeat ducimus iste. Obcaecati ipsum omnis minima adipisci tempora?",
    disabled: false,
  },
  {
    id: 2,
    title: "Accordion Item 2",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, minima. Mollitia expedita, doloribus dolores quae officia esse asperiores odio quibusdam hic placeat ducimus iste. Obcaecati ipsum omnis minima adipisci tempora?",
    disabled: true,
  },
];

export default function Example() {
  return (
    <Accordion className="w-full max-w-md">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={String(item.id)}
          disabled={item.disabled}
        >
          <Accordion.Trigger>
            {item.title}
            <Accordion.Icon />
          </Accordion.Trigger>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
