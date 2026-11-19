package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Seguidor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeguidorRepository extends JpaRepository<Seguidor, Long> {

    // SELECT * FROM seguidor WHERE seguidor_id = ? OR seguido_id = ?
    List<Seguidor> findBySeguidorIdOrSeguidoId(Long seguidorId, Long seguidoId);

    // SELECT COUNT(*) FROM seguidor WHERE seguido_id = ? (seguidores do usuário)
    long countBySeguidoId(Long seguidoId);

    // SELECT COUNT(*) FROM seguidor WHERE seguidor_id = ? (quantos o usuário segue)
    long countBySeguidorId(Long seguidorId);
}
