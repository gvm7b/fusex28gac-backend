package br.com.fusex28gac.fusex_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GerarHorarioRequest {
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Integer duracaoMinutos;
}
