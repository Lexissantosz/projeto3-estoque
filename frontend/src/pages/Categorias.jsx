import { useEffect, useState } from 'react'
import { get, post, del } from '../services/api'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nome, setNome] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    return get('/categorias').then(setCategorias)
  }

  async function criar(e) {
    e.preventDefault()

    try {
      await post('/categorias', { nome })
      setNome('')
      await carregar()
      alert('Categoria adicionada com sucesso.')
    } catch {
      alert('Não foi possível adicionar a categoria.')
    }
  }

  async function excluir(id) {
    try {
      await del(`/categorias/${id}`)
      await carregar()
      alert('Categoria excluída com sucesso.')
    } catch {
      alert('Não foi possível excluir a categoria. Verifique se existem produtos vinculados a ela.')
    }
  }

  return (
    <div>
      <h1>Categorias</h1>
      <form className="card" onSubmit={criar}>
        <div className="field">
          <label>Nome da categoria</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <button type="submit">Adicionar</button>
      </form>
      <table>
        <thead><tr><th>Nome</th><th>Acoes</th></tr></thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td><button className="danger" onClick={() => excluir(c.id)}>Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
