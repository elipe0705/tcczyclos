package br.com.zyclos.config;

import br.com.zyclos.model.repository.UsuarioRepository;
import br.com.zyclos.model.services.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Map;

/*
 Regras de acesso da API:
 - Públicas: cadastro, login, catálogo e detalhe do anúncio (com categorias e fotos, que o catálogo usa).
 - GET /usuarios e GET /favoritos (listas completas): só ADMIN.
 - Todo o resto: precisa de token válido (401 se faltar ou for inválido).
 Quem é dono de quê (anúncio, perfil, favorito) é conferido nos services, com o id que vem do token (403).
*/

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, TokenService tokenService,
                                           UsuarioRepository usuarioRepository, ObjectMapper objectMapper) throws Exception {
        http
                // API com token: sem sessão no servidor e sem CSRF (o CSRF protege cookies de sessão, que não usamos)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sessao -> sessao.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Usa as origens liberadas em CorsConfiguration
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(rotas -> rotas
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/usuarios", "/api/v1/usuarios/login").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/anuncios/catalogo", "/api/v1/anuncios/{id}",
                                "/api/v1/categorias", "/api/v1/categorias/{id}",
                                "/api/v1/anuncio-imagens", "/api/v1/anuncio-imagens/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios", "/api/v1/favoritos").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(erros -> erros
                        .authenticationEntryPoint((request, response, e) -> erro(response, objectMapper,
                                HttpStatus.UNAUTHORIZED, "Faça login para continuar."))
                        .accessDeniedHandler((request, response, e) -> erro(response, objectMapper,
                                HttpStatus.FORBIDDEN, "Você não tem permissão para acessar este recurso.")))
                .addFilterBefore(new JwtAuthenticationFilter(tokenService, usuarioRepository),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Mesmo formato de erro dos controllers: { status, error, message }

    private void erro(HttpServletResponse response, ObjectMapper objectMapper, HttpStatus status, String mensagem)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), Map.of(
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", mensagem
        ));
    }
}
