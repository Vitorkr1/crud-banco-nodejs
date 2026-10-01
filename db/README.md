# Conexao com MySQL

A conexao fica em `db/db.js` e usa um pool do `mysql2`.

Por padrao, a API conecta em `localhost:3306`, com o usuario `root`, senha vazia e banco `bancobr`. Para outra configuracao, defina as variaveis de ambiente antes de iniciar o servidor:

| Variavel | Finalidade |
| --- | --- |
| `DB_HOST` | Endereco do servidor MySQL |
| `DB_PORT` | Porta do MySQL |
| `DB_USER` | Usuario do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_NAME` | Nome do banco |

Exemplo no PowerShell:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "sua-senha"
$env:DB_NAME = "bancobr"
npm run dev
```

Para preparar um banco novo, importe `db/schema.sql` no MySQL ou no phpMyAdmin. O arquivo cria o banco `bancobr` e a tabela `clientes`, com CPF unico e saldo decimal. Ele nao modifica tabelas existentes. Se usar outro nome para o banco, ajuste o nome no SQL e em `DB_NAME`.

No PowerShell, com o cliente MySQL instalado:

```powershell
Get-Content db/schema.sql | mysql -u root -p
```

O servidor MySQL precisa estar iniciado para as consultas da API funcionarem. Os dados da interface sao lidos e salvos na tabela `clientes` por meio da API.
