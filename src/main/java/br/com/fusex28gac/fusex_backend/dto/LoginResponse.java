package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.StatusCadastro;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String nomeCompleto;
    private StatusCadastro statusCadastro;
}
