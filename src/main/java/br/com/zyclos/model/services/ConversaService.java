package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Conversa;
import br.com.zyclos.model.repository.ConversaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConversaService {

    @Autowired // Injeção de dependência automática
    private ConversaRepository conversaRepository;

    // Método responsável em listar todas as conversas cadastradas no banco de dados (só ADMIN)

    public List<Conversa> findAll() {
        return conversaRepository.findAll();
    }

    // Método responsável em listar só as conversas de que o usuário logado participa

    public List<Conversa> findDoUsuario(Long usuarioLogadoId) {
        return conversaRepository.findByParticipanteAIdOrParticipanteBId(usuarioLogadoId, usuarioLogadoId);
    }

    // Método responsável em criar a conversa no banco de dados
    // Quem cria é sempre o participante A (vem do token); o participante B é a outra pessoa

    public Conversa save(Conversa conversa, Long usuarioLogadoId) {
        if (conversa.getParticipanteBId() == null) {
            throw new IllegalArgumentException("Informe com quem é a conversa (participanteBId).");
        }
        if (conversa.getParticipanteBId().equals(usuarioLogadoId)) {
            throw new IllegalArgumentException("Não é possível abrir uma conversa com você mesmo.");
        }
        conversa.setParticipanteAId(usuarioLogadoId);
        conversa.setDataCadastro(LocalDateTime.now());
        conversa.setCodStatus(true);
        return conversaRepository.save(conversa);
    }

    // Método responsável em listar a conversa por ID

    public Conversa findById(Long id) {
        return conversaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversa não encontrada com o id " + id));
    }

    // Método responsável em listar a conversa por ID, só para quem participa dela ou ADMIN (senão 403)

    public Conversa findComAcesso(Long id, Long usuarioLogadoId) {
        Conversa conversa = findById(id);
        UsuarioLogado.verificarAcesso(participa(conversa, usuarioLogadoId), "Você não participa desta conversa.");
        return conversa;
    }

    public boolean participa(Conversa conversa, Long usuarioId) {
        return usuarioId.equals(conversa.getParticipanteAId()) || usuarioId.equals(conversa.getParticipanteBId());
    }

    // Método responsável em atualizar a conversa (os participantes não mudam)

    public Conversa update(Long id, Conversa conversa, Long usuarioLogadoId) {
        Conversa conversaExistente = findComAcesso(id, usuarioLogadoId);
        conversaExistente.setAnuncioId(conversa.getAnuncioId());
        conversaExistente.setDataAtualizacao(LocalDateTime.now());
        return conversaRepository.save(conversaExistente);
    }

    // Método responsável em excluir a conversa ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        Conversa conversaExistente = findComAcesso(id, usuarioLogadoId);
        conversaRepository.delete(conversaExistente);
    }
}
