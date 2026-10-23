package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.Favorito;
import br.com.zyclos.model.repository.FavoritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FavoritoService {

    @Autowired // Injeção de dependência automática
    private FavoritoRepository favoritoRepository;

    // Método responsável em listar todos os favoritos cadastrados no banco de dados

    public List<Favorito> findAll() {
        return favoritoRepository.findAll();
    }

    // Método responsável em criar o favorito no banco de dados
    // Se o usuário já favoritou o anúncio (ex.: clique duplo), devolve o favorito que já existe

    public Favorito save(Favorito favorito) {
        Optional<Favorito> existente = favoritoRepository.findByUsuarioIdAndAnuncioId(
                favorito.getUsuarioId(), favorito.getAnuncioId());
        if (existente.isPresent()) {
            return existente.get();
        }
        favorito.setDataCadastro(LocalDateTime.now());
        favorito.setCodStatus(true);
        try {
            return favoritoRepository.save(favorito);
        } catch (DataIntegrityViolationException e) {
            // Duas requisições ao mesmo tempo: a outra gravou primeiro (uk_favorito_usuario_anuncio)
            return favoritoRepository.findByUsuarioIdAndAnuncioId(favorito.getUsuarioId(), favorito.getAnuncioId())
                    .orElseThrow(() -> e);
        }
    }

    // Método responsável em listar o favorito por ID

    public Favorito findById(Long id) {
        return favoritoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorito não encontrado com o id " + id));
    }

    // Método responsável em atualizar o favorito

    public Favorito update(Long id, Favorito favorito) {
        Favorito favoritoExistente = findById(id);
        favoritoExistente.setUsuarioId(favorito.getUsuarioId());
        favoritoExistente.setAnuncioId(favorito.getAnuncioId());
        return favoritoRepository.save(favoritoExistente);
    }

    // Método responsável em excluir o favorito ( exclusão física )

    public void delete(Long id) {
        Favorito favoritoExistente = findById(id);
        favoritoRepository.delete(favoritoExistente);
    }
}
