package br.com.fusex28gac.fusex_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "medicos")
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String crm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EspecialidadeMedica especialidade;

    private Boolean ativo = true;
}
