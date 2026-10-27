package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.Categoria;
import br.com.zyclos.model.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired // Injeção de dependência automática
    private CategoriaRepository categoriaRepository;

    // Método responsável em listar todas as categorias cadastradas no banco de dados

    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    // Método responsável em criar a categoria no banco de dados

    public Categoria save(Categoria categoria) {
        // O id é gerado pelo banco: um id no corpo faria o save() sobrescrever o registro de outra pessoa
        categoria.setId(null);
        validar(categoria);
        categoria.setCodStatus(true);
        return categoriaRepository.save(categoria);
    }

    // Método responsável em listar a categoria por ID

    public Categoria findById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com o id " + id));
    }

    // Método responsável em atualizar a categoria
    // codStatus também muda por aqui: é como o painel administrativo ativa/desativa a categoria

    public Categoria update(Long id, Categoria categoria) {
        Categoria categoriaExistente = findById(id);
        categoriaExistente.setNome(categoria.getNome());
        categoriaExistente.setSlug(categoria.getSlug());
        validar(categoria);
        categoriaExistente.setDescricao(categoria.getDescricao());
        categoriaExistente.setCodStatus(categoria.isCodStatus());
        return categoriaRepository.save(categoriaExistente);
    }

    // Método responsável em excluir a categoria ( exclusão física )

    public void delete(Long id) {
        Categoria categoriaExistente = findById(id);
        categoriaRepository.delete(categoriaExistente);
    }

    // Nome e slug obrigatórios, com o tamanho máximo das colunas (nome e slug únicos: conferido pelo banco, 409)

    private void validar(Categoria categoria) {
        validarCampo(categoria.getNome(), "O nome", 60, true);
        validarCampo(categoria.getSlug(), "O slug", 60, true);
        validarCampo(categoria.getDescricao(), "A descrição", 255, false);
    }

    private void validarCampo(String valor, String campo, int tamanhoMaximo, boolean obrigatorio) {
        if (valor == null || valor.isBlank()) {
            if (obrigatorio) {
                throw new IllegalArgumentException(campo + " é obrigatório.");
            }
            return;
        }
        if (valor.length() > tamanhoMaximo) {
            throw new IllegalArgumentException(campo + " deve ter no máximo " + tamanhoMaximo + " caracteres.");
        }
    }
}
