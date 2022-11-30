const formCadastro = document.getElementById('formulario');
const campoTitulo = document.getElementById('campo-titulo');
const campoCategoria = document.getElementById('campo-categoria');
const campoDescricao = document.getElementById('campo-descricao');
const campoLink = document.getElementById('campo-link');
const botaoLimparForm = document.getElementById('limpar-form');
const campoPesquisa = document.getElementById('campo-pesquisa');
const botaoPesquisa = document.getElementById('executar-pesquisa');
const botaoLimpar = document.getElementById('limpar-pesquisa');
const elementoLista = document.getElementById('lista');
const catDoce = document.getElementById('cat-doce');
const catSalgado = document.getElementById('cat-salgado');
const indicadorEdicao = document.getElementById('indicador-edicao');

let lista = [];
let termoPesquisa = "";
let itemSendoEditado = null;

const listaJson = localStorage.getItem('chave-lista');

if (listaJson) {
  lista = JSON.parse(listaJson);
}

function salvaLista() {
  const listaJson = JSON.stringify(lista);
  localStorage.setItem('chave-lista', listaJson);
}

function atualizaTela() {
  elementoLista.innerHTML = '';

  catDoce.innerText = lista.filter(i => i.categoria === 'Doce').length;
  catSalgado.innerText = lista.filter(i => i.categoria === 'Salgado').length;

  const filtrado = lista.filter(item => {
    return item.titulo.toLowerCase().includes(termoPesquisa);
  });

  filtrado.forEach(item => {
    const li = document.createElement('li');

    const titulo = document.createElement('h3');
    titulo.innerText = item.titulo;
    li.appendChild(titulo);
    
    const categoria = document.createElement('p');
    categoria.innerHTML = `<strong>Categoria:</strong> ${item.categoria}`;
    li.appendChild(categoria);

    const descricao = document.createElement('p');
    descricao.innerHTML = item.descricao;
    li.appendChild(descricao);

    const caixaBotoes = document.createElement('div');
    caixaBotoes.className = 'botoes-item';
  
    const botaoEditar = document.createElement('button');
    botaoEditar.innerText = '✏️';
    botaoEditar.addEventListener('click', () => editarItem(item.id));
    caixaBotoes.appendChild(botaoEditar);
  
    const botaoExcluir = document.createElement('button');
    botaoExcluir.innerText = '🗑️';
    botaoExcluir.addEventListener('click', () => removerItem(item.id));
    caixaBotoes.appendChild(botaoExcluir);

    if (item.link) {
      const link = document.createElement('a');
      link.href = item.link;
      link.innerHTML = '<button>🔗</button>';
      caixaBotoes.appendChild(link);
    }

    li.appendChild(caixaBotoes);
    elementoLista.appendChild(li);
  });
}

function executarPesquisa() {
  termoPesquisa = campoPesquisa.value.toLowerCase();
  atualizaTela();
}

function limparPesquisa() {
  campoPesquisa.value = "";
  termoPesquisa = "";
  atualizaTela();
}

function salvarItem() {
  if (itemSendoEditado) {
    itemSendoEditado.titulo = campoTitulo.value;
    itemSendoEditado.categoria = campoCategoria.value;
    itemSendoEditado.descricao = campoDescricao.value;
    itemSendoEditado.link = campoLink.value;
    itemSendoEditado = null;
    indicadorEdicao.style.visibility = 'hidden';
    alert('Atualizado com sucesso!');
  } else {
    lista.push(
      {
        id: Date.now(),
        titulo: campoTitulo.value,
        categoria: campoCategoria.value,
        descricao: campoDescricao.value,
        link: campoLink.value
      }
    );
    alert('Cadastrado com sucesso!');
  }

  formCadastro.reset();
  atualizaTela();
  salvaLista();
}

function removerItem(itemId) {

  const temCerteza = confirm('Deseja excluir?');

  if (temCerteza) {
    lista = lista.filter(i => i.id !== itemId);
    atualizaTela();
    salvaLista();
  }
}

function editarItem(itemId) {
  const item = lista.find(i => i.id === itemId);

  if (item) {
    campoTitulo.value = item.titulo;
    campoCategoria.value = item.categoria;
    campoLink.value = item.link;
    itemSendoEditado = item;
    indicadorEdicao.style.visibility = 'visible';
  }
}

formCadastro.addEventListener('submit', (evento) => {
  evento.preventDefault();
  salvarItem();
});

botaoLimparForm.addEventListener('click', () => {
  itemSendoEditado = null;
  indicadorEdicao.style.visibility = 'hidden';
})

botaoPesquisa.addEventListener('click', executarPesquisa);
botaoLimpar.addEventListener('click', limparPesquisa);

atualizaTela()
