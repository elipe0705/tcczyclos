package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.Usuario;
import br.com.zyclos.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired // Injeção de dependência automática
    private UsuarioRepository usuarioRepository;

    // Método responsável em listar todos os usuários cadastrados no banco de dados

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    // Método responsável em criar o usuário no banco de dados
    // IllegalArgumentException = dado inválido (400); IllegalStateException = e-mail/username já usado (409)

    public Usuario save(Usuario usuario) {
        validarCampo(usuario.getNome(), "O nome", 100, true);
        validarCampo(usuario.getUsername(), "O nome de usuário", 30, true);
        validarCampo(usuario.getEmail(), "O e-mail", 255, true);
        validarCampo(usuario.getSenha(), "A senha", 255, true);
        validarCampo(usuario.getAvatarUrl(), "O link da foto", 500, false);
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalStateException("Este e-mail já está cadastrado.");
        }
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalStateException("Este nome de usuário já está em uso.");
        }
        if (usuario.getTipoUsuario() == null) {
            usuario.setTipoUsuario("USUARIO");
        }
        usuario.setDataCadastro(LocalDateTime.now());
        usuario.setCodStatus(true);
        return usuarioRepository.save(usuario);
    }

    // Método responsável em listar o usuário por ID

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id " + id));
    }

    // Método responsável em atualizar o usuário

    public Usuario update(Long id, Usuario usuario) {
        Usuario usuarioExistente = findById(id);
        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setUsername(usuario.getUsername());
        usuarioExistente.setEmail(usuario.getEmail());
        if (usuario.getSenha() != null) {
            usuarioExistente.setSenha(usuario.getSenha());
        }
        usuarioExistente.setAvatarUrl(usuario.getAvatarUrl());
        usuarioExistente.setBio(usuario.getBio());
        usuarioExistente.setCidade(usuario.getCidade());
        usuarioExistente.setEstado(usuario.getEstado());
        usuarioExistente.setTipoUsuario(usuario.getTipoUsuario());
        usuarioExistente.setVerificado(usuario.isVerificado());
        return usuarioRepository.save(usuarioExistente);
    }

    // Método responsável em excluir o usuário ( exclusão física )

    public void delete(Long id) {
        Usuario usuarioExistente = findById(id);
        usuarioRepository.delete(usuarioExistente);
    }

    // Método responsável em validar o login (e-mail e senha) do usuário
    // Credenciais erradas geram IllegalArgumentException; falhas do banco seguem como outras exceções

    public Usuario login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));
        if (!usuario.isCodStatus() || !usuario.getSenha().equals(senha)) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }
        return usuario;
    }

    // Confere campo obrigatório e tamanho máximo da coluna no banco

    private void validarCampo(String valor, String campo, int tamanhoMaximo, boolean obrigatorio) {
        if (valor == null || valor.isBlank()) {
            if (obrigatorio) {
                throw new IllegalArgumentException(campo + " é obrigatório.");
            }
            return;
        }
        if (valor.length() > tamanhoMaximo) {
            throw new IllegalArgumentException(campo + " deve ter no máximo " + tamanhoMaximo + " caracteres.");
        }
    }
}
