package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.AnuncioImagem;
import br.com.zyclos.model.repository.AnuncioImagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnuncioImagemService {

    @Autowired // Injeção de dependência automática
    private AnuncioImagemRepository anuncioImagemRepository;

    @Autowired
    private AnuncioService anuncioService;

    // Método responsável em listar todas as imagens de anúncios cadastradas no banco de dados

    public List<AnuncioImagem> findAll() {
        return anuncioImagemRepository.findAll();
    }

    // Método responsável em criar a imagem do anúncio no banco de dados

    public AnuncioImagem save(AnuncioImagem anuncioImagem, Long usuarioLogadoId) {
        verificarDonoDoAnuncio(anuncioImagem.getAnuncioId(), usuarioLogadoId);
        anuncioImagem.setCodStatus(true);
        return anuncioImagemRepository.save(anuncioImagem);
    }

    // Método responsável em listar a imagem do anúncio por ID

    public AnuncioImagem findById(Long id) {
        return anuncioImagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagem do anúncio não encontrada com o id " + id));
    }

    // Método responsável em atualizar a imagem do anúncio
    // A imagem continua no mesmo anúncio: o anuncioId do corpo é ignorado

    public AnuncioImagem update(Long id, AnuncioImagem anuncioImagem, Long usuarioLogadoId) {
        AnuncioImagem anuncioImagemExistente = findById(id);
        verificarDonoDoAnuncio(anuncioImagemExistente.getAnuncioId(), usuarioLogadoId);
        anuncioImagemExistente.setUrl(anuncioImagem.getUrl());
        anuncioImagemExistente.setPrincipal(anuncioImagem.isPrincipal());
        anuncioImagemExistente.setOrdem(anuncioImagem.getOrdem());
        return anuncioImagemRepository.save(anuncioImagemExistente);
    }

    // Método responsável em excluir a imagem do anúncio ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        AnuncioImagem anuncioImagemExistente = findById(id);
        verificarDonoDoAnuncio(anuncioImagemExistente.getAnuncioId(), usuarioLogadoId);
        anuncioImagemRepository.delete(anuncioImagemExistente);
    }

    // Só o dono do anúncio mexe nas fotos dele (senão 403)

    private void verificarDonoDoAnuncio(Long anuncioId, Long usuarioLogadoId) {
        if (anuncioId == null) {
            throw new IllegalArgumentException("Informe o anúncio da imagem.");
        }
        anuncioService.findDoDono(anuncioId, usuarioLogadoId);
    }
}
