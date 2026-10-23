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
 - Listas completas (GET /usuarios, /mensagens, /conversas etc.), escrita de categorias e criação de
   notificações: só ADMIN.
 - Todo o resto: precisa de token válido (401 se faltar ou for inválido).
 Quem é dono ou participa de cada registro é conferido nos services, com o id que vem do token (403).
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
                        // Listas completas: só ADMIN (cada usuário usa GET /{recurso}/meus)
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/usuarios", "/api/v1/anuncios", "/api/v1/favoritos",
                                "/api/v1/mensagens", "/api/v1/conversas", "/api/v1/propostas-troca",
                                "/api/v1/notificacoes", "/api/v1/denuncias", "/api/v1/avaliacoes",
                                "/api/v1/seguidores").hasRole("ADMIN")
                        // Categorias: leitura pública (acima), escrita só ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/v1/categorias").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/categorias/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/categorias/{id}").hasRole("ADMIN")
                        // Notificações são criadas pelo sistema/moderação, não por usuários comuns
                        .requestMatchers(HttpMethod.POST, "/api/v1/notificacoes").hasRole("ADMIN")
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
