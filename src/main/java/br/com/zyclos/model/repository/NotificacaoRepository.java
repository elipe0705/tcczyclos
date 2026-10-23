package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    // SELECT * FROM notificacao WHERE usuario_id = ?
    List<Notificacao> findByUsuarioId(Long usuarioId);
}
