import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],

  // Storybook 10 has essential addons built-in, no need to specify them
  addons: [],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal: async (config) => {
    // Ensure path aliases work in Storybook
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
      };
    }

    return config;
  },

  docs: {
    autodocs: "tag", // Enable autodocs for stories tagged with 'autodocs'
  },
};

export default config;
