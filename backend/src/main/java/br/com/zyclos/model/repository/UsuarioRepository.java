package br.com.zyclos.model.repository;

import br.com.zyclos.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // O Spring monta a consulta pelo nome do método: SELECT * FROM usuario WHERE UPPER(email) = UPPER(?)
    // Ignora maiúsculas para achar contas antigas gravadas como "Ana@..." ao digitar "ana@..."
    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByUsername(String username);

    // SELECT * FROM usuario WHERE username = ? (perfil público pelo @username)
    Optional<Usuario> findByUsername(String username);

    // Username usado por outra conta (ao editar o perfil)
    boolean existsByUsernameAndIdNot(String username, Long id);
}
