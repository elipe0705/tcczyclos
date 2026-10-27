package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Anuncio;
import br.com.zyclos.model.entity.PropostaTroca;
import br.com.zyclos.model.entity.Usuario;
import br.com.zyclos.model.repository.PropostaTrocaRepository;
import br.com.zyclos.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropostaTrocaService {

    @Autowired // Injeção de dependência automática
    private PropostaTrocaRepository propostaTrocaRepository;

    @Autowired
    private AnuncioService anuncioService;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método responsável em listar todas as propostas de troca cadastradas no banco de dados (só ADMIN)

    public List<PropostaTroca> findAll() {
        return propostaTrocaRepository.findAll();
    }

    // Método responsável em listar só as propostas que o usuário logado fez ou recebeu

    public List<PropostaTroca> findDoUsuario(Long usuarioLogadoId) {
        return propostaTrocaRepository.findByProponenteIdOrDestinatarioId(usuarioLogadoId, usuarioLogadoId);
    }

    // Método responsável em criar a proposta de troca no banco de dados
    // Proponente = usuário do token; destinatário = dono do anúncio desejado (nunca vêm do corpo)
    // O anúncio oferecido precisa ser do proponente

    public PropostaTroca save(PropostaTroca propostaTroca, Long usuarioLogadoId) {
        // O id é gerado pelo banco: um id no corpo faria o save() sobrescrever o registro de outra pessoa
        propostaTroca.setId(null);
        if (propostaTroca.getAnuncioDesejadoId() == null || propostaTroca.getAnuncioOferecidoId() == null) {
            throw new IllegalArgumentException("Informe o anúncio desejado e o anúncio oferecido.");
        }
        Anuncio desejado = anuncioService.findById(propostaTroca.getAnuncioDesejadoId());
        Anuncio oferecido = anuncioService.findById(propostaTroca.getAnuncioOferecidoId());
        if (!usuarioLogadoId.equals(oferecido.getVendedorId())) {
            throw new AccessDeniedException("Você só pode oferecer um anúncio seu.");
        }
        if (usuarioLogadoId.equals(desejado.getVendedorId())) {
            throw new IllegalArgumentException("Não é possível propor troca pelo seu próprio anúncio.");
        }
        propostaTroca.setProponenteId(usuarioLogadoId);
        propostaTroca.setDestinatarioId(desejado.getVendedorId());
        propostaTroca.setStatus("PENDENTE");
        propostaTroca.setDataAtualizacao(null);
        propostaTroca.setDataCadastro(LocalDateTime.now());
        propostaTroca.setCodStatus(true);
        PropostaTroca salva = propostaTrocaRepository.save(propostaTroca);
        // Avisa quem recebeu a proposta
        String nome = usuarioRepository.findById(usuarioLogadoId).map(Usuario::getNome).orElse("Alguém");
        notificacaoService.notificar(salva.getDestinatarioId(), nome + " enviou uma proposta de troca",
                "TROCA", "/trocas");
        return salva;
    }

    // Método responsável em listar a proposta de troca por ID

    public PropostaTroca findById(Long id) {
        return propostaTrocaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta de troca não encontrada com o id " + id));
    }

    // Método responsável em listar a proposta por ID, só para proponente, destinatário ou ADMIN (senão 403)

    public PropostaTroca findComAcesso(Long id, Long usuarioLogadoId) {
        PropostaTroca propostaTroca = findById(id);
        boolean participa = usuarioLogadoId.equals(propostaTroca.getProponenteId())
                || usuarioLogadoId.equals(propostaTroca.getDestinatarioId());
        UsuarioLogado.verificarAcesso(participa, "Você não participa desta proposta de troca.");
        return propostaTroca;
    }

    // Método responsável em atualizar a proposta de troca
    // O proponente edita a mensagem; só o destinatário (ou ADMIN) muda o status (aceitar/recusar).
    // Pessoas e anúncios da proposta não mudam

    public PropostaTroca update(Long id, PropostaTroca propostaTroca, Long usuarioLogadoId) {
        PropostaTroca propostaTrocaExistente = findComAcesso(id, usuarioLogadoId);
        if (usuarioLogadoId.equals(propostaTrocaExistente.getProponenteId())) {
            propostaTrocaExistente.setMensagem(propostaTroca.getMensagem());
        }
        if (propostaTroca.getStatus() != null && !propostaTroca.getStatus().equals(propostaTrocaExistente.getStatus())) {
            UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(propostaTrocaExistente.getDestinatarioId()),
                    "Só quem recebeu a proposta pode mudar o status.");
            propostaTrocaExistente.setStatus(propostaTroca.getStatus());
            // Avisa quem fez a proposta que ela foi aceita ou recusada
            if (propostaTroca.getStatus().equals("ACEITA") || propostaTroca.getStatus().equals("RECUSADA")) {
                String resultado = propostaTroca.getStatus().equals("ACEITA") ? "aceita" : "recusada";
                notificacaoService.notificar(propostaTrocaExistente.getProponenteId(),
                        "Sua proposta de troca foi " + resultado, "TROCA", "/trocas");
            }
        }
        propostaTrocaExistente.setDataAtualizacao(LocalDateTime.now());
        return propostaTrocaRepository.save(propostaTrocaExistente);
    }

    // Método responsável em excluir a proposta de troca ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        PropostaTroca propostaTrocaExistente = findComAcesso(id, usuarioLogadoId);
        propostaTrocaRepository.delete(propostaTrocaExistente);
    }
}
