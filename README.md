# 🏦 Banco BR - API CRUD

API REST desenvolvida com **Node.js, Express e MySQL** para praticar operações CRUD em um sistema bancário simples.

O projeto permite cadastrar, listar, atualizar e excluir clientes armazenados em um banco de dados MySQL.

## 🚀 Tecnologias

- Node.js
- Express
- MySQL
- mysql2
- Nodemon
- JavaScript

## 📌 Funcionalidades

- ✅ Listar clientes
- ✅ Cadastrar clientes
- ✅ Atualizar clientes
- ✅ Excluir clientes

## 🛣️ Rotas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Lista todos os clientes |
| POST | `/clientes` | Cadastra um cliente |
| PUT | `/atualizar/:id` | Atualiza um cliente pelo ID |
| DELETE | `/deletar/:id` | Exclui um cliente pelo ID |

## 📦 Exemplo de cliente

```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "saldo": 1500.50,
  "ativo": true
}
```

## 🗄️ Banco de dados

O projeto utiliza o banco:

```text
bancobr
```

A tabela utilizada é `clientes`.

Campos utilizados pela aplicação:

```text
idclientes
nome
cpf
saldo
ativo
```

## ⚙️ Instalação

Clone o repositório:

```bash
git clone URL_DO_SEU_REPOSITORIO
```

Entre na pasta:

```bash
cd NOME_DO_REPOSITORIO
```

Instale as dependências:

```bash
npm install
```

Configure a conexão com o MySQL no arquivo:

```text
db/db.js
```

Depois execute:

```bash
npm run dev
```

O servidor será iniciado na porta:

```text
3000
```

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido para praticar conceitos de backend com Node.js, incluindo:

- Criação de rotas com Express
- `req.body`
- `req.params`
- Integração entre Node.js e MySQL
- Queries parametrizadas
- Operações CRUD
- Métodos HTTP GET, POST, PUT e DELETE
- Status HTTP
- Tratamento básico de erros

## 👨‍💻 Autor

Desenvolvido por **Vitor Guilherme** como projeto de estudos em desenvolvimento backend com Node.js.
