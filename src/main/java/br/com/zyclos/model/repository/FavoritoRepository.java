package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    // SELECT * FROM favorito WHERE usuario_id = ? AND anuncio_id = ?
    Optional<Favorito> findByUsuarioIdAndAnuncioId(Long usuarioId, Long anuncioId);

    // SELECT * FROM favorito WHERE usuario_id = ?
    List<Favorito> findByUsuarioId(Long usuarioId);
}
