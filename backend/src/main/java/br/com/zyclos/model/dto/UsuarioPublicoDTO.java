package br.com.zyclos.model.dto;

import br.com.zyclos.model.entity.Usuario;

import java.time.LocalDateTime;

/*
 DTO (Data Transfer Object): o perfil público de um usuário, que qualquer pessoa pode ver.
 Nunca leva e-mail, senha nem tipoUsuario. Os totais são calculados pelo UsuarioService.
 mediaAvaliacoes é nula quando o usuário ainda não recebeu avaliações.
*/

public record UsuarioPublicoDTO(
        Long id,
        String nome,
        String username,
        String avatarUrl,
        String bio,
        String cidade,
        String estado,
        boolean verificado,
        LocalDateTime dataCadastro,
        long totalAnunciosAtivos,
        long totalSeguidores,
        long totalSeguindo,
        Double mediaAvaliacoes,
        long totalAvaliacoes
) {

    public static UsuarioPublicoDTO de(Usuario usuario, long totalAnunciosAtivos, long totalSeguidores,
                                       long totalSeguindo, Double mediaAvaliacoes, long totalAvaliacoes) {
        return new UsuarioPublicoDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getUsername(),
                usuario.getAvatarUrl(),
                usuario.getBio(),
                usuario.getCidade(),
                usuario.getEstado(),
                usuario.isVerificado(),
                usuario.getDataCadastro(),
                totalAnunciosAtivos,
                totalSeguidores,
                totalSeguindo,
                mediaAvaliacoes,
                totalAvaliacoes
        );
    }
}
