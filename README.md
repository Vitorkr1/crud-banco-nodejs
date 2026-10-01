
# CRUD de clientes com Node.js

Desenvolvido por **Vitor Guilherme** como projeto de estudos em desenvolvimento backend com Node.js, Express e MySQL.

Toda a logica do CRUD fica em `src/index.js`. O arquivo `db/db.js` mantem apenas a conexao com o banco, sem separar o projeto em MVC.

## Como executar

1. Instale o Node.js 18 ou superior e tenha um servidor MySQL disponivel.
2. Configure a conexao em `db/db.js` para o seu ambiente. A configuracao atual usa o banco `bancobr` em `localhost:3306`.
3. O banco deve ter a tabela `clientes` com as colunas `idclientes` (chave primaria com auto incremento), `nome`, `cpf` (texto), `saldo` (numerico) e `ativo` (0 ou 1).
4. Instale as dependencias e inicie a API:

```sh
npm install
npm run dev
```

Para iniciar sem o nodemon:

```sh
npm start
```

A API usa a porta 3000 por padrao. A variavel de ambiente `PORT` permite alterar a porta.

## Rotas

| Metodo | Rota | Acao |
| --- | --- | --- |
| GET | `/` ou `/clientes` | Listar clientes |
| GET | `/clientes/:id` | Buscar um cliente |
| POST | `/clientes` | Criar um cliente |
| PUT | `/atualizar/:id` ou `/clientes/:id` | Atualizar um cliente |
| DELETE | `/deletar/:id` ou `/clientes/:id` | Excluir um cliente |

POST e PUT exigem todos os campos deste exemplo:

```json
{
  "nome": "Maria Silva",
  "cpf": "12345678901",
  "saldo": 100.50,
  "ativo": true
}
```

O nome nao pode ficar vazio. O CPF deve ser texto com 11 digitos ou estar no formato `000.000.000-00`; a API remove a pontuacao antes de salvar. Essa validacao verifica apenas o formato, sem calcular os digitos verificadores. O saldo deve ser um numero nao negativo. O campo `ativo` aceita `true`, `false`, `0` ou `1`.

Respostas: `201` ao criar, `200` nas consultas, atualizacoes e exclusoes, `400` para dados invalidos, `404` para cliente ou rota inexistente e `500` para erro no servidor. Um conflito de chave unica no MySQL retorna `409`; para impedir CPFs duplicados, a coluna `cpf` precisa ter uma restricao `UNIQUE` no banco. JSON maior que o limite padrao do Express retorna `413`.
