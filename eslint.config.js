import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: ["dist/", "node_modules/", "_Reference/"],
    },
    {
        rules: {
            // REST-boundary any: responses are dynamic JSON, inputs are Zod-validated at the
            // tool layer. Keep the signal as a warning without failing the lint gate. Proper
            // fix is OpenAPI-generated client types, not a hand-typed refactor.
            "@typescript-eslint/no-explicit-any": "warn",
            // TypeScript already resolves identifiers; core no-undef only false-positives on
            // Node globals (console/process/fetch) in TS files. Disable per typescript-eslint guidance.
            "no-undef": "off",
        },
    },
);
