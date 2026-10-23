package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Avaliacao;
import br.com.zyclos.model.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvaliacaoService {

    @Autowired // Injeção de dependência automática
    private AvaliacaoRepository avaliacaoRepository;

    // Método responsável em listar todas as avaliações cadastradas no banco de dados (só ADMIN)

    public List<Avaliacao> findAll() {
        return avaliacaoRepository.findAll();
    }

    // Método responsável em listar só as avaliações que o usuário logado fez ou recebeu

    public List<Avaliacao> findDoUsuario(Long usuarioLogadoId) {
        return avaliacaoRepository.findByAutorIdOrAvaliadoId(usuarioLogadoId, usuarioLogadoId);
    }

    // Método responsável em criar a avaliação no banco de dados
    // O autor é sempre o usuário do token; o avaliado é a outra pessoa

    public Avaliacao save(Avaliacao avaliacao, Long usuarioLogadoId) {
        if (avaliacao.getAvaliadoId() == null) {
            throw new IllegalArgumentException("Informe quem está sendo avaliado (avaliadoId).");
        }
        if (avaliacao.getAvaliadoId().equals(usuarioLogadoId)) {
            throw new IllegalArgumentException("Não é possível avaliar você mesmo.");
        }
        avaliacao.setAutorId(usuarioLogadoId);
        avaliacao.setDataCadastro(LocalDateTime.now());
        avaliacao.setCodStatus(true);
        return avaliacaoRepository.save(avaliacao);
    }

    // Método responsável em listar a avaliação por ID

    public Avaliacao findById(Long id) {
        return avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada com o id " + id));
    }

    // Método responsável em listar a avaliação por ID, só para autor, avaliado ou ADMIN (senão 403)

    public Avaliacao findComAcesso(Long id, Long usuarioLogadoId) {
        Avaliacao avaliacao = findById(id);
        boolean participa = usuarioLogadoId.equals(avaliacao.getAutorId())
                || usuarioLogadoId.equals(avaliacao.getAvaliadoId());
        UsuarioLogado.verificarAcesso(participa, "Você não participa desta avaliação.");
        return avaliacao;
    }

    // Método responsável em atualizar a avaliação: só o autor (ou ADMIN) muda nota e comentário

    public Avaliacao update(Long id, Avaliacao avaliacao, Long usuarioLogadoId) {
        Avaliacao avaliacaoExistente = findById(id);
        UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(avaliacaoExistente.getAutorId()),
                "Só quem escreveu a avaliação pode alterá-la.");
        avaliacaoExistente.setNota(avaliacao.getNota());
        avaliacaoExistente.setComentario(avaliacao.getComentario());
        return avaliacaoRepository.save(avaliacaoExistente);
    }

    // Método responsável em excluir a avaliação ( exclusão física ): só o autor ou ADMIN

    public void delete(Long id, Long usuarioLogadoId) {
        Avaliacao avaliacaoExistente = findById(id);
        UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(avaliacaoExistente.getAutorId()),
                "Só quem escreveu a avaliação pode excluí-la.");
        avaliacaoRepository.delete(avaliacaoExistente);
    }
}
