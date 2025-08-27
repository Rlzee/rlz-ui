# Accordion Props

## Accordion Root

The root component that contains all parts of an accordion.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | - | Determines whether one or multiple items can be opened at the same time |
| `collapsible` | `boolean` | `false` | When type is "single", allows closing content when clicking trigger for an open item |
| `value` | `string \| string[]` | - | The controlled value of the item(s) to expand |
| `defaultValue` | `string \| string[]` | - | The value of the item(s) to expand when initially rendered |
| `onValueChange` | `(value: string \| string[]) => void` | - | Event handler called when the expanded state of an item changes |
| `disabled` | `boolean` | `false` | When true, prevents the user from interacting with the accordion |
| `className` | `string` | - | Additional CSS classes to apply to the root element |

## Accordion Item

Contains all parts of a collapsible section.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | A unique value for the item |
| `disabled` | `boolean` | `false` | When true, prevents the user from interacting with the item |
| `className` | `string` | - | Additional CSS classes to apply to the item element |

## Accordion Header

Wraps an `AccordionTrigger`. Use the `asChild` prop to update it to the appropriate heading level for your page.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `"flex"` | Additional CSS classes to apply to the header element |

## Accordion Trigger

Toggles the collapsed state of its associated item. It should be nested inside of an `AccordionHeader`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The content to render inside the trigger |
| `className` | `string` | Predefined styles | Additional CSS classes to apply to the trigger element |
| `disabled` | `boolean` | `false` | When true, prevents the user from interacting with the trigger |

## Accordion Icon

The icon component that rotates based on the accordion state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `Icon` | `LucideIcon` | `ChevronDownIcon` | The Lucide icon component to render |
| `className` | `string` | Predefined styles | Additional CSS classes to apply to the icon element |

## Accordion Content

Contains the collapsible content for an item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The content to render inside the collapsible area |
| `className` | `string` | `"pt-0 pb-4"` | Additional CSS classes to apply to the content element |