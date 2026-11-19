package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    // SELECT * FROM mensagem WHERE conversa_id IN (...)
    List<Mensagem> findByConversaIdIn(Collection<Long> conversaIds);
}
