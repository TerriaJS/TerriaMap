# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TerriaMap is a complete geospatial catalog explorer website built using the TerriaJS library. This is a customizable starting point for building interactive 3D/2D web-based mapping applications. The application uses Cesium for 3D globe visualization and falls back to Leaflet for 2D mapping.

## Workspace Structure

This is a **Yarn workspace monorepo** with packages defined in the root package.json:

- `packages/terriajs/` - The core TerriaJS library (local package)
- `packages/cesium/` - Cesium library
- `packages/terriajs-server/` - Node.js server for proxying
- `packages/plugin-sample/` - Example plugin

## Development Commands

### Starting Development Server

```bash
yarn gulp dev
# Runs terriajs-server on port 3001, watches for changes, and incremental builds
# This is the main command for day-to-day development
```

### Build Commands

```bash
yarn gulp build              # Development build with source maps
yarn gulp release            # Production build (optimized)
yarn gulp watch              # Watch mode for incremental builds only (no server)
```

### Server Only

```bash
yarn start                   # Run server only on port 3001 (without build/watch)
```

### Testing (packages/terriajs/)

```bash
cd packages/terriajs
yarn gulp test               # Run tests in all available browsers (auto-detected)
yarn gulp test-firefox       # Run tests in Firefox only
yarn gulp build-specs        # Build test specs without running them
yarn gulp watch-specs        # Watch and rebuild test specs
```

Tests use Karma + Jasmine. Configuration in `packages/terriajs/buildprocess/karma-*.conf.js`.

### Linting and Code Quality

```bash
yarn gulp lint               # Run ESLint on root (index.js, lib/)
yarn prettier                # Format all files with Prettier
yarn prettier-check          # Check formatting without writing

# For TerriaJS library:
cd packages/terriajs
yarn gulp lint               # ESLint on lib/, test/ directories
```

### Webpack Hot Reloading

```bash
yarn hot                     # Webpack dev server with HMR on port 8080
```

### Other Tasks

```bash
yarn gulp clean              # Clean build artifacts
yarn gulp render-index       # Render index.html from index.ejs (with --baseHref option)
yarn gulp write-version      # Generate version.js from git hash/package versions
```

## Architecture

### Application Entry Points

- `index.js` - Main application initialization (creates Terria instance, ViewState, registers catalog members)
- `entry.js` - Webpack entry point
- `plugins.ts` - Plugin registration (returns array of plugin promises)
- `lib/` - Custom application code (Core, Views, Styles)
- `wwwroot/` - Static assets and served files
- `buildprocess/` - Webpack and build configuration

### TerriaJS Library Architecture (packages/terriajs/lib/)

The TerriaJS library follows a layered architecture:

1. **Core** - Low-level utilities independent of UI/mapping libraries
2. **Map** - Cesium/Leaflet mapping layer abstractions
3. **Charts** - Charting layer (D3-based)
4. **Models** - Heart of TerriaJS - catalog, data sources, formats (MobX-based reactive state)
5. **Traits** - Define configurable properties for models (MobX observables)
6. **ModelMixins** - Reusable behaviors mixed into models
7. **ViewModels/ReactViewModels** - UI-related logic not in React components
8. **ReactViews** - React UI components (styled with Sass/CSS Modules, migrating to styled-components)

### Key Concepts

**MobX Reactive State**: The model layer uses MobX observables and computed properties. Properties are reactive - changes automatically trigger UI updates through React components using MobX observers.

**Catalog System**:

- `Terria` - Root application state (single instance)
- `Catalog` - Data catalog from config.json
- `CatalogMember` - Base for all catalog items
- `CatalogGroup` - Folders containing items
- `CatalogItem` - Mappable items (WMS, GeoJSON, CSV, etc.)
- `CatalogFunction` - Functions producing items (WPS, etc.)

**Strata System**: Models support multiple "strata" (layers) of property values that are merged:

- User stratum (highest priority)
- Load stratum (from GetCapabilities, etc.)
- Definition stratum (from catalog config)

**Mapping Abstraction**: All mapping uses Cesium abstractions even in 2D Leaflet mode:

- Raster layers → `ImageryProvider`
- Vector layers → `DataSource` and `Entity`

### Plugin System

Plugins extend TerriaJS functionality. Add plugin imports to `plugins.ts`:

```typescript
const plugins: () => Promise<TerriaPluginModule>[] = () => [
  import("terriajs-plugin-sample")
];
```

Plugins are loaded before app state restoration in `index.js`.

## Build System

- **Webpack 5** for bundling
- **Babel** for transpiling TypeScript/JSX to ES5
- **Sass** for styling (CSS Modules with camelCase exports)
- Entry configured via `buildprocess/webpack.config.js`
- TerriaJS-specific webpack config via `configureWebpackForTerriaJS` from terriajs package
- Plugin webpack config via `buildprocess/configureWebpackForPlugins.js`

## Configuration Files

- `serverconfig.json` - Server configuration (port, proxy allowlist)
- `wwwroot/config.json` - Application catalog configuration
- `wwwroot/init/` - Initialization files for different data sources
- `wwwroot/index.ejs` - HTML template (rendered to index.html by gulp task)

## Version Management

The `write-version` gulp task generates version info from git hash, package versions, and date. Version appears in `brandBarElements` in the UI.

## Important Development Notes

- **Node >= 20.0.0** required
- Uses **Prettier** for code formatting (enforced via husky pre-commit hook)
- **No PM2** - server runs in foreground (changed in 2023)
- TerriaJS uses **MobX 6.x** and **TypeScript 5.x** (upgraded in v8.3.0)
- React **18.3.1** in packages/terriajs, **16.14.0** in root (for compatibility)
- When adding custom functionality, prefer putting logic in Models layer rather than UI
- UI should be thin, domain logic belongs in Models/ViewModels
- Computed properties should be pure functions
- Avoid side effects and reactions in model code

## Common Customization Points

- `lib/Views/render.tsx` - Custom rendering logic
- `lib/Styles/variables-overrides.scss` - Override TerriaJS Sass variables
- `wwwroot/config.json` - Catalog configuration, branding, feature flags
- `index.js` - Register custom catalog members, search providers, analytics

## Working with TerriaJS Source

When making changes to TerriaJS itself (in `packages/terriajs/`), the workspace setup allows local development. Changes are reflected via the workspace link without needing to publish to npm.
