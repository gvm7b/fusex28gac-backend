package br.com.fusex28gac.fusex_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgendamentoRequest {
    private Long beneficiarioId;
    private Long horarioId;
    private String observacao;

}
