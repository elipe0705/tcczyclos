package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.PropostaTroca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropostaTrocaRepository extends JpaRepository<PropostaTroca, Long> {

    // SELECT * FROM proposta_troca WHERE proponente_id = ? OR destinatario_id = ?
    List<PropostaTroca> findByProponenteIdOrDestinatarioId(Long proponenteId, Long destinatarioId);
}
