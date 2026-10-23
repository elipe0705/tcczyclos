package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // O Spring monta a consulta pelo nome do método: SELECT * FROM usuario WHERE email = ?
    Optional<Usuario> findByEmail(String email);

    boolean existsByUsername(String username);
}
