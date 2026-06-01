package br.com.fusex28gac.fusex_backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class LoginRequest {
    private String login;
    private String senha;
}
