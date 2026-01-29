# terriajs-components

ShadCN component library for TerriaJS applications. This package provides isolated, themeable UI components built on shadcn/ui.

## Installation

This package is part of the TerriaJS monorepo workspace. It's automatically linked when you run `yarn install` at the root.

## Usage

### Basic Usage

```typescript
import { Button, ShadCNProvider } from "terriajs-components";
import "terriajs-components/dist/styles.css";

function MyComponent() {
  return (
    <ShadCNProvider theme="light">
      <Button variant="default">Click me</Button>
    </ShadCNProvider>
  );
}
```

### Available Components

- **Button** - Versatile button component with multiple variants (default, destructive, outline, secondary, ghost, link)
- **ShadCNProvider** - Theme provider component for scoping styles

### Available Utilities

- **cn()** - Utility function for merging Tailwind classes

## Important Rules

1. **Isolation**: These components use `shadcn-` prefixed classes to avoid conflicts
2. **No MobX**: Keep components pure React. NO `observer()` wrapping on ShadCN components
3. **Independent Theme**: Uses CSS variables, separate from TerriaJS styled-components theme
4. **Always wrap in ShadCNProvider**: Components must be wrapped in `<ShadCNProvider>` for proper theming

## MobX Integration Pattern

If you need to integrate with MobX observables, create a separate container wrapper:

```typescript
// Pure ShadCN Component (MyFeature.tsx)
import { Button, ShadCNProvider } from "terriajs-components";

export function MyFeature(props: MyFeatureProps) {
  return (
    <ShadCNProvider>
      <Button onClick={props.onAction}>{props.label}</Button>
    </ShadCNProvider>
  );
}

// MobX Wrapper (MyFeatureContainer.tsx)
import { observer } from "mobx-react";
import { MyFeature } from "./MyFeature";

export const MyFeatureContainer = observer((props: ContainerProps) => {
  const { viewState } = props;

  return (
    <MyFeature
      label={viewState.myLabel}
      onAction={() => viewState.doAction()}
    />
  );
});
```

## Development

### Building the Package

```bash
# Build TypeScript and CSS
yarn build

# Watch mode for development
yarn watch

# Clean build artifacts
yarn clean
```

### Adding New Components

Use the shadcn CLI or manually add components to `src/components/ui/` following the pattern in `button.tsx`.

**Important**: All Tailwind classes MUST use the `shadcn-` prefix:

- ✅ `shadcn-flex shadcn-items-center`
- ❌ `flex items-center`

### Using the shadcn CLI

```bash
# Add a new component (e.g., card)
npx shadcn@latest add card

# The CLI will automatically place it in src/components/ui/
# Remember to export it from src/index.ts
```

## Theme Customization

Edit `src/styles/themes/default.css` to customize colors and design tokens:

```css
.shadcn-theme {
  --primary: 221.2 83.2% 53.3%; /* Your primary color */
  --radius: 0.5rem; /* Border radius */
  /* ... other variables */
}
```

## Package Structure

```
packages/terriajs-components/
├── src/
│   ├── index.ts            # Barrel exports
│   ├── components/ui/      # ShadCN components
│   │   └── button.tsx
│   ├── lib/
│   │   └── utils.ts        # cn() utility
│   ├── styles/
│   │   ├── globals.css     # Tailwind imports
│   │   └── themes/
│   │       └── default.css # Theme variables
│   └── ShadCNProvider.tsx  # Theme provider
├── dist/                   # Build output
│   ├── index.js
│   ├── index.d.ts
│   └── styles.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Do's and Don'ts

### DO ✅

- Wrap components in `<ShadCNProvider>`
- Keep components **pure React** (no MobX observer)
- Use `shadcn-` prefixed Tailwind classes
- Import from package root: `import { Button } from "terriajs-components"`
- Import CSS: `import "terriajs-components/dist/styles.css"`

### DON'T ❌

- Use `observer()` directly on ShadCN components
- Remove `shadcn-` prefix from Tailwind classes
- Modify the Tailwind config prefix
- Forget to build the package after changes

## Troubleshooting

**Q: Styles not applying?**
- Check that you wrapped component in `<ShadCNProvider>`
- Verify all classes have `shadcn-` prefix
- Ensure CSS is imported: `import "terriajs-components/dist/styles.css"`

**Q: Import errors for components?**
- Run `yarn install` at workspace root to link packages
- Build the package: `cd packages/terriajs-components && yarn build`
- Check that `terriajs-components` is in your package.json dependencies

**Q: TypeScript errors?**
- Ensure the package is built (generates .d.ts files)
- Run `yarn build` in the terriajs-components package

## License

Apache-2.0
