const express = require('express')
const pool = require('../db/db.js')
const app = express()
app.use(express.json())

app.get('/', (req,res) => {
  const mostrar = `SELECT * FROM clientes`
  pool.query(mostrar, (error,result) =>{
    if (error){
    return res.status(500).json({message:'error no sevidor'})
    }
    res.status(200).json(result)

  })
})

app.post('/clientes', (req,res) => {
  const {nome,cpf,saldo,ativo} = req.body

  const inserir = `INSERT INTO clientes (nome,cpf,saldo,ativo) VALUES (?,?,?,?)`

  pool.query(inserir,[nome,cpf,saldo,ativo], (error) =>{
    if (error){
      return res.status(500).json({message:'erro no sevidor'})
    }
    res.status(201).json({message:"usuario criado"})
  })
})

app.put('/atualizar/:id', (req,res) => {
  const {id} = req.params
  const {nome,cpf,saldo,ativo} = req.body

  const inserir = `UPDATE clientes SET nome=?, cpf=?, Saldo=?, ativo=? WHERE idclientes = ?`

  pool.query(inserir, [nome,cpf,saldo,ativo,id], (error) =>{
    if (error){
      return res.status(500).json({message:'erro no sevidor', error})
    }
    res.status(201).json({message:"usuario atualizado"})    
  })
})

app.delete('/deletar/:id', (req,res) => {
  const {id} = req.params

  const dell = `DELETE FROM clientes WHERE idclientes = ?`
  pool.query(dell, [id], (error) =>{
    if (error){
      return res.status(500).json({message:'erro no sevidor'})
    }
    res.status(201).json({message:"usuario deletado"})       
  })
})

app.listen(3000)