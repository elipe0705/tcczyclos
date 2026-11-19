package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {

    // SELECT * FROM denuncia WHERE denunciante_id = ?
    List<Denuncia> findByDenuncianteId(Long denuncianteId);
}
