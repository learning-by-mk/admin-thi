import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginReact from 'eslint-plugin-react';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    pluginReact.configs.flat.recommended,
    pluginJs.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'eslint-disable prefer-const': 'off',
        },
    },
];

export default eslintConfig;
