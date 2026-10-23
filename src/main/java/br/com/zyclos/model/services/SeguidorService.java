package br.com.zyclos.model.services;

import br.com.zyclos.config.UsuarioLogado;
import br.com.zyclos.model.entity.Seguidor;
import br.com.zyclos.model.repository.SeguidorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SeguidorService {

    @Autowired // Injeção de dependência automática
    private SeguidorRepository seguidorRepository;

    // Método responsável em listar todos os seguidores cadastrados no banco de dados (só ADMIN)

    public List<Seguidor> findAll() {
        return seguidorRepository.findAll();
    }

    // Método responsável em listar quem o usuário logado segue e quem segue o usuário logado

    public List<Seguidor> findDoUsuario(Long usuarioLogadoId) {
        return seguidorRepository.findBySeguidorIdOrSeguidoId(usuarioLogadoId, usuarioLogadoId);
    }

    // Método responsável em criar o seguidor no banco de dados
    // Quem segue é sempre o usuário do token; o seguido é a outra pessoa

    public Seguidor save(Seguidor seguidor, Long usuarioLogadoId) {
        // O id é gerado pelo banco: um id no corpo faria o save() sobrescrever o registro de outra pessoa
        seguidor.setId(null);
        validarSeguido(seguidor.getSeguidoId(), usuarioLogadoId);
        seguidor.setSeguidorId(usuarioLogadoId);
        seguidor.setDataCadastro(LocalDateTime.now());
        seguidor.setCodStatus(true);
        return seguidorRepository.save(seguidor);
    }

    // Método responsável em listar o seguidor por ID

    public Seguidor findById(Long id) {
        return seguidorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seguidor não encontrado com o id " + id));
    }

    // Método responsável em listar o seguidor por ID, só para quem segue, quem é seguido ou ADMIN (senão 403)

    public Seguidor findComAcesso(Long id, Long usuarioLogadoId) {
        Seguidor seguidor = findById(id);
        boolean participa = usuarioLogadoId.equals(seguidor.getSeguidorId())
                || usuarioLogadoId.equals(seguidor.getSeguidoId());
        UsuarioLogado.verificarAcesso(participa, "Você não faz parte desta relação de seguidor.");
        return seguidor;
    }

    // Método responsável em atualizar o seguidor: só quem segue (ou ADMIN) troca o seguido

    public Seguidor update(Long id, Seguidor seguidor, Long usuarioLogadoId) {
        Seguidor seguidorExistente = findById(id);
        UsuarioLogado.verificarAcesso(usuarioLogadoId.equals(seguidorExistente.getSeguidorId()),
                "Só quem segue pode alterar.");
        validarSeguido(seguidor.getSeguidoId(), seguidorExistente.getSeguidorId());
        seguidorExistente.setSeguidoId(seguidor.getSeguidoId());
        return seguidorRepository.save(seguidorExistente);
    }

    // Método responsável em excluir o seguidor ( exclusão física ): deixar de seguir ou remover um seguidor

    public void delete(Long id, Long usuarioLogadoId) {
        Seguidor seguidorExistente = findComAcesso(id, usuarioLogadoId);
        seguidorRepository.delete(seguidorExistente);
    }

    private void validarSeguido(Long seguidoId, Long seguidorId) {
        if (seguidoId == null) {
            throw new IllegalArgumentException("Informe quem será seguido (seguidoId).");
        }
        if (seguidoId.equals(seguidorId)) {
            throw new IllegalArgumentException("Não é possível seguir você mesmo.");
        }
    }
}
