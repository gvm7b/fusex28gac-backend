package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.BloqueioIntervaloRequest;
import br.com.fusex28gac.fusex_backend.dto.GerarHorarioRequest;
import br.com.fusex28gac.fusex_backend.dto.HorarioDisponivelRequest;
import br.com.fusex28gac.fusex_backend.dto.HorarioDisponivelResponse;
import br.com.fusex28gac.fusex_backend.model.HorarioDisponivel;
import br.com.fusex28gac.fusex_backend.model.StatusHorario;
import br.com.fusex28gac.fusex_backend.repository.HorarioDisponivelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class HorarioDisponivelService {

    private final HorarioDisponivelRepository horarioDisponivelRepository;

    private static final LocalTime INICIO_MANHA = LocalTime.of(8, 0);
    private static final LocalTime FIM_MANHA = LocalTime.of(12, 0);
    private static final LocalTime INICIO_TARDE = LocalTime.of(13, 30);
    private static final LocalTime FIM_TARDE = LocalTime.of(16, 30);
    private static final int DURACAO_PADRAO_MINUTOS = 30;

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

        validarHorarioDeAtendimento(request.getDataHora());

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

    public List<HorarioDisponivelResponse> gerarHorarios(GerarHorarioRequest request) {
        if(request.getDataInicio() == null || request.getDataFim() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a data inicial e final");
        }

        if(request.getDataInicio().isAfter(request.getDataFim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data inicial deve ser anterior ou igual a data final.");
        }

        int duracaoMinutos = request.getDuracaoMinutos() == null
                ? DURACAO_PADRAO_MINUTOS
                : request.getDuracaoMinutos();

        if(duracaoMinutos <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duração em minutos deve ser maior que zero.");
        }

        List<HorarioDisponivel> horarios = new ArrayList<>();

        LocalDate data = request.getDataInicio();

        while (!data.isAfter(request.getDataFim())) {
            if(!isFinalDeSemana(data)) {
                adicionarHorariosDoPeriodo(horarios, data, INICIO_MANHA, FIM_MANHA, duracaoMinutos);
                adicionarHorariosDoPeriodo(horarios, data, INICIO_TARDE, FIM_TARDE, duracaoMinutos);
            }
            data = data.plusDays(1);
        }

        return horarioDisponivelRepository.saveAll(horarios)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<HorarioDisponivelResponse> bloquearIntervalo(BloqueioIntervaloRequest request) {
        if(request.getInicio() == null || request.getFim() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o inicio e fim do intervalo");
        }

        if(request.getInicio().isAfter(request.getFim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data inicio deve ser anterior ou igual a data fim");
        }

        List<HorarioDisponivel> horarios = horarioDisponivelRepository
                .findByDataHoraBetweenOrderByDataHoraAsc(request.getInicio(), request.getFim());

        boolean possuiHorarioAgendado = horarios.stream()
                .anyMatch(horario -> horario.getStatus() == StatusHorario.AGENDADO);

        if(possuiHorarioAgendado) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Intervalo possui horario agendado");

        }

        horarios.forEach(horario -> horario.setStatus(StatusHorario.BLOQUEADO));

        return horarioDisponivelRepository.saveAll(horarios)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public HorarioDisponivelResponse desbloquear(Long id) {
        HorarioDisponivel horario = horarioDisponivelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Horario não encontrado!"));

        if(horario.getStatus() == StatusHorario.AGENDADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horario já esta agendado!");
        }

        horario.setStatus(StatusHorario.DISPONIVEL);

        return toResponse(horarioDisponivelRepository.save(horario));
    }

    private void adicionarHorariosDoPeriodo(
            List<HorarioDisponivel> horarios,
            LocalDate data,
            LocalTime inicio,
            LocalTime fim,
            int duracaoMinutos
    ){
        LocalTime hora = inicio;

        while(!hora.plusMinutes(duracaoMinutos).isAfter(fim)) {
            LocalDateTime dataHora = LocalDateTime.of(data, hora);

            if(!dataHora.isBefore(LocalDateTime.now())
                && !horarioDisponivelRepository.existsByDataHora(dataHora)) {
                HorarioDisponivel horario = new HorarioDisponivel();
                horario.setDataHora(dataHora);
                horario.setStatus(StatusHorario.DISPONIVEL);
                horarios.add(horario);
            }

            hora = hora.plusMinutes(duracaoMinutos);
        }
    }

    private void validarHorarioDeAtendimento(LocalDateTime dataHora) {
        LocalTime hora = dataHora.toLocalTime();
        LocalTime fimAtendimento = hora.plusMinutes(DURACAO_PADRAO_MINUTOS);

        boolean horarioManha = !hora.isBefore(INICIO_MANHA) && !fimAtendimento.isAfter(FIM_MANHA);
        boolean horarioTarde = !hora.isBefore(INICIO_TARDE) && !fimAtendimento.isAfter(FIM_TARDE);

        if (!horarioManha && !horarioTarde) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Horario fora do expediente do Fusex: 08:00-12:00 e 13:30-16:30"
            );
        }
    }

    private boolean isFinalDeSemana(LocalDate data) {
        return data.getDayOfWeek() == DayOfWeek.SATURDAY
                || data.getDayOfWeek() == DayOfWeek.SUNDAY;
    }
}
