package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.StatusHorario;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HorarioDisponivelRequest {
    private LocalDateTime dataHora;
    private StatusHorario status;
}
