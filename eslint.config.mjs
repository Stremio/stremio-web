import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            '@stylistic': stylistic
        },
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            ecmaVersion: 'latest',
        }
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                YT: 'readonly',
                FB: 'readonly',
                cast: 'readonly',
                chrome: 'readonly',
            }
        }
    },
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        rules: {
            'no-redeclare': 'off',
            'eol-last': 'error',
            'eqeqeq': 'error',
            'no-console': ['error', {
                allow: [
                    'warn',
                    'error'
                ]
            }],
        }
    },
    {
        rules: {
            '@typescript-eslint/no-redeclare': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'varsIgnorePattern': '_',
                    'caughtErrorsIgnorePattern': '_',
                }
            ],
        }
    },
    {
        rules: {
            '@stylistic/arrow-parens': 'error',
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': 'error',
            '@stylistic/comma-spacing': 'error',
            '@stylistic/semi-spacing': 'error',
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/function-call-spacing': 'error',
            '@stylistic/semi': 'error',
            '@stylistic/no-extra-semi': 'error',
            '@stylistic/eol-last': 'error',
            '@stylistic/no-multi-spaces': 'error',
            '@stylistic/no-multiple-empty-lines': ['error', {
                max: 1
            }],
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
        }
    },
    {
        rules: {
            'react/display-name': 'off',
        }
    }
];
