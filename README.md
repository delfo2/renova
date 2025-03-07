# Renova - Consulta de Preços da Tabela FIPE

Renova é uma aplicação fullstack que permite consultar preços de veículos na Tabela FIPE utilizando um chatbot inteligente. O chatbot utiliza a API da OpenAI para compreender as intenções do usuário e integra-se com a API da Tabela FIPE para buscar valores atualizados de carros, motos e caminhões.

## 📋 Conteúdo

-   [Visão Geral](#visão-geral)
-   [Tecnologias Utilizadas](#tecnologias-utilizadas)
-   [Estrutura do Projeto](#estrutura-do-projeto)
-   [Pré-requisitos](#pré-requisitos)
-   [Configuração do Ambiente](#configuração-do-ambiente)
-   [Rodando a Aplicação](#rodando-a-aplicação)
    -   [Usando Docker Compose](#usando-docker-compose)
    -   [Rodando os Componentes Separadamente](#rodando-os-componentes-separadamente)
-   [Desafios do Projeto](#desafios-do-projeto)
-   [APIs Utilizadas](#apis-utilizadas)

## 👁️‍🗨️ Visão Geral

A aplicação Renova permite que usuários consultem preços da Tabela FIPE através de uma interface de chat intuitiva. O usuário pode interagir com o chatbot de forma natural, solicitando informações sobre veículos, e o sistema guiará o usuário no processo de consulta, seguindo o fluxo necessário para obter os preços:

1. Escolha do tipo de veículo (carro, moto ou caminhão)
2. Seleção da marca
3. Seleção do modelo
4. Escolha do ano
5. Visualização do preço FIPE

## 🚀 Tecnologias Utilizadas

### Backend

-   **Node.js** e **Express**: Framework para o servidor
-   **TypeScript**: Linguagem de programação
-   **Prisma**: ORM para interação com o banco de dados
-   **PostgreSQL**: Banco de dados relacional
-   **Langchain**: Framework para construção de aplicações com LLMs
-   **OpenAI API**: Para processamento de linguagem natural
-   **Docker**: Containerização da aplicação

### Frontend

-   **React**: Biblioteca para construção de interfaces
-   **TypeScript**: Linguagem de programação
-   **Vite**: Ferramenta de build e desenvolvimento
-   **Tailwind CSS**: Framework CSS para estilização

## 📁 Estrutura do Projeto

O projeto está organizado nas seguintes pastas principais:

```
renova/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── bot/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tools/
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 📋 Pré-requisitos

-   **Docker** e **Docker Compose**
-   **Node.js** (v18+)
-   **npm** ou **yarn**
-   Chave de API da OpenAI

## ⚙️ Configuração do Ambiente

1. Clone o repositório:

    ```bash
    git clone https://github.com/delfo2/renova
    cd renova
    ```

2. Configure as variáveis de ambiente:

    **Backend (.env)**:

    ```
    PORT=5000
    OPENAI_KEY=sua_chave_da_openai
    DATABASE_URL=postgres://renova:renova@postgres:5432/renova
    CLIENT_URL=http://localhost
    ```

    **Frontend (.env)**:

    ```
    VITE_BACKEND_URL=http://localhost:5000
    ```

## 🚀 Rodando a Aplicação

### Usando Docker Compose

1. Inicie todos os serviços com Docker Compose:

    ```bash
    docker-compose up -d
    ```

2. A aplicação estará disponível em:
    - Frontend: http://localhost
    - Backend: http://localhost:5000

### Rodando os Componentes Separadamente

#### Backend

1. Navegue até a pasta backend:

    ```bash
    cd backend
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure um banco de dados PostgreSQL e atualize o arquivo .env

4. Execute as migrações do Prisma:

    ```bash
    npx prisma migrate dev
    ```

5. Inicie o servidor:
    ```bash
    npm run dev
    ```

#### Frontend

1. Navegue até a pasta frontend:

    ```bash
    cd frontend
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

4. Acesse o frontend em http://localhost:5173

## 🧩 Desafios do Projeto

### System Rule Flexível vs. Restritivo

Um dos principais desafios foi equilibrar a autonomia do chatbot com a necessidade de um fluxo consistente para consultas na API da FIPE:

1. **Abordagem Inicial (Restritiva)**:

    - O system rule ditava cada ação específica que o bot deveria tomar
    - Prescrevia precisamente quando e como chamar cada ferramenta
    - Resultado: Um bot previsível, mas pouco natural e com experiência de usuário rígida

2. **Abordagem Final (Flexível)**:
    - System rule reformulado para dar mais autonomia ao bot
    - Foco em resultados e requisitos, não em passos específicos
    - Permite que o bot escolha o melhor fluxo para atingir o objetivo
    - Mantém requisitos essenciais (como a necessidade de seguir a ordem sequencial da API FIPE)
    - Resultado: Experiência de conversa mais natural e adaptativa

A mudança para uma abordagem mais flexível permitiu que o bot lidasse melhor com diferentes formas de expressão dos usuários, mantendo a integridade do processo de consulta.

## 🔌 APIs Utilizadas

-   **OpenAI API (GPT-4o)**: Para processamento de linguagem natural e compreensão das intenções do usuário
-   **API FIPE**: Para consulta de preços de veículos no Brasil
