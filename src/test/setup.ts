import '@testing-library/jest-dom/vitest';

// Spec convention for services and data/orchestration hooks: cover four paths —
// default/loading state, success, error, and an empty/edge case (e.g. no rows,
// unchanged input, not-found). Mirrors this repo's translation of the Angular
// API Store testing rule.
