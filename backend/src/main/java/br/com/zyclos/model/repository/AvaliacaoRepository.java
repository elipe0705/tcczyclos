package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    // SELECT * FROM avaliacao WHERE autor_id = ? OR avaliado_id = ?
    List<Avaliacao> findByAutorIdOrAvaliadoId(Long autorId, Long avaliadoId);

    // SELECT * FROM avaliacao WHERE avaliado_id = ? (avaliações recebidas)
    List<Avaliacao> findByAvaliadoId(Long avaliadoId);
}
