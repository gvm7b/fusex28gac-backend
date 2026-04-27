package br.com.fusex28gac.fusex_backend.repository;

import br.com.fusex28gac.fusex_backend.model.EspecialidadeMedica;
import br.com.fusex28gac.fusex_backend.model.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {

    Optional<Medico> findByCrm(String crm);

    List<Medico> findByEspecialidadeAndAtivoTrue(EspecialidadeMedica especialidade);
}
