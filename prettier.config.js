/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  endOfLine: 'lf',
  bracketSpacing: true,
  jsxSingleQuote: false,
  arrowParens: 'always',
  bracketSameLine: false,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
