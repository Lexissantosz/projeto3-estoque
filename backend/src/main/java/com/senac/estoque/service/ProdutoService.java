package com.senac.estoque.service;

import com.senac.estoque.model.Produto;
import com.senac.estoque.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElseThrow();
    }

    public Produto salvar(Produto produto) {
        if (produto.getQuantidadeEstoque() == null) {
            produto.setQuantidadeEstoque(0);
        }
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto dados) {
        Produto produto = buscarPorId(id);
        produto.setNome(dados.getNome());
        produto.setDescricao(dados.getDescricao());
        produto.setPrecoUnitario(dados.getPrecoUnitario());
        produto.setEstoqueMinimo(dados.getEstoqueMinimo());
        produto.setCategoriaId(dados.getCategoriaId());
        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }

    public BigDecimal calcularValorTotalEmEstoque() {
        BigDecimal total = BigDecimal.ZERO;

        for (Produto p : produtoRepository.findAll()) {
            if (p.getPrecoUnitario() != null && p.getQuantidadeEstoque() != null) {
                BigDecimal preco = BigDecimal.valueOf(p.getPrecoUnitario());
                BigDecimal quantidade = BigDecimal.valueOf(p.getQuantidadeEstoque());
                total = total.add(preco.multiply(quantidade));
            }
        }

        return total;
    }

    public List<Produto> listarComEstoqueBaixo() {
        return produtoRepository.findAll().stream()
                .filter(p -> p.getQuantidadeEstoque() <= p.getEstoqueMinimo())
                .toList();
    }
}
