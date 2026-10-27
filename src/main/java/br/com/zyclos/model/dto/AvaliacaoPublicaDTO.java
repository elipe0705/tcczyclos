package br.com.zyclos.model.dto;

import br.com.zyclos.model.entity.Avaliacao;
import br.com.zyclos.model.entity.Usuario;

import java.time.LocalDateTime;

/*
 DTO (Data Transfer Object): uma avaliação como aparece no perfil público de quem foi avaliado.
 Do autor vão apenas id, nome e username.
*/

public record AvaliacaoPublicaDTO(
        Long id,
        int nota,
        String comentario,
        LocalDateTime dataCadastro,
        Long autorId,
        String autorNome,
        String autorUsername,
        Long anuncioId
) {

    // autor pode ser nulo se o usuário não existir mais

    public static AvaliacaoPublicaDTO de(Avaliacao avaliacao, Usuario autor) {
        return new AvaliacaoPublicaDTO(
                avaliacao.getId(),
                avaliacao.getNota(),
                avaliacao.getComentario(),
                avaliacao.getDataCadastro(),
                avaliacao.getAutorId(),
                autor == null ? null : autor.getNome(),
                autor == null ? null : autor.getUsername(),
                avaliacao.getAnuncioId()
        );
    }
}
