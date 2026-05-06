package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.HorarioDisponivelRequest;
import br.com.fusex28gac.fusex_backend.dto.HorarioDisponivelResponse;
import br.com.fusex28gac.fusex_backend.model.HorarioDisponivel;
import br.com.fusex28gac.fusex_backend.model.StatusHorario;
import br.com.fusex28gac.fusex_backend.repository.HorarioDisponivelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HorarioDisponivelService {

    private final HorarioDisponivelRepository horarioDisponivelRepository;

    public HorarioDisponivelService(HorarioDisponivelRepository horarioDisponivelRepository) {
        this.horarioDisponivelRepository = horarioDisponivelRepository;
    }

    public HorarioDisponivelResponse criar(HorarioDisponivelRequest request) {
        if (request.getDataHora() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a data e hora");
        }

        if (request.getDataHora().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é permitido cadastrar horario no passado");
        }

        if (horarioDisponivelRepository.existsByDataHora(request.getDataHora())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Horario já cadastrado");
        }

        HorarioDisponivel horario = new HorarioDisponivel();
        horario.setDataHora(request.getDataHora());
        horario.setStatus(request.getStatus() == null ? StatusHorario.DISPONIVEL : request.getStatus());

        return toResponse(horarioDisponivelRepository.save(horario));
    }

    public List<HorarioDisponivelResponse> listarDisponiveis() {
        return horarioDisponivelRepository
                .findByStatusAndDataHoraAfterOrderByDataHoraAsc(StatusHorario.DISPONIVEL, LocalDateTime.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<HorarioDisponivelResponse> listarTodos() {
        return horarioDisponivelRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public HorarioDisponivelResponse bloquear(Long id) {
        HorarioDisponivel horario = horarioDisponivelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Horario não encontrado"));

        if (horario.getStatus() == StatusHorario.AGENDADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horario já esta agendado");
        }

        horario.setStatus(StatusHorario.BLOQUEADO);
        return toResponse(horarioDisponivelRepository.save(horario));
    }

    private HorarioDisponivelResponse toResponse(HorarioDisponivel horario) {
        return new HorarioDisponivelResponse(
                horario.getId(),
                horario.getDataHora(),
                horario.getStatus()
        );
    }
}
