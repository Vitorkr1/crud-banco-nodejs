const formulario = document.querySelector('#form-cliente')
const nome = document.querySelector('#nome')
const cpf = document.querySelector('#cpf')
const saldo = document.querySelector('#saldo')
const ativo = document.querySelector('#ativo')
const lista = document.querySelector('#lista-clientes')
const mensagem = document.querySelector('#mensagem')
const salvar = document.querySelector('#salvar')
const cancelar = document.querySelector('#cancelar')
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
let clienteEmEdicao = null
let ocupado = false

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto
  mensagem.classList.toggle('erro', erro)
  mensagem.hidden = !texto
}

function definirOcupado(valor) {
  ocupado = valor
  document.querySelector('#campos-cliente').disabled = valor
  document.querySelectorAll('button').forEach(botao => { botao.disabled = valor })
}

async function requisicao(url, opcoes = {}) {
  let resposta
  try {
    resposta = await fetch(url, opcoes)
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.')
  }
  const dados = await resposta.json()
  if (!resposta.ok) throw new Error(dados.message || 'Não foi possível concluir a operação.')
  return dados
}

function limparFormulario() {
  clienteEmEdicao = null
  formulario.reset()
  document.querySelector('#titulo-formulario').textContent = 'Novo cliente'
  salvar.textContent = 'Cadastrar cliente'
  cancelar.hidden = true
}

function mostrarLinha(texto) {
  lista.replaceChildren()
  const linha = document.createElement('tr')
  const celula = document.createElement('td')
  celula.colSpan = 5
  celula.textContent = texto
  linha.append(celula)
  lista.append(linha)
}

function renderizarClientes(clientes) {
  document.querySelector('#total-clientes').textContent = clientes.length
  document.querySelector('#total-ativos').textContent = clientes.filter(cliente => Number(cliente.ativo) === 1).length
  const total = clientes.reduce((soma, cliente) => soma + Number(cliente.saldo ?? cliente.Saldo), 0)
  document.querySelector('#saldo-total').textContent = moeda.format(total)
  lista.replaceChildren()
  if (clientes.length === 0) {
    mostrarLinha('Nenhum cliente cadastrado. Use o formulário para começar.')
    return
  }
  clientes.forEach(cliente => {
    const linha = document.createElement('tr')
    const valores = [cliente.idclientes, cliente.nome, moeda.format(Number(cliente.saldo ?? cliente.Saldo))]
    valores.forEach((valor, indice) => {
      const celula = document.createElement('td')
      celula.textContent = valor
      if (indice === 1) {
        const documento = document.createElement('small')
        documento.textContent = String(cliente.cpf).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        celula.append(documento)
      }
      if (indice === 2) celula.className = 'saldo-celula'
      linha.append(celula)
    })
    const situacao = document.createElement('td')
    const etiqueta = document.createElement('span')
    const estaAtivo = Number(cliente.ativo) === 1
    etiqueta.textContent = estaAtivo ? 'Ativo' : 'Inativo'
    etiqueta.className = estaAtivo ? 'situacao' : 'situacao inativo'
    situacao.append(etiqueta)
    const acoes = document.createElement('td')
    const botoes = document.createElement('div')
    botoes.className = 'acoes'
    for (const acao of ['editar', 'excluir']) {
      const botao = document.createElement('button')
      botao.type = 'button'
      botao.textContent = acao === 'editar' ? 'Editar' : 'Excluir'
      botao.className = acao === 'editar' ? 'secundario' : 'excluir'
      botao.dataset.acao = acao
      botao.dataset.id = cliente.idclientes
      botao.disabled = ocupado
      botao.setAttribute('aria-label', `${botao.textContent} cliente ${cliente.nome}`)
      botoes.append(botao)
    }
    acoes.append(botoes)
    linha.append(situacao, acoes)
    lista.append(linha)
  })
}

async function carregarClientes() {
  try {
    const clientes = await requisicao('/clientes')
    renderizarClientes(clientes)
  } catch (erro) {
    mostrarLinha('Não foi possível carregar a lista. Clique em Atualizar lista para tentar novamente.')
    for (const id of ['total-clientes', 'total-ativos', 'saldo-total']) {
      document.getElementById(id).textContent = '—'
    }
    throw erro
  }
}

async function atualizarLista() {
  if (ocupado) return
  definirOcupado(true)
  mostrarMensagem('Carregando clientes...')
  try {
    await carregarClientes()
    mostrarMensagem('')
  } catch (erro) {
    mostrarMensagem(erro.message, true)
  } finally {
    definirOcupado(false)
  }
}

formulario.addEventListener('submit', async evento => {
  evento.preventDefault()
  if (ocupado || !formulario.reportValidity()) return
  const emEdicao = clienteEmEdicao !== null
  const cliente = { nome: nome.value.trim(), cpf: cpf.value.trim(), saldo: Number(saldo.value), ativo: Number(ativo.value) }
  definirOcupado(true)
  mostrarMensagem('Salvando cliente...')
  let resultado
  try {
    resultado = await requisicao(emEdicao ? `/clientes/${clienteEmEdicao}` : '/clientes', {
      method: emEdicao ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    })
    limparFormulario()
    await carregarClientes()
    mostrarMensagem(emEdicao ? 'Cliente atualizado com sucesso.' : `Cliente cadastrado! Número do cliente: ${resultado.id}.`)
  } catch (erro) {
    mostrarMensagem(resultado ? `Cliente salvo, mas a lista não foi atualizada. ${erro.message}` : erro.message, true)
  } finally {
    definirOcupado(false)
  }
})

lista.addEventListener('click', async evento => {
  const botao = evento.target.closest('button[data-acao]')
  if (!botao || ocupado) return
  const id = botao.dataset.id
  const editar = botao.dataset.acao === 'editar'
  if (!editar && !window.confirm(`Deseja excluir o cliente nº ${id}?`)) return
  definirOcupado(true)
  let excluido = false
  try {
    if (editar) {
      const cliente = await requisicao(`/clientes/${id}`)
      clienteEmEdicao = id
      nome.value = cliente.nome
      cpf.value = cliente.cpf
      saldo.value = cliente.saldo ?? cliente.Saldo
      ativo.value = String(Number(cliente.ativo))
      document.querySelector('#titulo-formulario').textContent = `Editar cliente nº ${id}`
      salvar.textContent = 'Salvar alterações'
      cancelar.hidden = false
      mostrarMensagem('Altere os dados no formulário e clique em Salvar alterações.')
    } else {
      await requisicao(`/clientes/${id}`, { method: 'DELETE' })
      excluido = true
      if (clienteEmEdicao === id) limparFormulario()
      await carregarClientes()
      mostrarMensagem('Cliente excluído com sucesso.')
    }
  } catch (erro) {
    mostrarMensagem(excluido ? `Cliente excluído, mas a lista não foi atualizada. ${erro.message}` : erro.message, true)
  } finally {
    definirOcupado(false)
    if (editar && clienteEmEdicao === id) nome.focus()
  }
})

cancelar.addEventListener('click', () => { limparFormulario(); mostrarMensagem('') })
document.querySelector('#recarregar').addEventListener('click', atualizarLista)
atualizarLista()
