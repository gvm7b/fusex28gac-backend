package br.com.fusex28gac.fusex_backend.repository;

import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BeneficiarioRepository extends JpaRepository<Beneficiario, UUID> {

    Optional<Beneficiario> findByCpf(String cpf);

    Optional<Beneficiario> findByPreccp(String preccp);

    Optional<Beneficiario> findByCpfOrPreccp(String cpf, String preccp);
}
