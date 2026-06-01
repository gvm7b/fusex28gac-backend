package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.EspecialidadeMedica;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MedicoResponse {

    private Long id;
    private String nome;
    private String crm;
    private EspecialidadeMedica especialidade;
    private Boolean ativo;

}
