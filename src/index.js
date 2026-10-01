const express = require('express')
const pool = require('../db/db.js')
const app = express()

app.use(express.json())


function validarId(req, res, next) {
  const id = Number(req.params.id)
  if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'O ID deve ser um numero inteiro positivo.' })
  }
  req.clienteId = id
  next()
}

function validarCliente(req, res, next) {
  const { nome, cpf, saldo, ativo } = req.body || {}
  if (typeof nome !== 'string' || !nome.trim()) {
    return res.status(400).json({ message: 'Informe um nome valido.' })
  }
  
  if (typeof cpf !== 'string' || !/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(cpf)) {
    return res.status(400).json({ message: 'Informe o CPF como texto com 11 digitos.' })
  }
  if (typeof saldo !== 'number' || !Number.isFinite(saldo) || saldo < 0) {
    return res.status(400).json({ message: 'O saldo deve ser um numero maior ou igual a zero.' })
  }
  if (![true, false, 0, 1].includes(ativo)) {
    return res.status(400).json({ message: 'O campo ativo deve ser true, false, 0 ou 1.' })
  }
  req.cliente = {
    nome: nome.trim(),
    cpf: cpf.replace(/[.-]/g, ''),
    saldo,
    ativo: Number(ativo)
  }
  next()
}

function responderErroBanco(error, res) {
  console.error('Erro na consulta ao banco:', error.code)
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Ja existe um cliente com esses dados unicos.' })
  }
  return res.status(500).json({ message: 'Erro no servidor.' })
}


app.get(['/', '/clientes'], (req, res) => {
  pool.query('SELECT * FROM clientes', (error, result) => {
    if (error) return responderErroBanco(error, res)
    return res.status(200).json(result)
  })
})

app.get('/clientes/:id', validarId, (req, res) => {
  pool.query('SELECT * FROM clientes WHERE idclientes = ?', [req.clienteId], (error, result) => {
    if (error) return responderErroBanco(error, res)
    if (result.length === 0) {
      return res.status(404).json({ message: 'Cliente nao encontrado.' })
    }
    return res.status(200).json(result[0])
  })
})

app.post('/clientes', validarCliente, (req, res) => {
  const { nome, cpf, saldo, ativo } = req.cliente
  const inserir = 'INSERT INTO clientes (nome, cpf, saldo, ativo) VALUES (?, ?, ?, ?)'
  pool.query(inserir, [nome, cpf, saldo, ativo], (error, result) => {
    if (error) return responderErroBanco(error, res)
    return res.status(201).location(`/clientes/${result.insertId}`).json({
      message: 'Cliente criado.',
      id: result.insertId
    })
  })
})

app.put(['/atualizar/:id', '/clientes/:id'], validarId, validarCliente, (req, res) => {
  const { nome, cpf, saldo, ativo } = req.cliente
  const atualizar = 'UPDATE clientes SET nome = ?, cpf = ?, saldo = ?, ativo = ? WHERE idclientes = ?'
  pool.query(atualizar, [nome, cpf, saldo, ativo, req.clienteId], (error, result) => {
    if (error) return responderErroBanco(error, res)
    // affectedRows conta os registros encontrados, mesmo sem mudar os valores.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente nao encontrado.' })
    }
    return res.status(200).json({ message: 'Cliente atualizado.' })
  })
})

app.delete(['/deletar/:id', '/clientes/:id'], validarId, (req, res) => {
  pool.query('DELETE FROM clientes WHERE idclientes = ?', [req.clienteId], (error, result) => {
    if (error) return responderErroBanco(error, res)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente nao encontrado.' })
    }
    return res.status(200).json({ message: 'Cliente deletado.' })
  })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Rota nao encontrada.' })
})

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'O corpo da requisicao deve conter um JSON valido.' })
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'O corpo da requisicao excede o limite permitido.' })
  }
  console.error('Erro no servidor:', error.message)
  return res.status(500).json({ message: 'Erro no servidor.' })
})

if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Servidor rodando na porta ${port}.`))
}

module.exports = app
