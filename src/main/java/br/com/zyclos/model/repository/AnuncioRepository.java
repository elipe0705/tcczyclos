package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    // SELECT * FROM anuncio WHERE status = ? AND cod_status = true
    List<Anuncio> findByStatusAndCodStatusTrue(String status);
}
