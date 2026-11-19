package br.com.zyclos.model.dto;

import br.com.zyclos.model.entity.Anuncio;
import br.com.zyclos.model.entity.Usuario;

import java.time.LocalDateTime;

/*
 DTO (Data Transfer Object): só os dados que o catálogo do site precisa.
 Do vendedor vão apenas nome, username e verificado; e-mail, senha e cidade dele nunca saem daqui.
 A cidade/estado abaixo são os do anúncio.
*/

public record AnuncioCatalogoDTO(
        Long id,
        String titulo,
        String descricao,
        Double preco,
        String marca,
        String tamanho,
        String condicao,
        String estilo,
        String cidade,
        String estado,
        String tipoNegociacao,
        String status,
        LocalDateTime dataCadastro,
        Long categoriaId,
        Long vendedorId,
        String vendedorNome,
        String vendedorUsername,
        boolean vendedorVerificado
) {

    // vendedor pode ser nulo se o usuário não existir mais

    public static AnuncioCatalogoDTO de(Anuncio anuncio, Usuario vendedor) {
        return new AnuncioCatalogoDTO(
                anuncio.getId(),
                anuncio.getTitulo(),
                anuncio.getDescricao(),
                anuncio.getPreco(),
                anuncio.getMarca(),
                anuncio.getTamanho(),
                anuncio.getCondicao(),
                anuncio.getEstilo(),
                anuncio.getCidade(),
                anuncio.getEstado(),
                anuncio.getTipoNegociacao(),
                anuncio.getStatus(),
                anuncio.getDataCadastro(),
                anuncio.getCategoriaId(),
                anuncio.getVendedorId(),
                vendedor == null ? null : vendedor.getNome(),
                vendedor == null ? null : vendedor.getUsername(),
                vendedor != null && vendedor.isVerificado()
        );
    }
}
