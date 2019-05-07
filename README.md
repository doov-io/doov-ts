# dOOv-TS

dOOv (Domain Object Oriented Validation) a fluent API for type-safe bean validation and mapping in TypeScript

## Local Development

### `yarn watch`

Runs the project in development/watch mode. Your project will be rebuilt upon changes, only in ES Module.

### `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `yarn prettier`

Runs the code formatter Prettier

## Continuous Integration

### Travis CI

Runs `yarn test-ci` which executes all tests and checks for formatting errors.
