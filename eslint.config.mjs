import { defineConfig } from "@1adybug/eslint"

export default [
    ...defineConfig({
        next: false,
        react: true,
        node: {
            enabled: true,
            preset: "module",
        },
        directories: {
            web: [
                "packages/react-amap/src/**/*.{js,mjs,ts,tsx}",
                "packages/playground/App.tsx",
                "packages/playground/index.tsx",
                "packages/playground/env.d.ts",
                "packages/playground/src/**/*.{js,mjs,ts,tsx}",
            ],
            node: ["eslint.config.mjs", "prettier.config.mjs", "packages/*/*.config.{js,mjs,ts}"],
        },
    }),
    {
        settings: {
            "react-hooks": {
                additionalEffectHooks: "(useStableEffect)",
            },
        },
    },
    {
        files: ["packages/*/*.config.ts"],
        languageOptions: {
            parserOptions: {
                projectService: false,
            },
        },
        rules: {
            "@typescript-eslint/no-deprecated": "off",
        },
    },
]
