import React, { ReactNode } from "react";
// Note: CSS is imported separately in the consuming app
// via import "terriajs-components/dist/styles.css"

interface ShadCNProviderProps {
  children: ReactNode;
  theme?: "light" | "dark";
}

/**
 * Provider component for ShadCN components
 * Applies theme CSS variables and wraps children in scoping div
 *
 * Usage:
 * ```tsx
 * import { ShadCNProvider } from "@/ShadCNProvider";
 * import { Button } from "@/components/ui/button";
 *
 * function MyNewFeature() {
 *   return (
 *     <ShadCNProvider theme="light">
 *       <Button>Click me</Button>
 *     </ShadCNProvider>
 *   );
 * }
 * ```
 */
export function ShadCNProvider({
  children,
  theme = "light"
}: ShadCNProviderProps) {
  return <div className={`shadcn-scope shadcn-theme ${theme}`}>{children}</div>;
}
