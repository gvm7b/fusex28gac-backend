package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.AgendamentoRequest;
import br.com.fusex28gac.fusex_backend.dto.AgendamentoResponse;
import br.com.fusex28gac.fusex_backend.model.Agendamento;
import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import br.com.fusex28gac.fusex_backend.model.StatusAgendamento;
import br.com.fusex28gac.fusex_backend.repository.AgendamentoRepository;
import br.com.fusex28gac.fusex_backend.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private final AgendamentoRepository agendamentoRepository;
    private final BeneficiarioRepository beneficiarioRepository;

    public AgendamentoService( AgendamentoRepository agendamentoRepository, BeneficiarioRepository beneficiarioRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.beneficiarioRepository = beneficiarioRepository;
    }

    public AgendamentoResponse criar(AgendamentoRequest request) {
        if (request.getBeneficiarioId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o beneficiario!");
        }

        if (request.getDataHora() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a data e hora!");
        }

        if(request.getDataHora().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não e permitido agendar no passado!");
        }

        Beneficiario beneficiario = beneficiarioRepository.findById(request.getBeneficiarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Beneficiario não encontrado!"));

        if (Boolean.FALSE.equals(beneficiario.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Beneficiario inativo");
        }

        boolean horarioOcupado = agendamentoRepository.existsByDataHoraAndStatus(
                request.getDataHora(),
                StatusAgendamento.AGENDADO
        );

        if(horarioOcupado) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Horario ja ocupado!");
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setBeneficiario(beneficiario);
        agendamento.setDataHora(request.getDataHora());
        agendamento.setObservacao(request.getObservacao());
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        return toResponse(agendamentoRepository.save(agendamento));
    }

    public List<AgendamentoResponse> listarTodos() {
        return agendamentoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AgendamentoResponse buscarPorId(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado!"));

        return toResponse(agendamento);
    }

    public AgendamentoResponse cancelar(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado!"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agendamento já esta cancelado!");
        }

        if(agendamento.getStatus() == StatusAgendamento.REALIZADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Consulta já realizada. Não pode ser cancelada.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);

        return toResponse(agendamentoRepository.save(agendamento));
    }

    public AgendamentoResponse remarcar(Long id, AgendamentoRequest request) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));

        if (request.getDataHora() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a nova data e hora");
        }

        if (request.getDataHora().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é Permitido Remarcar para o passado.");
        }

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agendamento cancelado, não pode ser remarcado");
        }

        if (agendamento.getStatus() == StatusAgendamento.REALIZADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Consulta realizada não pode ser remarcada.");
        }

        boolean horarioOcupado = agendamentoRepository.existsByDataHoraAndStatus(
                request.getDataHora(),
                StatusAgendamento.AGENDADO
        );

        if(!request.getDataHora().equals(agendamento.getDataHora()) && horarioOcupado) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Novo horário já esta ocupado.");
        }

        agendamento.setDataHora(request.getDataHora());
        agendamento.setObservacao(request.getObservacao());

        return toResponse(agendamentoRepository.save(agendamento));
    }

    public List<AgendamentoResponse> listarPorBeneficiario(Long beneficiarioId) {
        if(!beneficiarioRepository.existsById((beneficiarioId))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Beneficiario não encontrado");
        }

        return agendamentoRepository.findByBeneficiarioId(beneficiarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    private AgendamentoResponse toResponse(Agendamento agendamento) {
        return new AgendamentoResponse(
                agendamento.getId(),
                agendamento.getBeneficiario().getId(),
                agendamento.getBeneficiario().getNomeCompleto(),
                agendamento.getDataHora(),
                agendamento.getStatus(),
                agendamento.getObservacao()
        );
    }


}
