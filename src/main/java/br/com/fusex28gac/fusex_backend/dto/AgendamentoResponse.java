package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import br.com.fusex28gac.fusex_backend.model.StatusAgendamento;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AgendamentoResponse {
    private Long id;
    private Long beneficiarioId;
    private String nomeBeneficiario;
    private LocalDateTime dataHora;
    private StatusAgendamento status;
    private String observacao;
}
