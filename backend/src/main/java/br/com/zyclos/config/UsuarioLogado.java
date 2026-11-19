package br.com.zyclos.config;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/*
 Ajuda os services a decidir quem pode mexer em cada registro.
 O usuário logado e o papel dele (ROLE_USUARIO / ROLE_ADMIN) foram definidos pelo JwtAuthenticationFilter.
*/

public final class UsuarioLogado {

    private UsuarioLogado() {
    }

    // true se o usuário do token tem tipoUsuario ADMIN

    public static boolean isAdmin() {
        Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
        return autenticacao != null && autenticacao.getAuthorities().stream()
                .anyMatch(papel -> papel.getAuthority().equals("ROLE_ADMIN"));
    }

    // Libera quem é dono/participante do registro ou ADMIN; os demais recebem 403

    public static void verificarAcesso(boolean donoOuParticipante, String mensagem) {
        if (!donoOuParticipante && !isAdmin()) {
            throw new AccessDeniedException(mensagem);
        }
    }
}
