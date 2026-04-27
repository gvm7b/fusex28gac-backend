package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.EspecialidadeMedica;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicoRequest {
    private String nome;
    private String crm;
    private EspecialidadeMedica especialidade;
    private Boolean ativo;
}
