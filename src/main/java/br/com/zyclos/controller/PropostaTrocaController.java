package br.com.zyclos.controller;

import br.com.zyclos.model.entity.PropostaTroca;
import br.com.zyclos.model.services.PropostaTrocaService;
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

 Lista completa (GET sem id): só ADMIN (regra em SecurityConfiguration).
 GET /meus: só os registros do usuário logado. GET/PUT/DELETE por id: só quem participa ou ADMIN (403).
*/

@RestController
@RequestMapping("/api/v1/propostas-troca")
public class PropostaTrocaController {

    @Autowired
    private PropostaTrocaService propostaTrocaService;

    @GetMapping
    public ResponseEntity<List<PropostaTroca>> findAll() {
        return ResponseEntity.ok(propostaTrocaService.findAll());
    }

    // Só os registros do usuário logado (o usuário vem do token, não da URL)

    @GetMapping("/meus")
    public ResponseEntity<List<PropostaTroca>> findMeus(@AuthenticationPrincipal Long usuarioLogadoId) {
        return ResponseEntity.ok(propostaTrocaService.findDoUsuario(usuarioLogadoId));
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody PropostaTroca propostaTroca, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            PropostaTroca novo = propostaTrocaService.save(propostaTroca, usuarioLogadoId);
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
    public ResponseEntity<Object> findById(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(propostaTrocaService.findComAcesso(Long.parseLong(id), usuarioLogadoId));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Proposta de troca não encontrada com o id " + id);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody PropostaTroca propostaTroca,
                                         @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            return ResponseEntity.ok(propostaTrocaService.update(Long.parseLong(id), propostaTroca, usuarioLogadoId));
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (IllegalArgumentException e) {
            return erro(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Dados inválidos: confira os campos obrigatórios e os ids relacionados");
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Proposta de troca não encontrada com o id " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id, @AuthenticationPrincipal Long usuarioLogadoId) {
        try {
            propostaTrocaService.delete(Long.parseLong(id), usuarioLogadoId);
            return ResponseEntity.ok().body(
                    Map.of(
                            "status", 200,
                            "message", "Proposta de troca excluída com sucesso"
                    )
            );
        } catch (NumberFormatException e) {
            return erro(HttpStatus.BAD_REQUEST, "O id informado não é válido: " + id);
        } catch (AccessDeniedException e) {
            return erro(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.CONFLICT, "Não é possível excluir: existem registros vinculados ao id " + id);
        } catch (RuntimeException e) {
            return erro(HttpStatus.NOT_FOUND, "Proposta de troca não encontrada com o id " + id);
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
