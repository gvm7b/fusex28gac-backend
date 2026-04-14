package br.com.fusex28gac.fusex_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "beneficiarios")
@Getter
@Setter
public class Beneficiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    private String nomeCompleto;

    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String preccp;

    private LocalDate dataNascimento;

    private String tipo;

    @Enumerated(EnumType.STRING)
    private StatusCadastro statusCadastro = StatusCadastro.PENDENTE_VALIDACAO;

    private Boolean ativo = true;

    private LocalDate dataValidacao;

    private String validadoPor;


}
