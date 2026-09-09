package com.senac.estoque.service;

import com.senac.estoque.model.Categoria;
import com.senac.estoque.repository.CategoriaRepository;
import com.senac.estoque.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria salvar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public void excluir(Long id) {
        boolean possuiProdutosVinculados = produtoRepository.findAll().stream()
                .anyMatch(produto -> id.equals(produto.getCategoriaId()));

        if (possuiProdutosVinculados) {
            throw new IllegalStateException("Nao e possivel excluir uma categoria com produtos vinculados.");
        }

        categoriaRepository.deleteById(id);
    }
}
