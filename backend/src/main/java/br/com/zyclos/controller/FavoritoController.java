package br.com.zyclos.controller;

import br.com.zyclos.model.entity.Favorito;
import br.com.zyclos.model.services.FavoritoService;
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
@RequestMapping("/api/v1/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @GetMapping
    public ResponseEntity<List<Favorito>> findAll() {
        return ResponseEntity.ok(favoritoService.findAll());
    }

    // Favoritos do usuário logado (o usuário vem do token, não da URL)

    @GetMapping("/meus")
    public ResponseEntity<List<Favorito>> findMeus(@AuthenticationPrincipal Long usuarioLogadoId) {
        return ResponseEntity.ok(favoritoService.findByUsuarioId(usuarioLogadoId));
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody Favorito favorito, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            Favorito novo = favoritoService.save(favorito, usuarioLogadoId);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(favoritoService.findDoDono(Long.parseLong(id), usuarioLogadoId));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Favorito não encontrado com o id " + id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody Favorito favorito,
                                         @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(favoritoService.update(Long.parseLong(id), favorito, usuarioLogadoId));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Favorito não encontrado com o id " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            favoritoService.delete(Long.parseLong(id), usuarioLogadoId);
            return ResponseEntity.ok().body(
                    Map.of(
                            "status", 200,
                            "message", "Favorito excluído com sucesso"
                    )
            );
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.CONFLICT, "Não é possível excluir: existem registros vinculados ao id " + id);
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Favorito não encontrado com o id " + id);
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
