import tailwind from 'prettier-plugin-tailwindcss'

/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  plugins: [tailwind],
}

export default config
