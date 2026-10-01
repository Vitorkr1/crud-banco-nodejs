
# CRUD de clientes com Node.js

## Interface do banco

A pasta `public` contem HTML, CSS e JavaScript simples, sem framework. A logica da API continua em `src/index.js`.

```sh
npm install
npm run dev
```

Configure o MySQL em `db/db.js`; as instrucoes estao em [db/README.md](db/README.md). Com o servidor rodando, abra `http://localhost:3000` para cadastrar, listar, editar e excluir clientes. O painel mostra a quantidade de clientes, os cadastros ativos e o saldo total.

Em `http://localhost:3000/saldo.html`, o cliente informa seu numero de cadastro (`idclientes`) para consultar nome, saldo e situacao. O numero aparece na lista e na mensagem de cadastro.

O JavaScript usa `fetch` com a API no mesmo servidor: `GET /clientes`, `GET /clientes/:id`, `POST /clientes`, `PUT /clientes/:id` e `DELETE /clientes/:id`. A rota `/` agora abre a interface; a listagem JSON fica em `/clientes`. As rotas antigas `/atualizar/:id` e `/deletar/:id` continuam funcionando.

A consulta por numero e uma demonstracao para estudos e nao verifica a identidade do cliente; o projeto ainda nao tem login nem controle de acesso.
