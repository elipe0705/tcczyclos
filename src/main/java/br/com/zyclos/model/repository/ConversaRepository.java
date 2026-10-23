package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Conversa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversaRepository extends JpaRepository<Conversa, Long> {

    // SELECT * FROM conversa WHERE participante_a_id = ? OR participante_b_id = ?
    List<Conversa> findByParticipanteAIdOrParticipanteBId(Long participanteAId, Long participanteBId);
}
