import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// @testing-library/jest-dom@7 augments vitest's `Assertion<T>`, but vitest 5
// changed that interface to `Assertion<R, T>`, so the augmentation no longer
// applies. Register the DOM matchers on vitest's `Matchers` interface instead.
declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends TestingLibraryMatchers<unknown, R> {}
}
