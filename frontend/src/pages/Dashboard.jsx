import { useEffect, useState } from 'react'
import { get } from '../services/api'

export default function Dashboard() {
  const [produtos, setProdutos] = useState([])
  const [valorTotal, setValorTotal] = useState(0)

  useEffect(() => {
    get('/produtos').then(setProdutos)
    get('/produtos/valor-total').then((r) => setValorTotal(r.valorTotal))
  }, [])

  const estoqueBaixo = produtos.filter(
    (p) => p.quantidadeEstoque < p.estoqueMinimo
  )

  const valorTotalFormatado = Number(valorTotal || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div>
      <h1>Painel de Estoque</h1>
      <div className="grid">
        <div className="card">
          <div>Produtos cadastrados</div>
          <div className="stat">{produtos.length}</div>
        </div>
        <div className="card">
          <div>Valor total em estoque</div>
          <div className="stat">{valorTotalFormatado}</div>
        </div>
        <div className="card">
          <div>Produtos com estoque baixo</div>
          <div className="stat">{estoqueBaixo.length}</div>
        </div>
      </div>

      <h2>Alerta de estoque baixo</h2>
      <table>
        <thead><tr><th>Produto</th><th>Estoque</th><th>Minimo</th></tr></thead>
        <tbody>
          {estoqueBaixo.map((p) => (
            <tr key={p.id}><td>{p.nome}</td><td>{p.quantidadeEstoque}</td><td>{p.estoqueMinimo}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
