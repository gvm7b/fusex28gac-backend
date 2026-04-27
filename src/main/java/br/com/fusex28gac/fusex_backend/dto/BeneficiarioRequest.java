package br.com.fusex28gac.fusex_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class BeneficiarioRequest {
    private String nomeCompleto;
    private String cpf;
    private String preccp;
    private LocalDateTime dataNascimento;
    private String tipo;
}
