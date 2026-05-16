package br.com.fusex28gac.fusex_backend.repository;

import br.com.fusex28gac.fusex_backend.model.HorarioDisponivel;
import br.com.fusex28gac.fusex_backend.model.StatusHorario;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HorarioDisponivelRepository extends JpaRepository<HorarioDisponivel, Long> {

    boolean existsByDataHora(LocalDateTime dataHora);

    List<HorarioDisponivel> findByStatusAndDataHoraAfterOrderByDataHoraAsc(
            StatusHorario status,
            LocalDateTime dataHora
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select h from HorarioDisponivel h where h.id = :id")
    Optional<HorarioDisponivel> buscarPorIdComLock(@Param("id") Long id);

    List<HorarioDisponivel> findByDataHoraBetweenOrderByDataHoraAsc(
            LocalDateTime inicio,
            LocalDateTime fim
    );
}
