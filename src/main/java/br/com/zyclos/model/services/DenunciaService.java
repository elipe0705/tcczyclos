package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Denuncia;
import br.com.zyclos.model.repository.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DenunciaService {

    @Autowired // Injeção de dependência automática
    private DenunciaRepository denunciaRepository;

    // Método responsável em listar todas as denúncias cadastradas no banco de dados (só ADMIN)

    public List<Denuncia> findAll() {
        return denunciaRepository.findAll();
    }

    // Método responsável em listar só as denúncias feitas pelo usuário logado

    public List<Denuncia> findDoUsuario(Long usuarioLogadoId) {
        return denunciaRepository.findByDenuncianteId(usuarioLogadoId);
    }

    // Método responsável em criar a denúncia no banco de dados
    // O denunciante é sempre o usuário do token; status e moderação começam vazios (PENDENTE)

    public Denuncia save(Denuncia denuncia, Long usuarioLogadoId) {
        denuncia.setDenuncianteId(usuarioLogadoId);
        denuncia.setStatus("PENDENTE");
        denuncia.setRespostaModeracao(null);
        denuncia.setDataResolucao(null);
        denuncia.setDataCadastro(LocalDateTime.now());
        denuncia.setCodStatus(true);
        return denunciaRepository.save(denuncia);
    }

    // Método responsável em listar a denúncia por ID

    public Denuncia findById(Long id) {
        return denunciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada com o id " + id));
    }

    // Método responsável em listar a denúncia por ID, só para quem denunciou ou ADMIN (senão 403)

    public Denuncia findComAcesso(Long id, Long usuarioLogadoId) {
        Denuncia denuncia = findById(id);
        UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(denuncia.getDenuncianteId()),
                "Esta denúncia não é sua.");
        return denuncia;
    }

    // Método responsável em atualizar a denúncia
    // Quem denunciou edita o conteúdo; status, resposta e data de resolução são da moderação (só ADMIN)

    public Denuncia update(Long id, Denuncia denuncia, Long usuarioLogadoId) {
        Denuncia denunciaExistente = findComAcesso(id, usuarioLogadoId);
        denunciaExistente.setMotivo(denuncia.getMotivo());
        denunciaExistente.setDescricao(denuncia.getDescricao());
        denunciaExistente.setAnuncioId(denuncia.getAnuncioId());
        denunciaExistente.setUsuarioDenunciadoId(denuncia.getUsuarioDenunciadoId());
        if (UsuarioLogado.isAdmin()) {
            denunciaExistente.setStatus(denuncia.getStatus());
            denunciaExistente.setRespostaModeracao(denuncia.getRespostaModeracao());
            denunciaExistente.setDataResolucao(denuncia.getDataResolucao());
        }
        return denunciaRepository.save(denunciaExistente);
    }

    // Método responsável em excluir a denúncia ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        Denuncia denunciaExistente = findComAcesso(id, usuarioLogadoId);
        denunciaRepository.delete(denunciaExistente);
    }
}
