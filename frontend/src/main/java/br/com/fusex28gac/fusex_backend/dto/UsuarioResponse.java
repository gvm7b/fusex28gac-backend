package br.com.fusex28gac.fusex_backend.dto;

import br.com.fusex28gac.fusex_backend.model.PerfilUsuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String login,
        PerfilUsuario perfil,
        Boolean ativo
) {
}
