package br.com.zyclos.model.dto;

import br.com.zyclos.model.entity.Usuario;

import java.time.LocalDateTime;

/*
 DTO (Data Transfer Object): o usuário como é devolvido pela API, sem o campo senha (nem o hash).
*/

public record UsuarioDTO(
        Long id,
        String nome,
        String username,
        String email,
        String avatarUrl,
        String bio,
        String cidade,
        String estado,
        String tipoUsuario,
        boolean verificado,
        LocalDateTime dataCadastro,
        boolean codStatus
) {

    public static UsuarioDTO de(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getAvatarUrl(),
                usuario.getBio(),
                usuario.getCidade(),
                usuario.getEstado(),
                usuario.getTipoUsuario(),
                usuario.isVerificado(),
                usuario.getDataCadastro(),
                usuario.isCodStatus()
        );
    }
}
