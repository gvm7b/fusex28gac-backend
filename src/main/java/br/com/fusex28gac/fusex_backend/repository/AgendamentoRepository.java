package br.com.fusex28gac.fusex_backend.repository;

import br.com.fusex28gac.fusex_backend.model.Agendamento;
import br.com.fusex28gac.fusex_backend.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    boolean existsByDataHoraAndStatus(LocalDateTime dataHora, StatusAgendamento status);

    List<Agendamento> findByBeneficiarioId(Long beneficiarioId);

    List<Agendamento> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
}
