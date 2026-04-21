// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Angular recommended — cast required because the plugin types rules as string
  // rather than the stricter RuleEntry type expected by tseslint.config()
  {
    plugins: { '@angular-eslint': angular },
    rules: /** @type {import('typescript-eslint').ConfigArray[number]['rules']} */ (
      angular.configs.recommended.rules
    ),
  },

  // Project-specific rules
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'core',     pattern: 'src/app/core/**' },
        { type: 'shared',   pattern: 'src/app/shared/**' },
        { type: 'features', pattern: 'src/app/features/**' },
      ],
    },
    rules: {
      // app- for feature/core components, ui- for shared components
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: ['app', 'ui'], style: 'kebab-case' }],
      // Attribute directives use no prefix — names are descriptive enough
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: '', style: 'camelCase' }],

      // Enforce Angular style guide member ordering:
      // inject() calls → inputs/outputs/queries → fields → lifecycle → methods
      '@typescript-eslint/member-ordering': ['warn', {
        default: [
          'public-field',
          'protected-field',
          'private-field',
          'constructor',
          'public-method',
          'protected-method',
          'private-method',
        ],
      }],

      // Enforce import rules from ADR-0001
      'boundaries/element-types': ['error', {
        default: 'disallow',
        rules: [
          { from: 'features', allow: ['core', 'shared'] },
          { from: 'shared',   allow: [] },
          { from: 'core',     allow: ['shared'] },
        ],
      }],
    },
  },

  // Angular template rules
  {
    files: ['**/*.html'],
    plugins: { '@angular-eslint/template': angularTemplate },
    languageOptions: { parser: angularTemplateParser },
    rules: /** @type {import('typescript-eslint').ConfigArray[number]['rules']} */ (
      angularTemplate.configs.recommended.rules
    ),
  },

  { ignores: ['dist/', 'node_modules/', 'coverage/', '.angular/'] },
);
