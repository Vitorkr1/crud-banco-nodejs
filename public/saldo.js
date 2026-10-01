const formulario = document.querySelector('#form-saldo')
const numeroCliente = document.querySelector('#cliente-id')
const consultar = document.querySelector('#consultar')
const mensagem = document.querySelector('#mensagem-saldo')
const resultado = document.querySelector('#resultado-saldo')
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
let consultando = false

formulario.addEventListener('submit', async evento => {
  evento.preventDefault()
  if (consultando || !formulario.reportValidity()) return
  const id = Number(numeroCliente.value)
  resultado.hidden = true
  mensagem.hidden = false
  mensagem.classList.remove('erro')
  if (!Number.isSafeInteger(id) || id <= 0) {
    mensagem.textContent = 'Informe um número de cliente válido.'
    mensagem.classList.add('erro')
    return
  }
  consultando = true
  consultar.disabled = true
  numeroCliente.disabled = true
  consultar.textContent = 'Consultando...'
  mensagem.textContent = 'Buscando seu cadastro...'
  try {
    let resposta
    try {
      resposta = await fetch(`/clientes/${id}`)
    } catch {
      throw new Error('Não foi possível conectar ao servidor. Tente novamente.')
    }
    const cliente = await resposta.json()
    if (!resposta.ok) throw new Error(cliente.message || 'Não foi possível consultar o saldo.')
    document.querySelector('#cliente-nome').textContent = cliente.nome
    document.querySelector('#cliente-saldo').textContent = moeda.format(Number(cliente.saldo ?? cliente.Saldo))
    document.querySelector('#cliente-situacao').textContent = `Cliente nº ${cliente.idclientes} · ${Number(cliente.ativo) === 1 ? 'Cadastro ativo' : 'Cadastro inativo'}`
    resultado.hidden = false
    mensagem.hidden = true
  } catch (erro) {
    mensagem.textContent = erro.message
    mensagem.classList.add('erro')
  } finally {
    consultando = false
    consultar.disabled = false
    numeroCliente.disabled = false
    consultar.textContent = 'Consultar saldo'
  }
})

numeroCliente.addEventListener('input', () => {
  resultado.hidden = true
  mensagem.hidden = true
})
