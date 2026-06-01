package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.StatusHorario;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class HorarioDisponivelResponse {
    private Long id;
    private LocalDateTime dataHora;
    private StatusHorario status;
}
