package br.com.fusex28gac.fusex_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AgendamentoRequest {
    private Long beneficiarioId;
    private LocalDateTime dataHora;
    private String observacao;

}
