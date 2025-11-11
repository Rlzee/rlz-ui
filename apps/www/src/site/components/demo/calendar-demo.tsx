import { Calendar } from "@ui/components/calendar";

const code = `import { Calendar } from '@ui/components/calendar';

export default function Example() {
  return (
    <Calendar
      mode="single"
      className="p-2 border border-border rounded-md bg-background-secondary"
      classNames={{
        months: "text-center",
      }}
    />
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Calendar
        mode="single"
        className="p-2 border border-border rounded-md bg-background-secondary"
        classNames={{
          months: "text-center",
        }}
      />
    </div>
  );
};

export const CalendarDemo = {
  code,
  component: <Component />,
};
