package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import br.com.fusex28gac.fusex_backend.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private BeneficiarioRepository repository;

    public Beneficiario login(String login, LocalDate dataNascimento){
        Optional<Beneficiario> user = repository.findByCpfOrPreccp(login, login);

        if(user.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        if(!user.get().getDataNascimento().equals(dataNascimento)) {
            throw new RuntimeException("Data de nascimento inválida");
        }

        return user.get();
    }

}
