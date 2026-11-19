package br.com.zyclos.model.dto;

/*
 Resposta do login: o token JWT (enviado depois em "Authorization: Bearer <token>") e os dados do usuário, sem senha.
*/

public record LoginDTO(
        String token,
        UsuarioDTO usuario
) {
}
