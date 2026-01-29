import type { Preview } from "@storybook/react";
import React from "react";
import { ShadCNProvider } from "../src/ShadCNProvider";

// Import global CSS (includes Tailwind + theme variables)
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
      ],
    },
  },

  decorators: [
    (Story, context) => {
      // Use Storybook's background to determine theme
      const isDark = context.globals.backgrounds?.value === "#1a1a1a";
      const theme = isDark ? "dark" : "light";

      return (
        <ShadCNProvider theme={theme}>
          <Story />
        </ShadCNProvider>
      );
    },
  ],
};

export default preview;
