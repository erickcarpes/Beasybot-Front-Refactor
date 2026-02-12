// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// =================================================================
// 1. IMPORTAÇÕES DOS PLUGINS E CONFIGURAÇÕES
// =================================================================
// Cada import traz as funcionalidades de um plugin ou um conjunto de regras.
// O ESLint usa o sistema de "Flat Config", onde tudo é importado e configurado
// explicitamente no mesmo arquivo.

import eslint from '@eslint/js'; // Regras base do ESLint
import perfectionist from 'eslint-plugin-perfectionist'; // Plugin para ordenar/organizar código (imports, objetos, etc.)
import tseslint from 'typescript-eslint'; // Ferramentas para o ESLint entender e aplicar regras em TypeScript
import importPlugin from 'eslint-plugin-import'; // Regras para importações/exportações de módulos
import sonarjs from 'eslint-plugin-sonarjs'; // Focado em detectar bugs e "code smells" (maus cheiros no código)
import unicorn from 'eslint-plugin-unicorn'; // Conjunto de regras opinativas para melhorar a qualidade do código
import prettierConfig from 'eslint-config-prettier'; // DESLIGA regras do ESLint que conflitam com o Prettier
import prettierPlugin from 'eslint-plugin-prettier'; // RODA o Prettier como uma regra do ESLint
import react from 'eslint-plugin-react'; // Regras específicas para código React
import reactHooks from 'eslint-plugin-react-hooks'; // Regras para o uso correto de Hooks (useState, useEffect, etc.)
import reactRefresh from 'eslint-plugin-react-refresh'; // Validações para o Hot Reload (Fast Refresh) do React funcionar bem

// =================================================================
// 2. EXPORTAÇÃO PRINCIPAL DA CONFIGURAÇÃO
// =================================================================
// O ESLint Flat Config exporta um array de objetos de configuração.
// O ESLint processa este array em ordem, aplicando e sobrescrevendo regras.

export default tseslint.config(// Bloco 1: Configurações Globais e Presets
  // -----------------------------------------------------------------
  {
    // Arquivos e pastas que o ESLint deve IGNORAR completamente.
    ignores: ['dist', 'build', '**/*.config.js', '**/*.config.mjs', 'node_modules'],
  }, // Ativa o conjunto de regras "recomendadas" pelo próprio ESLint.
  eslint.configs.recommended, // Ativa as regras do Perfectionist para ordenar várias partes do código em ordem alfabética.
  perfectionist.configs['recommended-alphabetical'], // Bloco 2: Plugins de Qualidade de Código (Unicorn, SonarJS)
  // -----------------------------------------------------------------
  {
    // Ativa as regras recomendadas do Unicorn para todo o projeto.
    plugins: { unicorn },
    rules: {
      ...unicorn.configs.recommended.rules,
      'unicorn/prevent-abbreviations': [
        'error',
        {
          // 'replacements' com 'false' remove completamente as regras padrão do plugin.
          // Isto é eficaz para sufixos como '...Props'.
          replacements: {
            props: false, // Desativa a verificação de "props" -> "properties"
            ref: false, // Desativa a verificação de "ref" -> "reference"
            params: false, // Desativa "params" -> "parameters"
            args: false, // Desativa "args" -> "arguments"
            e: false, // Desativa "e" -> "error" ou e -> "event"
            utils: false, // Desativa "utils" -> "utilities"
            temp: false, // Desativa "temp" -> "temporary"
          },
        },
      ],
      'unicorn/no-null': 'off', // Permite o uso de `null` quando necessário.
    },
  }, {
  // Ativa as regras recomendadas do SonarJS para todos os arquivos de código.
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: { sonarjs },
  rules: {
    ...sonarjs.configs.recommended.rules, 'sonarjs/no-unused-vars': 'off'
  },
}, // Bloco 3: Regra de Arquitetura - Restrição de Imports de Features
  // -----------------------------------------------------------------
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Esta regra proíbe importações que correspondem a certos padrões.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // O `group` define um conjunto de padrões a serem bloqueados.
              group: [
                // 1. Proíbe qualquer import que venha de um subdiretório de uma feature.
                //    Ex: `import Botao from 'src/features/auth/components/Botao'` é PROIBIDO.
                '**/features/*/**',
                // 2. O `!` cria uma EXCEÇÃO. Ele permite a importação da raiz da feature.
                //    Ex: `import { AuthProvider } from 'src/features/auth'` é PERMITIDO.
                '!**/features/*',
              ],
              message:
                'Uma feature só pode ser consumida através de seu arquivo de entrada (index). Não acesse seus arquivos internos diretamente.',
            },
          ],
        },
      ],
    },
  }, // Bloco 4: Configuração Específica para TypeScript
  // -----------------------------------------------------------------
  {
    files: ['**/*.ts', '**/*.tsx'], // Aplica apenas a arquivos TypeScript.
    // `extends` mescla configurações prontas. Aqui usamos as mais estritas que exigem informação de tipo.
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        // Aponta para o tsconfig usado pelo ESLint, permitindo regras que analisam os tipos.
        project: './tsconfig.eslint.json',
        // Define o diretório raiz para a resolução do tsconfig.
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Permite o uso de `any`, mas gera um aviso (warn) para incentivar a tipagem.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Encontra variáveis não utilizadas, mas ignora aquelas que começam com `_`.
      // Útil para callbacks com argumentos que você não precisa usar.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  }, {
  files: ['src/routes/**/*.tsx'],
  rules: {
    '@typescript-eslint/only-throw-error': 'off',
  },
}, // Bloco 5: Override de Arquitetura - Liberação para Barrel Files
  // -----------------------------------------------------------------
  {
    // Alvo: Apenas os arquivos `index.tsx` ou `index.ts` na raiz de cada feature.
    files: ['src/features/*/index.{ts,tsx}'],
    rules: {
      // DESLIGA a regra de restrição de imports para estes arquivos.
      // Isso é CRUCIAL para permitir que o `index` da feature possa importar
      // de seus próprios subdiretórios (`./components`, `./hooks`) para poder exportá-los.
      'no-restricted-imports': 'off',
    },
  }, // Bloco 6: Configuração GLOBAL do Plugin `eslint-plugin-import`
  // -----------------------------------------------------------------
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      import: importPlugin,
    },
    // `settings` são configurações compartilhadas que os plugins podem ler.
    // Esta parte é importante para que o resolver funcione em todo o projeto.
    settings: {
      // Ajuda o `eslint-plugin-import` a resolver os caminhos de importação em um projeto TypeScript.
      'import/resolver': {
        typescript: {
          project: './tsconfig.eslint.json',
        },
        node: true,
      },
    },
    // A REGRA FOI REMOVIDA DAQUI PARA SER APLICADA EM UM BLOCO ESPECÍFICO.
  }, // Bloco 6.1: Regra Específica para Default Export em Componentes e Páginas
  // -----------------------------------------------------------------
  {
    // Alvo: Apenas arquivos dentro de `components`, `pages`, e subpastas `components` dentro de `features`.
    files: [
      'src/components/**/*.{ts,tsx,js,jsx}',
      'src/features/**/components/**/*.{ts,tsx,js,jsx}',
      'src/pages/**/*.{ts,tsx,js,jsx}',
    ],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Se um arquivo tem apenas uma exportação, sugere que seja uma exportação `default`.
      'import/prefer-default-export': 'error',
    },
  }, // Bloco 7: Configuração Geral para React
  // -----------------------------------------------------------------
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }, // Habilita o parsing de JSX
    },
    settings: {
      // Detecta automaticamente a versão do React instalada no projeto.
      react: { version: 'detect' },
    },
    rules: {
      // Ativa as regras recomendadas para React e React Hooks.
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Desliga a necessidade de `import React from 'react'` em cada arquivo JSX (padrão em React 17+).
      'react/react-in-jsx-scope': 'off',
      // Garante que apenas componentes sejam exportados de arquivos que usam Fast Refresh.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Força que componentes React sejam declarados como arrow functions.
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  }, // Bloco 8: Regras de Nomenclatura e Estilo - Padrão Genérico
  // -----------------------------------------------------------------
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    // IGNORA os arquivos que terão suas próprias regras de nomenclatura no bloco seguinte.
    ignores: [
      'src/components/**/*.{ts,tsx}',
      'src/features/**/components/**/*.{ts,tsx}',
      'src/pages/**/*.{ts,tsx}',
    ],
    plugins: { unicorn },
    rules: {
      // Força que nomes de arquivos sejam em `camelCase`. Ex: `meuUtil.ts`.
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
      // Força o uso de arrow functions (`const minhaFunc = () => {}`).
      'func-style': ['error', 'expression'],
    },
  }, // Bloco 9: Override de Nomenclatura para Componentes/Páginas
  // -----------------------------------------------------------------
  {
    // Alvo: Apenas arquivos de componentes e páginas.
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/features/**/components/**/*.{ts,tsx}',
      'src/pages/**/*.{ts,tsx}',
      'src/stories/**/*.{ts,tsx}',
    ],
    plugins: { unicorn, react },
    rules: {
      // SOBRESCREVE a regra anterior para forçar nomes de arquivo em `PascalCase`. Ex: `MeuComponente.tsx`.
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
      // SOBRESCREVE a regra de estilo de função para permitir `function MeuComponente() {}`.
      // Isso é útil para componentes nomeados, pois melhora o nome no React DevTools.
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'function-expression',
        },
      ],
    },
  }, // Bloco 10: Configuração Final do Prettier
  // -----------------------------------------------------------------
  // Esta configuração DEVE ser a última para garantir que ela sobrescreva outras regras de estilo.
  prettierConfig, {
  plugins: { prettier: prettierPlugin },
  rules: {
    // Ativa a regra do Prettier, que reportará diferenças de formatação como erros do ESLint.
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
}, storybook.configs["flat/recommended"]);