package br.com.fusex28gac.fusex_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidacaoBeneficiarioRequest {
    private Boolean aprovado;
    private Long validadoPorUserId;
}
