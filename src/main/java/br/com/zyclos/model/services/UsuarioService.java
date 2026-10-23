package br.com.zyclos.model.services;

import br.com.zyclos.model.entity.Usuario;
import br.com.zyclos.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UsuarioService {

    // Limite de tentativas de login: depois de 5 senhas erradas seguidas para o mesmo e-mail, bloqueia por 15 min.
    // Fica em memória (zera quando a API reinicia), guardado por e-mail já em minúsculas
    private static final int MAXIMO_TENTATIVAS_LOGIN = 5;
    private static final Duration TEMPO_BLOQUEIO_LOGIN = Duration.ofMinutes(15);
    private static final Map<String, TentativasLogin> TENTATIVAS_LOGIN = new ConcurrentHashMap<>();

    private record TentativasLogin(int falhas, Instant bloqueadoAte) {
    }

    @Autowired // Injeção de dependência automática
    private UsuarioRepository usuarioRepository;

    @Autowired // BCrypt, configurado em SenhaConfiguration
    private PasswordEncoder passwordEncoder;

    // Método responsável em listar todos os usuários cadastrados no banco de dados

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    // Método responsável em criar o usuário no banco de dados
    // IllegalArgumentException = dado inválido (400); IllegalStateException = e-mail/username já usado (409)

    public Usuario save(Usuario usuario) {
        usuario.setEmail(normalizarEmail(usuario.getEmail()));
        validarCampo(usuario.getNome(), "O nome", 100, true);
        validarCampo(usuario.getUsername(), "O nome de usuário", 30, true);
        validarCampo(usuario.getEmail(), "O e-mail", 255, true);
        validarSenha(usuario.getSenha());
        validarCampo(usuario.getAvatarUrl(), "O link da foto", 500, false);
        if (usuarioRepository.findByEmailIgnoreCase(usuario.getEmail()).isPresent()) {
            throw new IllegalStateException("Este e-mail já está cadastrado.");
        }
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalStateException("Este nome de usuário já está em uso.");
        }
        // Quem se cadastra pelo site é sempre usuário comum e não verificado (ADMIN só direto no banco)
        usuario.setTipoUsuario("USUARIO");
        usuario.setVerificado(false);
        usuario.setDataCadastro(LocalDateTime.now());
        usuario.setCodStatus(true);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    // Método responsável em listar o usuário por ID

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id " + id));
    }

    // Método responsável em listar o próprio usuário (o id do token precisa ser o mesmo da URL, senão 403)

    public Usuario findProprio(Long id, Long usuarioLogadoId) {
        verificarProprio(id, usuarioLogadoId);
        return findById(id);
    }

    // Método responsável em atualizar o usuário
    // tipoUsuario e verificado não mudam por aqui: senão qualquer um viraria ADMIN

    // Senha nula ou em branco mantém a atual; uma nova senha é gravada como hash

    public Usuario update(Long id, Usuario usuario, Long usuarioLogadoId) {
        verificarProprio(id, usuarioLogadoId);
        Usuario usuarioExistente = findById(id);
        String email = normalizarEmail(usuario.getEmail());
        boolean emailDeOutraConta = usuarioRepository.findByEmailIgnoreCase(email)
                .filter(outro -> !outro.getId().equals(id))
                .isPresent();
        if (emailDeOutraConta) {
            throw new IllegalStateException("Este e-mail já está cadastrado.");
        }
        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setUsername(usuario.getUsername());
        usuarioExistente.setEmail(email);
        if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
            validarSenha(usuario.getSenha());
            usuarioExistente.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        usuarioExistente.setAvatarUrl(usuario.getAvatarUrl());
        usuarioExistente.setBio(usuario.getBio());
        usuarioExistente.setCidade(usuario.getCidade());
        usuarioExistente.setEstado(usuario.getEstado());
        return usuarioRepository.save(usuarioExistente);
    }

    // Método responsável em excluir o usuário ( exclusão física )

    public void delete(Long id, Long usuarioLogadoId) {
        verificarProprio(id, usuarioLogadoId);
        Usuario usuarioExistente = findById(id);
        usuarioRepository.delete(usuarioExistente);
    }

    // Método responsável em validar o login (e-mail e senha) do usuário
    // Credenciais erradas geram IllegalArgumentException; falhas do banco seguem como outras exceções

    // E-mail bloqueado por excesso de tentativas gera IllegalStateException (429)

    public Usuario login(String email, String senha) {
        String emailNormalizado = normalizarEmail(email);
        if (emailNormalizado == null) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }
        verificarBloqueioLogin(emailNormalizado);
        try {
            Usuario usuario = conferirCredenciais(emailNormalizado, senha);
            TENTATIVAS_LOGIN.remove(emailNormalizado); // acertou: zera o contador
            return usuario;
        } catch (IllegalArgumentException e) {
            registrarFalhaLogin(emailNormalizado);
            throw e;
        }
    }

    private Usuario conferirCredenciais(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));
        if (!usuario.isCodStatus() || senha == null) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }
        String senhaGravada = usuario.getSenha();
        if (isHashBCrypt(senhaGravada)) {
            if (!passwordEncoder.matches(senha, senhaGravada)) {
                throw new IllegalArgumentException("E-mail ou senha inválidos");
            }
            return usuario;
        }
        // MIGRAÇÃO TEMPORÁRIA: contas criadas antes do BCrypt guardam a senha em texto puro.
        // Se a senha confere, troca pelo hash e salva. Remover quando nenhuma conta tiver senha em texto puro.
        if (!senhaGravada.equals(senha)) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }
        usuario.setSenha(passwordEncoder.encode(senha));
        return usuarioRepository.save(usuario);
    }

    private void verificarBloqueioLogin(String email) {
        TentativasLogin tentativas = TENTATIVAS_LOGIN.get(email);
        if (tentativas == null || tentativas.bloqueadoAte() == null) {
            return;
        }
        Instant agora = Instant.now();
        if (agora.isBefore(tentativas.bloqueadoAte())) {
            long minutos = (Duration.between(agora, tentativas.bloqueadoAte()).toSeconds() + 59) / 60;
            throw new IllegalStateException("Muitas tentativas de login sem sucesso. Tente novamente em "
                    + minutos + " minuto(s).");
        }
        TENTATIVAS_LOGIN.remove(email); // o bloqueio acabou: começa a contar do zero
    }

    private void registrarFalhaLogin(String email) {
        TENTATIVAS_LOGIN.compute(email, (chave, atual) -> {
            int falhas = (atual == null ? 0 : atual.falhas()) + 1;
            Instant bloqueadoAte = falhas >= MAXIMO_TENTATIVAS_LOGIN ? Instant.now().plus(TEMPO_BLOQUEIO_LOGIN) : null;
            return new TentativasLogin(falhas, bloqueadoAte);
        });
    }

    // Só o próprio usuário mexe no seu perfil

    private void verificarProprio(Long id, Long usuarioLogadoId) {
        if (!id.equals(usuarioLogadoId)) {
            throw new AccessDeniedException("Você só pode acessar o seu próprio perfil.");
        }
    }

    // Hash BCrypt começa com $2a$, $2b$ ou $2y$

    private boolean isHashBCrypt(String senha) {
        return senha.startsWith("$2a$") || senha.startsWith("$2b$") || senha.startsWith("$2y$");
    }

    // E-mail sempre sem espaços nas pontas e em minúsculas

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    // O BCrypt só aceita senhas de até 72 bytes

    private void validarSenha(String senha) {
        validarCampo(senha, "A senha", 72, true);
        if (senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("A senha deve ter no máximo 72 caracteres (acentos contam em dobro).");
        }
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
