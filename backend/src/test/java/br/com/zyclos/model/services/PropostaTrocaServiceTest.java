package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.PropostaTroca;
import br.com.zyclos.model.repository.PropostaTrocaRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/*
 Regras para responder uma proposta de troca (PropostaTrocaService.update), sem banco:
 os repositórios e o serviço de notificações são simulados pelo Mockito.
*/
@ExtendWith(MockitoExtension.class)
class PropostaTrocaServiceTest {

    private static final Long PROPONENTE = 1L;
    private static final Long DESTINATARIO = 2L;
    private static final Long OUTRO_USUARIO = 3L;

    @Mock
    private PropostaTrocaRepository propostaTrocaRepository;

    @Mock
    private NotificacaoService notificacaoService;

    @InjectMocks
    private PropostaTrocaService propostaTrocaService;

    private PropostaTroca existente;

    @BeforeEach
    void criarPropostaPendente() {
        existente = new PropostaTroca();
        existente.setId(10L);
        existente.setStatus("PENDENTE");
        existente.setProponenteId(PROPONENTE);
        existente.setDestinatarioId(DESTINATARIO);
        when(propostaTrocaRepository.findById(10L)).thenReturn(Optional.of(existente));
    }

    @AfterEach
    void limparLogin() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void destinatarioAceitaPropostaPendenteEAvisaOProponente() {
        logar(DESTINATARIO, "USUARIO");
        when(propostaTrocaRepository.save(any())).thenAnswer(chamada -> chamada.getArgument(0));

        PropostaTroca salva = propostaTrocaService.update(10L, comStatus("ACEITA"), DESTINATARIO);

        assertEquals("ACEITA", salva.getStatus());
        verify(notificacaoService).notificar(PROPONENTE, "Sua proposta de troca foi aceita", "TROCA", "/trocas");
    }

    @Test
    void destinatarioRecusaPropostaPendente() {
        logar(DESTINATARIO, "USUARIO");
        when(propostaTrocaRepository.save(any())).thenAnswer(chamada -> chamada.getArgument(0));

        PropostaTroca salva = propostaTrocaService.update(10L, comStatus("RECUSADA"), DESTINATARIO);

        assertEquals("RECUSADA", salva.getStatus());
        verify(notificacaoService).notificar(PROPONENTE, "Sua proposta de troca foi recusada", "TROCA", "/trocas");
    }

    @Test
    void statusInventadoGeraErroENaoSalva() {
        logar(DESTINATARIO, "USUARIO");

        assertThrows(IllegalArgumentException.class,
                () -> propostaTrocaService.update(10L, comStatus("CONCLUIDA"), DESTINATARIO));

        assertEquals("PENDENTE", existente.getStatus());
        verificarQueNadaFoiGravado();
    }

    @Test
    void propostaJaRespondidaNaoMudaDeNovo() {
        logar(DESTINATARIO, "USUARIO");
        existente.setStatus("ACEITA");

        assertThrows(IllegalArgumentException.class,
                () -> propostaTrocaService.update(10L, comStatus("RECUSADA"), DESTINATARIO));

        assertEquals("ACEITA", existente.getStatus());
        verificarQueNadaFoiGravado();
    }

    @Test
    void reenviarOMesmoStatusNaoRepeteONotificacao() {
        logar(DESTINATARIO, "USUARIO");
        existente.setStatus("ACEITA");
        when(propostaTrocaRepository.save(any())).thenAnswer(chamada -> chamada.getArgument(0));

        propostaTrocaService.update(10L, comStatus("ACEITA"), DESTINATARIO);

        verify(notificacaoService, never()).notificar(anyLong(), anyString(), anyString(), anyString());
    }

    @Test
    void proponenteNaoPodeAceitarAPropriaProposta() {
        logar(PROPONENTE, "USUARIO");

        assertThrows(AccessDeniedException.class,
                () -> propostaTrocaService.update(10L, comStatus("ACEITA"), PROPONENTE));

        verificarQueNadaFoiGravado();
    }

    @Test
    void quemNaoParticipaNaoPodeResponder() {
        logar(OUTRO_USUARIO, "USUARIO");

        assertThrows(AccessDeniedException.class,
                () -> propostaTrocaService.update(10L, comStatus("ACEITA"), OUTRO_USUARIO));

        verificarQueNadaFoiGravado();
    }

    // Simula o usuário do token, como faz o JwtAuthenticationFilter

    private void logar(Long usuarioId, String tipoUsuario) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                usuarioId, null, List.of(new SimpleGrantedAuthority("ROLE_" + tipoUsuario))));
    }

    private PropostaTroca comStatus(String status) {
        PropostaTroca corpo = new PropostaTroca();
        corpo.setStatus(status);
        return corpo;
    }

    private void verificarQueNadaFoiGravado() {
        verify(propostaTrocaRepository, never()).save(any());
        verify(notificacaoService, never()).notificar(anyLong(), anyString(), anyString(), anyString());
    }
}
