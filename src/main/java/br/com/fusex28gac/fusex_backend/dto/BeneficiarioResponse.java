package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.StatusCadastro;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class BeneficiarioResponse {
    private UUID id;
    private String nomeCompleto;
    private String cpf;
    private String preccp;
    private LocalDate dataNascimento;
    private StatusCadastro statusCadastro;
    private Boolean ativo;

}
