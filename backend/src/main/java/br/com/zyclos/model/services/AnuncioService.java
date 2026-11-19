package br.com.zyclos.model.services;

import br.com.zyclos.model.dto.AnuncioCatalogoDTO;
import br.com.zyclos.model.entity.Anuncio;
import br.com.zyclos.model.entity.Usuario;
import br.com.zyclos.model.repository.AnuncioRepository;
import br.com.zyclos.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AnuncioService {

    @Autowired // Injeção de dependência automática
    private AnuncioRepository anuncioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método responsável em listar todos os anúncios cadastrados no banco de dados

    public List<Anuncio> findAll() {
        return anuncioRepository.findAll();
    }

    // Método responsável em montar o catálogo público: só anúncios ativos, com o nome de exibição do vendedor

    public List<AnuncioCatalogoDTO> findCatalogo() {
        List<Anuncio> anuncios = anuncioRepository.findByStatusAndCodStatusTrue("ATIVO");
        // Busca os vendedores de uma vez só (em vez de uma consulta por anúncio)
        Set<Long> vendedorIds = anuncios.stream().map(Anuncio::getVendedorId).collect(Collectors.toSet());
        Map<Long, Usuario> vendedores = usuarioRepository.findAllById(vendedorIds).stream()
                .collect(Collectors.toMap(Usuario::getId, usuario -> usuario));
        return anuncios.stream()
                .map(anuncio -> AnuncioCatalogoDTO.de(anuncio, vendedores.get(anuncio.getVendedorId())))
                .toList();
    }

    // Método responsável em criar o anúncio no banco de dados
    // O vendedor é sempre o usuário do token, nunca o vendedorId enviado no corpo

    public Anuncio save(Anuncio anuncio, Long usuarioLogadoId) {
        // O id é gerado pelo banco: um id no corpo faria o save() sobrescrever o registro de outra pessoa
        anuncio.setId(null);
        anuncio.setVendedorId(usuarioLogadoId);
        if (anuncio.getTipoNegociacao() == null) {
            anuncio.setTipoNegociacao("VENDA");
        }
        if (anuncio.getStatus() == null) {
            anuncio.setStatus("ATIVO");
        }
        validarStatus(anuncio.getStatus());
        anuncio.setVisualizacoes(0); // contador da API, não do vendedor
        anuncio.setDataAtualizacao(null);
        anuncio.setDataCadastro(LocalDateTime.now());
        anuncio.setCodStatus(true);
        return anuncioRepository.save(anuncio);
    }

    // Método responsável em listar o anúncio por ID

    public Anuncio findById(Long id) {
        return anuncioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anúncio não encontrado com o id " + id));
    }

    // Método responsável em buscar o anúncio garantindo que ele é do usuário logado (senão 403)

    public Anuncio findDoDono(Long id, Long usuarioLogadoId) {
        Anuncio anuncio = findById(id);
        if (!anuncio.getVendedorId().equals(usuarioLogadoId)) {
            throw new AccessDeniedException("Este anúncio não é seu.");
        }
        return anuncio;
    }

    // Método responsável em atualizar o anúncio (também usado para desativar: status INATIVO)
    // O vendedor não muda: vendedorId, visualizacoes e codStatus do corpo são ignorados

    public Anuncio update(Long id, Anuncio anuncio, Long usuarioLogadoId) {
        Anuncio anuncioExistente = findDoDono(id, usuarioLogadoId);
        anuncioExistente.setTitulo(anuncio.getTitulo());
        anuncioExistente.setDescricao(anuncio.getDescricao());
        anuncioExistente.setPreco(anuncio.getPreco());
        anuncioExistente.setMarca(anuncio.getMarca());
        anuncioExistente.setTamanho(anuncio.getTamanho());
        anuncioExistente.setCondicao(anuncio.getCondicao());
        anuncioExistente.setEstilo(anuncio.getEstilo());
        anuncioExistente.setCidade(anuncio.getCidade());
        anuncioExistente.setEstado(anuncio.getEstado());
        anuncioExistente.setTipoNegociacao(anuncio.getTipoNegociacao());
        if (anuncio.getStatus() != null) {
            validarStatus(anuncio.getStatus());
            anuncioExistente.setStatus(anuncio.getStatus());
        }
        anuncioExistente.setCategoriaId(anuncio.getCategoriaId());
        anuncioExistente.setDataAtualizacao(LocalDateTime.now());
        return anuncioRepository.save(anuncioExistente);
    }

    // O dono só alterna entre ATIVO e INATIVO (excluir pelo site = INATIVO)

    private void validarStatus(String status) {
        if (!status.equals("ATIVO") && !status.equals("INATIVO")) {
            throw new IllegalArgumentException("Status inválido: use ATIVO ou INATIVO.");
        }
    }

    // Método responsável em excluir o anúncio ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        Anuncio anuncioExistente = findDoDono(id, usuarioLogadoId);
        anuncioRepository.delete(anuncioExistente);
    }
}
