import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post, put } from '../services/api'

export default function FormProduto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    nome: '', descricao: '', precoUnitario: '', quantidadeEstoque: 0, estoqueMinimo: 0, categoriaId: '',
  })

  useEffect(() => {
    get('/categorias').then(setCategorias)
    if (id) {
      get(`/produtos/${id}`).then(setForm)
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (Number(form.precoUnitario) < 0) {
      alert('O preço não pode ser negativo.')
      return
    }

    try {
      if (id) {
        await put(`/produtos/${id}`, form)
        alert('Produto atualizado com sucesso.')
      } else {
        await post('/produtos', form)
        alert('Produto cadastrado com sucesso.')
      }

      navigate('/produtos')
    } catch {
      alert('Não foi possível salvar o produto.')
    }
  }

  return (
    <div>
      <h1>{id ? 'Editar Produto' : 'Novo Produto'}</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Descricao</label>
          <input name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Preco unitario</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precoUnitario"
            value={form.precoUnitario}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label>Estoque minimo</label>
          <input type="number" name="estoqueMinimo" value={form.estoqueMinimo} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Categoria</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
