import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        ignores: [
            'node_modules',
            'scripts/*',
            'config/*',
            'pnpm-lock.yaml',
            'pnpm-workspace.yaml',
            '.DS_Store',
            'package.json',
            'tsconfig.json',
            '**/*.md',
            'build',
            '.eslintrc.cjs',
            'eslint.config.js',
            '**/.*',
        ],
    },
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                Edit: 'writable',
                console: 'writable',
                _: 'writable',
                $: 'writable',
            },
            ecmaFeatures: {
                jsx: true,
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            prettier: prettierPlugin,
            '@typescript-eslint': typescriptPlugin,
            'react-refresh': reactRefreshPlugin,
            import: importPlugin,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs.recommended.rules,
            ...prettierPlugin.configs.recommended.rules,
            'prettier/prettier': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
