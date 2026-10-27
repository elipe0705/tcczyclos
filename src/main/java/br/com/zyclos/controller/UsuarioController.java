package br.com.zyclos.controller;

import br.com.zyclos.model.dto.LoginDTO;
import br.com.zyclos.model.dto.UsuarioDTO;
import br.com.zyclos.model.entity.Usuario;
import br.com.zyclos.model.services.TokenService;
import br.com.zyclos.model.services.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/*
 ResponseEntity: Toda resposta HTTP (status, cabeçalhos e corpo), aqui temos mais controle sobre o que é devolvido
                 para o cliente
 1. Status HTTP: (200 OK, 201 CREATED, 404 NOT FOUND etc...)
 2. Headers: ( cabeçalhos extras, como Location, Authorization etc...)
 3. Body: ( o objeto que será convertido em JSON/XML para o cliente )

 @RequestBody : Corpo da requisição (Recebendo um objeto JSON )
 @AuthenticationPrincipal : id do usuário logado, lido do token JWT (ver JwtAuthenticationFilter)
*/

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    // A resposta usa UsuarioDTO: nunca devolve a senha
    // Lista completa: só ADMIN (regra em SecurityConfiguration)

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> findAll() {
        return ResponseEntity.ok(usuarioService.findAll().stream().map(UsuarioDTO::de).toList());
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody Usuario usuario) {
        try {
            Usuario novo = usuarioService.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioDTO.de(novo));
        } catch (IllegalArgumentException e) {
            return erro(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            return erro(HttpStatus.CONFLICT, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        }
    }

    // Login: recebe { "email": "...", "senha": "..." } e devolve { "token": "...", "usuario": {...} } (sem a senha)

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> credenciais) {
        try {
            Usuario usuario = usuarioService.login(credenciais.get("email"), credenciais.get("senha"));
            return ResponseEntity.ok(new LoginDTO(tokenService.gerarToken(usuario), UsuarioDTO.de(usuario)));
        } catch (IllegalArgumentException e) {
            return erro(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        } catch (IllegalStateException e) {
            // 5 senhas erradas seguidas: e-mail bloqueado por 15 minutos
            return erro(HttpStatus.TOO_MANY_REQUESTS, e.getMessage());
        } catch (RuntimeException e) {
            // Qualquer outra falha (ex.: Supabase fora do ar) não é culpa do usuário: registra e devolve 503
            log.error("Erro ao fazer login", e);
            return erro(HttpStatus.SERVICE_UNAVAILABLE, "Serviço indisponível. Tente novamente em instantes.");
        }
    }

    // Perfil público (sem e-mail, senha nem tipo): rotas públicas, liberadas em SecurityConfiguration

    @GetMapping("/{id}/publico")
    public ResponseEntity<Object> findPublico(@PathVariable String id) {
        try {
            return ResponseEntity.ok(usuarioService.perfilPublicoPorId(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Usuário não encontrado com o id " + id);
        }
    }

    @GetMapping("/publico/{username}")
    public ResponseEntity<Object> findPublicoPorUsername(@PathVariable String username) {
        try {
            return ResponseEntity.ok(usuarioService.perfilPublicoPorUsername(username));
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Usuário não encontrado: " + username);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(UsuarioDTO.de(usuarioService.findProprio(Long.parseLong(id), usuarioLogadoId)));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Usuário não encontrado com o id " + id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody Usuario usuario,
                                         @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(UsuarioDTO.de(usuarioService.update(Long.parseLong(id), usuario, usuarioLogadoId)));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (IllegalArgumentException e) {
            return erro(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            return erro(HttpStatus.CONFLICT, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Usuário não encontrado com o id " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            usuarioService.delete(Long.parseLong(id), usuarioLogadoId);
            return ResponseEntity.ok().body(
                    Map.of(
                            "status", 200,
                            "message", "Usuário excluído com sucesso"
                    )
            );
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.CONFLICT, "Não é possível excluir: existem registros vinculados ao id " + id);
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Usuário não encontrado com o id " + id);
        }
    }

    private ResponseEntity<Object> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(
                Map.of(
                        "status", status.value(),
                        "error", status.getReasonPhrase(),
                        "message", mensagem
                )
        );
    }
}
