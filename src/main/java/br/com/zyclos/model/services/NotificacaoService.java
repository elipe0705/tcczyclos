package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Notificacao;
import br.com.zyclos.model.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacaoService {

    @Autowired // Injeção de dependência automática
    private NotificacaoRepository notificacaoRepository;

    // Método responsável em listar todas as notificações cadastradas no banco de dados (só ADMIN)

    public List<Notificacao> findAll() {
        return notificacaoRepository.findAll();
    }

    // Método responsável em listar só as notificações do usuário logado

    public List<Notificacao> findDoUsuario(Long usuarioLogadoId) {
        return notificacaoRepository.findByUsuarioId(usuarioLogadoId);
    }

    // Método responsável em criar a notificação no banco de dados
    // Só ADMIN cria pela API (regra em SecurityConfiguration), por isso o usuarioId do corpo é aceito aqui

    public Notificacao save(Notificacao notificacao) {
        // O id é gerado pelo banco: um id no corpo faria o save() sobrescrever o registro de outra pessoa
        notificacao.setId(null);
        if (notificacao.getTipo() == null) {
            notificacao.setTipo("SISTEMA");
        }
        notificacao.setDataCadastro(LocalDateTime.now());
        notificacao.setCodStatus(true);
        return notificacaoRepository.save(notificacao);
    }

    // Método responsável em listar a notificação por ID

    public Notificacao findById(Long id) {
        return notificacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada com o id " + id));
    }

    // Método responsável em listar a notificação por ID, só para o dono ou ADMIN (senão 403)

    public Notificacao findComAcesso(Long id, Long usuarioLogadoId) {
        Notificacao notificacao = findById(id);
        UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(notificacao.getUsuarioId()),
                "Esta notificação não é sua.");
        return notificacao;
    }

    // Método responsável em atualizar a notificação
    // O dono só marca como lida; texto, tipo e destino só o ADMIN muda. O destinatário não muda

    public Notificacao update(Long id, Notificacao notificacao, Long usuarioLogadoId) {
        Notificacao notificacaoExistente = findComAcesso(id, usuarioLogadoId);
        notificacaoExistente.setLida(notificacao.isLida());
        if (UsuarioLogado.isAdmin()) {
            notificacaoExistente.setTexto(notificacao.getTexto());
            notificacaoExistente.setTipo(notificacao.getTipo());
            notificacaoExistente.setDestino(notificacao.getDestino());
        }
        return notificacaoRepository.save(notificacaoExistente);
    }

    // Método responsável em excluir a notificação ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        Notificacao notificacaoExistente = findComAcesso(id, usuarioLogadoId);
        notificacaoRepository.delete(notificacaoExistente);
    }
}
