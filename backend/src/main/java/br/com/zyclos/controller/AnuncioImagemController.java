package br.com.zyclos.controller;

import br.com.zyclos.model.entity.AnuncioImagem;
import br.com.zyclos.model.services.AnuncioImagemService;
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
@RequestMapping("/api/v1/anuncio-imagens")
public class AnuncioImagemController {

    @Autowired
    private AnuncioImagemService anuncioImagemService;

    @GetMapping
    public ResponseEntity<List<AnuncioImagem>> findAll() {
        return ResponseEntity.ok(anuncioImagemService.findAll());
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody AnuncioImagem anuncioImagem,
                                       @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            AnuncioImagem novo = anuncioImagemService.save(anuncioImagem, usuarioLogadoId);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (IllegalArgumentException e) {
            return erro(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(anuncioImagemService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Imagem do anúncio não encontrada com o id " + id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody AnuncioImagem anuncioImagem,
                                         @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(anuncioImagemService.update(Long.parseLong(id), anuncioImagem, usuarioLogadoId));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Imagem do anúncio não encontrada com o id " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            anuncioImagemService.delete(Long.parseLong(id), usuarioLogadoId);
            return ResponseEntity.ok().body(
                    Map.of(
                            "status", 200,
                            "message", "Imagem do anúncio excluída com sucesso"
                    )
            );
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.CONFLICT, "Não é possível excluir: existem registros vinculados ao id " + id);
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Imagem do anúncio não encontrada com o id " + id);
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
