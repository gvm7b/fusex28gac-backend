package br.com.fusex28gac.fusex_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String login;

    @Column(nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    private PerfilUsuario perfil;

    @Column(nullable = false)
    private Boolean ativo = true;

}
