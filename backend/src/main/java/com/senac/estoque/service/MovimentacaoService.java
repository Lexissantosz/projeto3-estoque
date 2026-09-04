package com.senac.estoque.service;

import com.senac.estoque.model.Movimentacao;
import com.senac.estoque.model.Produto;
import com.senac.estoque.model.TipoMovimentacao;
import com.senac.estoque.repository.MovimentacaoRepository;
import com.senac.estoque.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;

    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository, ProdutoRepository produtoRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Movimentacao> listarTodas() {
        return movimentacaoRepository.findAll();
    }

    public Movimentacao registrar(Movimentacao mov) {
        mov.setData(LocalDateTime.now());
        Produto produto = produtoRepository.findById(mov.getProdutoId()).orElseThrow();

        if (mov.getTipo() == TipoMovimentacao.SAIDA) {
            if (mov.getQuantidade() > produto.getQuantidadeEstoque()) {
                throw new IllegalArgumentException("Quantidade de saída maior que o estoque disponível.");
            }

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - mov.getQuantidade());
            produtoRepository.save(produto);
        }
        // BUG: falta o "else" para TipoMovimentacao.ENTRADA. Registrar uma entrada
        // salva a movimentacao no historico, mas NUNCA soma a quantidade de volta
        // no estoque do produto.

        else if (mov.getTipo() == TipoMovimentacao.ENTRADA) {
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + mov.getQuantidade());
            produtoRepository.save(produto);
        }

        return movimentacaoRepository.save(mov);
    }
}
