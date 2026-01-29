import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";
import { ShadCNProvider } from "../../ShadCNProvider";

// Helper to render with ShadCNProvider
function renderWithProvider(ui: React.ReactElement) {
  return render(<ShadCNProvider>{ui}</ShadCNProvider>);
}

describe("Button", () => {
  it("renders button with text", () => {
    renderWithProvider(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    renderWithProvider(<Button>Default</Button>);
    const button = screen.getByRole("button");

    // Check for shadcn-prefixed classes
    expect(button).toHaveClass("shadcn-bg-primary");
    expect(button).toHaveClass("shadcn-text-primary-foreground");
  });

  it("applies destructive variant classes", () => {
    renderWithProvider(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("shadcn-bg-destructive");
    expect(button).toHaveClass("shadcn-text-destructive-foreground");
  });

  it("applies outline variant classes", () => {
    renderWithProvider(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("shadcn-border");
    expect(button).toHaveClass("shadcn-bg-background");
  });

  it("applies secondary variant classes", () => {
    renderWithProvider(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("shadcn-bg-secondary");
  });

  it("applies small size classes", () => {
    renderWithProvider(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("shadcn-h-8");
    expect(button).toHaveClass("shadcn-px-3");
  });

  it("applies large size classes", () => {
    renderWithProvider(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("shadcn-h-10");
    expect(button).toHaveClass("shadcn-px-8");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<Button onClick={handleClick} disabled>Click me</Button>);

    // Attempt click on disabled button
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled styling", () => {
    renderWithProvider(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:shadcn-opacity-50");
  });

  it("merges custom className", () => {
    renderWithProvider(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("shadcn-bg-primary"); // Still has default classes
  });

  it("forwards ref to button element", () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    renderWithProvider(<Button ref={ref}>Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as Slot when asChild is true", () => {
    renderWithProvider(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    // Should render as anchor, not button
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
