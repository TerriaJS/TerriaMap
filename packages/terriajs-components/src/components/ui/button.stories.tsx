import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./button";

/**
 * Button component from ShadCN UI
 *
 * Displays a clickable button with multiple variants and sizes.
 * All buttons use the `shadcn-` prefixed Tailwind classes.
 */
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"], // Enable auto-generated documentation
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "Button variant style",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "Button size",
    },
    asChild: {
      control: "boolean",
      description: "Render as child component (Slot)",
    },
    disabled: {
      control: "boolean",
      description: "Disable button interaction",
    },
  },
  args: {
    onClick: fn(), // Mock function to track clicks in Actions panel
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button variant with primary styling
 */
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

/**
 * Secondary button with muted styling
 */
export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

/**
 * Destructive button for dangerous actions
 */
export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

/**
 * Outline button with border
 */
export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

/**
 * Ghost button with minimal styling
 */
export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

/**
 * Link-styled button
 */
export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

/**
 * Small button size
 */
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

/**
 * Large button size
 */
export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

/**
 * Icon button (square)
 */
export const Icon: Story = {
  args: {
    children: "🔍",
    size: "icon",
  },
};

/**
 * Disabled button state
 */
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

/**
 * Interactive story with play function
 * Demonstrates user interaction testing
 */
export const WithInteraction: Story = {
  args: {
    children: "Click me",
  },
  play: async ({ canvasElement, args }) => {
    const { userEvent, within } = await import("@storybook/test");
    const canvas = within(canvasElement);

    // Find and click the button
    const button = canvas.getByRole("button");
    await userEvent.click(button);

    // Verify onClick was called (visible in Actions panel)
  },
};
