package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.model.PerfilUsuario;
import br.com.fusex28gac.fusex_backend.model.Usuario;
import br.com.fusex28gac.fusex_backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder){
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario criar(String nome, String login, String senha, PerfilUsuario perfil) {
        String loginNormalizado = normalizarLogin(login);
        String senhaCadastro = definirSenhaCadastro(loginNormalizado, senha);

        if(usuarioRepository.findByLogin(loginNormalizado).isPresent()){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setLogin(loginNormalizado);
        usuario.setSenhaHash(passwordEncoder.encode(senhaCadastro));
        usuario.setPerfil(perfil);
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }

    private String normalizarLogin(String login) {
        if(login == null || login.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o login");
        }

        String somenteNumeros = login.replaceAll("\\D", "");
        return somenteNumeros.isBlank() ? login.trim() : somenteNumeros;
    }

    private String definirSenhaCadastro(String login, String senha) {
        if(senha != null && !senha.isBlank()) {
            return senha;
        }

        if (login != null && login.length() >= 6) {
            return login.substring(0, 6);
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a senha inicial ou um CPF valido como Login");
    }

}
