import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, del } from '../services/api'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregar()
    get('/categorias').then(setCategorias)
  }, [])

  function carregar() {
    return get('/produtos').then(setProdutos)
  }

  function nomeCategoria(categoriaId) {
    const cat = categorias.find((c) => c.id === categoriaId)
    return cat ? cat.nome : '(sem categoria)'
  }

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  async function excluir(id) {
    if (!window.confirm('Deseja realmente excluir este produto?')) return

    try {
      await del(`/produtos/${id}`)
      await carregar()
      alert('Produto excluído com sucesso.')
    } catch {
      alert('Não foi possível excluir o produto.')
    }
  }

  const termoBusca = busca.trim().toLowerCase()
  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(termoBusca)
  )

  return (
    <div>
      <h1>Produtos</h1>
      <Link to="/produtos/novo"><button>Novo produto</button></Link>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Buscar produto</label>
        <input
          type="search"
          placeholder="Digite o nome do produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <table style={{ marginTop: 16 }}>
        <thead>
          <tr><th>Nome</th><th>Categoria</th><th>Preco</th><th>Estoque</th><th>Acoes</th></tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((p) => (
            <tr key={p.id} className={p.quantidadeEstoque < p.estoqueMinimo ? 'low-stock' : ''}>
              <td>{p.nome}</td>
              <td>{nomeCategoria(p.categoriaId)}</td>
              <td>{formatarPreco(p.precoUnitario)}</td>
              <td>{p.quantidadeEstoque}</td>
              <td>
                <Link to={`/produtos/${p.id}/editar`}>Editar</Link>{' '}
                <button className="danger" onClick={() => excluir(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
