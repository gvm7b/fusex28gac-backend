package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.LoginResponse;
import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import br.com.fusex28gac.fusex_backend.model.StatusCadastro;
import br.com.fusex28gac.fusex_backend.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private BeneficiarioRepository repository;

    public LoginResponse login(String login, LocalDate dataNascimento){
        String documento = normalizarDocumento(login);
        Optional<Beneficiario> user = repository.findByCpfOrPreccp(documento, documento);

        if(user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }

        if(!user.get().getDataNascimento().equals(dataNascimento)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Data de nascimento invalida");
        }

        if (Boolean.FALSE.equals(user.get().getAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cadastro inativo");
        }

        if (user.get().getStatusCadastro() != StatusCadastro.VALIDADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cadastro ainda não validado pelo FUSEX");
        }

        return new LoginResponse(
                user.get().getId(),
                user.get().getNomeCompleto(),
                user.get().getStatusCadastro()
        );
    }

    private String normalizarDocumento(String valor){
        if (valor == null){
            return null;
        }
        String normalizado = valor.replaceAll("\\D", "");
        return normalizado.isBlank() ? null : normalizado;
    }
}
