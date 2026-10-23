package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Conversa;
import br.com.zyclos.model.entity.Mensagem;
import br.com.zyclos.model.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MensagemService {

    @Autowired // Injeção de dependência automática
    private MensagemRepository mensagemRepository;

    @Autowired
    private ConversaService conversaService;

    // Método responsável em listar todas as mensagens cadastradas no banco de dados (só ADMIN)

    public List<Mensagem> findAll() {
        return mensagemRepository.findAll();
    }

    // Método responsável em listar só as mensagens das conversas de que o usuário logado participa

    public List<Mensagem> findDoUsuario(Long usuarioLogadoId) {
        List<Long> conversaIds = conversaService.findDoUsuario(usuarioLogadoId).stream()
                .map(Conversa::getId)
                .toList();
        return conversaIds.isEmpty() ? List.of() : mensagemRepository.findByConversaIdIn(conversaIds);
    }

    // Método responsável em criar a mensagem no banco de dados
    // O remetente é sempre o usuário do token, e ele precisa participar da conversa

    public Mensagem save(Mensagem mensagem, Long usuarioLogadoId) {
        // O id é gerado pelo banco: um id no corpo faria o save() sobrescrever o registro de outra pessoa
        mensagem.setId(null);
        if (mensagem.getConversaId() == null) {
            throw new IllegalArgumentException("Informe a conversa da mensagem (conversaId).");
        }
        Conversa conversa = conversaService.findById(mensagem.getConversaId());
        if (!conversaService.participa(conversa, usuarioLogadoId)) {
            throw new AccessDeniedException("Você não participa desta conversa.");
        }
        mensagem.setRemetenteId(usuarioLogadoId);
        mensagem.setLida(false);
        mensagem.setDataEnvio(LocalDateTime.now());
        mensagem.setCodStatus(true);
        return mensagemRepository.save(mensagem);
    }

    // Método responsável em listar a mensagem por ID

    public Mensagem findById(Long id) {
        return mensagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada com o id " + id));
    }

    // Método responsável em listar a mensagem por ID, só para quem participa da conversa ou ADMIN (senão 403)

    public Mensagem findComAcesso(Long id, Long usuarioLogadoId) {
        Mensagem mensagem = findById(id);
        Conversa conversa = conversaService.findById(mensagem.getConversaId());
        UsuarioLogado.verificarAcesso(conversaService.participa(conversa, usuarioLogadoId),
                "Você não participa desta conversa.");
        return mensagem;
    }

    // Método responsável em atualizar a mensagem
    // Só quem enviou muda o texto; os participantes podem marcar como lida. Conversa e remetente não mudam

    public Mensagem update(Long id, Mensagem mensagem, Long usuarioLogadoId) {
        Mensagem mensagemExistente = findComAcesso(id, usuarioLogadoId);
        if (usuarioLogadoId.equals(mensagemExistente.getRemetenteId())) {
            mensagemExistente.setConteudo(mensagem.getConteudo());
        }
        mensagemExistente.setLida(mensagem.isLida());
        return mensagemRepository.save(mensagemExistente);
    }

    // Método responsável em excluir a mensagem ( exclusão física ): só quem enviou ou ADMIN

    public void delete(Long id, Long usuarioLogadoId) {
        Mensagem mensagemExistente = findById(id);
        UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(mensagemExistente.getRemetenteId()),
                "Só quem enviou pode apagar a mensagem.");
        mensagemRepository.delete(mensagemExistente);
    }
}
