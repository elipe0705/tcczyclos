package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.Usuario;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/*
 JWT (JSON Web Token): depois do login, a API entrega um token assinado com o segredo do servidor.
 O token guarda o id do usuário (subject) e a data de expiração. Como só o servidor conhece o segredo,
 ninguém consegue alterar o id dentro do token sem invalidar a assinatura.
*/

@Service
public class TokenService {

    private final SecretKey chave;
    private final Duration validade;

    public TokenService(@Value("${zyclos.jwt.secret}") String segredo,
                        @Value("${zyclos.jwt.expiracao-horas}") long expiracaoHoras) {
        if (segredo == null || segredo.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("Defina a variável ZYCLOS_JWT_SECRET com 32 ou mais caracteres (veja .env.example)");
        }
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.validade = Duration.ofHours(expiracaoHoras);
    }

    // Método responsável em gerar o token do usuário que acabou de fazer login

    public String gerarToken(Usuario usuario) {
        Instant agora = Instant.now();
        return Jwts.builder()
                .subject(usuario.getId().toString())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plus(validade)))
                .signWith(chave)
                .compact();
    }

    // Método responsável em validar o token e devolver o id do usuário (null se for inválido ou expirado)

    public Long validarToken(String token) {
        try {
            String subject = Jwts.parser().verifyWith(chave).build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            return Long.valueOf(subject);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
