import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import lit from 'eslint-plugin-lit';
import { defineConfig } from "eslint/config";


export default defineConfig([
  
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { lit }, rules: {
    'lit/attribute-value-entities': 'error',
    'lit/binding-positions': 'error',
    'lit/no-duplicate-template-bindings': 'error',
    'lit/no-invalid-html': 'error',
    'lit/no-legacy-template-syntax': 'error',
    'lit/no-property-change-update': 'error',
  } },
  tseslint.configs.recommended,
]);
