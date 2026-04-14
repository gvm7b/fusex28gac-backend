package br.com.fusex28gac.fusex_backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
public class LoginRequest {
    private String login;
    private LocalDate dataNascimento;
}
