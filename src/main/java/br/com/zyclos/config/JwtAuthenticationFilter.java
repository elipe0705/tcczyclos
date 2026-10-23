package br.com.zyclos.config;

import br.com.zyclos.model.entity.Usuario;
import br.com.zyclos.model.repository.UsuarioRepository;
import br.com.zyclos.model.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/*
 Roda antes de cada requisição: lê o cabeçalho "Authorization: Bearer <token>", valida o token e,
 se estiver tudo certo, registra o usuário como autenticado. O id do usuário logado vem SEMPRE daqui,
 e chega nos controllers com @AuthenticationPrincipal Long usuarioLogadoId.
 Sem token (ou com token inválido) a requisição segue como anônima: as rotas protegidas respondem 401.
*/

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(TokenService tokenService, UsuarioRepository usuarioRepository) {
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String cabecalho = request.getHeader("Authorization");
        if (cabecalho != null && cabecalho.startsWith("Bearer ")) {
            Long usuarioId = tokenService.validarToken(cabecalho.substring(7));
            if (usuarioId != null) {
                // Confere no banco: conta excluída ou desativada perde o acesso mesmo com token válido
                usuarioRepository.findById(usuarioId)
                        .filter(Usuario::isCodStatus)
                        .ifPresent(this::autenticar);
            }
        }
        chain.doFilter(request, response);
    }

    // O papel (ROLE_USUARIO, ROLE_ADMIN) vem do campo tipoUsuario

    private void autenticar(Usuario usuario) {
        UsernamePasswordAuthenticationToken autenticacao = new UsernamePasswordAuthenticationToken(
                usuario.getId(), null, List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuario())));
        SecurityContextHolder.getContext().setAuthentication(autenticacao);
    }
}
