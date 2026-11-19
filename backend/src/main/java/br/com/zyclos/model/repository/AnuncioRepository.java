package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    // SELECT * FROM anuncio WHERE status = ? AND cod_status = true
    List<Anuncio> findByStatusAndCodStatusTrue(String status);

    // SELECT COUNT(*) FROM anuncio WHERE vendedor_id = ? AND status = ? AND cod_status = true
    long countByVendedorIdAndStatusAndCodStatusTrue(Long vendedorId, String status);
}
