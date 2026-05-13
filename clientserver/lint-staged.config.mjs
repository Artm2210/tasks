/** @type {import('lint-staged').Configuration} */
export default {
  "client/**/*.{ts,tsx,js,mjs,cjs}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "server/**/*.{ts,js,mjs,cjs}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{json,md,yml,yaml}": "prettier --write",
};
