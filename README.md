# 🤖 Beasybot Front Refactor

> Uma interface moderna, responsiva e performática para interação com assistentes de IA e gerenciamento de conhecimento.

O **Beasybot Front Refactor** é a nova versão do frontend da plataforma Beasybot, construída com as tecnologias mais modernas do ecossistema React para oferecer uma experiência de usuário premium, fluida e escalável.

---

## ✨ Funcionalidades Principais

- **💬 Chat Inteligente em Tempo Real**: Interface de chat rica com suporte a markdown, syntax highlighting e streaming de respostas.
- **📚 Base de Conhecimento**: Upload e gerenciamento de arquivos (PDF, DOCX, TXT) para contexto das IAs.
- **🎨 UI/UX Premium**: Design system consistente com TailwindCSS, suporte a tema escuro e animações fluidas com Framer Motion.
- **⚡ Alta Performance**: Otimizado com Vite e React Query para carregamento rápido e cache eficiente.
- **📱 Responsividade Total**: Layout adaptável para desktop, tablets e mobile.
- **🔐 Autenticação e Segurança**: Rotas protegidas e gerenciamento de sessão de usuário.

---

## 🛠️ Tech Stack

Este projeto foi construído utilizando as melhores práticas e ferramentas do mercado:

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Estilização**: [TailwindCSS v4](https://tailwindcss.com/) + [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Gerenciamento de Estado & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Roteamento**: [TanStack Router](https://tanstack.com/router/latest)
- **Tabelas**: [TanStack Table](https://tanstack.com/table/latest) (Headless generic tables)
- **Formulários & Validação**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/) + [Lottie React](https://github.com/Gamote/lottie-react)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Qualidade de Código**: ESLint + Prettier + Husky (opcional)

---

## 🚀 Como Executar

Siga os passos abaixo para rodar o projeto em sua máquina local.

### Pré-requisitos

- **Node.js**: Versão 18 ou superior.
- **Gerenciador de Pacotes**: NPM, Yarn ou PNPM.

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/beasybot-front-refactor.git
    cd beasybot-front-refactor
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn
    # ou
    pnpm install
    ```

3.  **Execute o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    O projeto estará rodando em `http://localhost:5173`.

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run preview`: Visualiza a build de produção localmente.
- `npm run lint`: Executa a verificação de linter.

---

## 📂 Estrutura do Projeto

A estrutura de pastas segue uma organização por funcionalidades (features), facilitando a manutenção e escalabilidade.

```
src/
├── assets/          # Imagens, ícones, animações lottie
├── components/      # Componentes reutilizáveis globais (UI, Layout, etc.)
│   ├── ui/          # Componentes básicos de UI (Button, Input, Modal, etc.)
│   ├── layout/      # Componentes de estrutura de página
│   └── ...
├── contexts/        # Contextos globais do React (Auth, Toast, User)
├── features/        # Módulos principais da aplicação, contendo seus próprios componentes, hooks e serviços
│   ├── chat/        # Lógica e componentes do Chat
│   ├── files/       # Lógica e componentes de Arquivos
│   └── home/        # Componentes da Home Page
├── hooks/           # Hooks personalizados globais
├── pages/           # Componentes de página (coordenam as features)
├── routes/          # Definição de rotas do TanStack Router
├── services/        # Configuração de clientes de API (Axios, Socket.io)
└── utils/           # Funções utilitárias e helpers
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Se você tem alguma ideia para melhorar o app ou encontrou algum bug:

1.  Faça um **fork** do projeto.
2.  Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o **commit** (`git commit -m 'Adicionando MinhaFeature'`).
4.  Faça o **push** (`git push origin feature/MinhaFeature`).
5.  Abra um **Pull Request**.

---

Desenvolvido com 💚 pela equipe **Beasybot**.
