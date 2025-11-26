# 🌾 Sabor que Conecta | Marketplace Agroecológico Full Stack

[](https://www.google.com/search?q=)
[](https://www.google.com/search?q=)
[](https://www.google.com/search?q=)

## 💡 Sobre o Projeto

O **Sabor que Conecta** é uma solução Full Stack desenvolvida para atuar como um **Marketplace Digital** que conecta diretamente pequenos produtores rurais a consumidores urbanos, eliminando intermediários.

O objetivo principal é resolver o desafio logístico e de preços da cadeia de alimentos, garantindo **maior rentabilidade ao produtor** e **produtos mais frescos ao consumidor**.

-----

## ✨ Features e Funcionalidades

O projeto simula uma aplicação pronta para o mercado, focando em segurança, integridade de dados e experiência do usuário.

  * **Autenticação Robusta (Auth):** Registro e Login com **Hashing de Senha (BCrypt)**.
  * **Autorização Baseada em Papéis:** Separação de acesso entre Produtor (Gestão) e Consumidor (Compras).
  * **Gestão Completa (CRUD):** Painel restrito para o Produtor cadastrar, editar e excluir produtos do catálogo.
  * **Auditoria de DELETE:** Registra a exclusão de produtos em uma tabela de auditoria (`auditoria`) para compliance.
  * **Transações de E-commerce:** **Transação Atômica** (ACID) na criação de pedidos, garantindo que o cabeçalho e os itens sejam salvos simultaneamente.
  * **Estrutura DB:** Banco de Dados modelado em **Terceira Forma Normal (3NF)**.

-----

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | Interface de e-commerce moderna com navegação limpa (React Router DOM). |
| **Backend (API)** | **Node.js (Express)** | API RESTful com rotas otimizadas e tratamento de erros. |
| **Banco de Dados** | **PostgreSQL** | Utilizado para integridade, segurança e complexas queries de e-commerce. |
| **Deployment** | **Vercel / Railway** | Estrutura escalável com Frontend e Backend separados. |

-----

## ⚙️ Como Rodar Localmente

Para rodar esta aplicação Full Stack, você precisa de dois terminais:

### 1\. Banco de Dados

  * Crie o banco de dados e as tabelas (o script SQL completo está no nosso histórico).
  * Execute o script de migração no PostgreSQL (local ou remoto).

### 2\. Backend (API Node.js)

1.  Entre na pasta `backend`.
2.  Instale as dependências: `npm install`.
3.  Ligue o servidor: `node server.js`

### 3\. Frontend (React Site)

1.  Entre na pasta `frontend`.
2.  Instale as dependências: `npm install`.
3.  Ligue o site: `npm run dev`

