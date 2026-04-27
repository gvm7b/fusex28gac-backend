package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.MedicoRequest;
import br.com.fusex28gac.fusex_backend.dto.MedicoResponse;
import br.com.fusex28gac.fusex_backend.model.EspecialidadeMedica;
import br.com.fusex28gac.fusex_backend.model.Medico;
import br.com.fusex28gac.fusex_backend.repository.MedicoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;

    public MedicoService (MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    public MedicoResponse criar(MedicoRequest request) {
        validarRequest(request);

        String crm = normalizarCrm(request.getCrm());

        if (medicoRepository.findByCrm(crm).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CRM ja cadastrado");
        }

        Medico medico = new Medico();
        medico.setNome(request.getNome().trim());
        medico.setCrm(crm);
        medico.setEspecialidade(request.getEspecialidade());
        medico.setAtivo(request.getAtivo() == null ? true : request.getAtivo());

        return toResponse(medicoRepository.save(medico));
    }

    public List<MedicoResponse> listarTodos() {
        return medicoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MedicoResponse buscarPorId(Long id) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medico não encontrado"));

        return toResponse(medico);
    }

    public List<MedicoResponse> listarPorEspecialidade(EspecialidadeMedica especialidade) {
        return medicoRepository.findByEspecialidadeAndAtivoTrue(especialidade)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MedicoResponse atualizar(Long id, MedicoRequest request) {
        validarRequest(request);

        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medico não encontrado"));

        String crm = normalizarCrm(request.getCrm());

        medicoRepository.findByCrm(crm)
                .filter(medicoEncontrado -> !medicoEncontrado.getId().equals(id))
                .ifPresent(medicoEncontrado -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "CRM já cadastrado");
                });

        medico.setNome(request.getNome().trim());
        medico.setCrm(crm);
        medico.setEspecialidade(request.getEspecialidade());
        medico.setAtivo(request.getAtivo() == null ? true : request.getAtivo());

        return toResponse(medicoRepository.save(medico));
    }

    public MedicoResponse desativar(Long id) {
        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medico não encontrado"));

        medico.setAtivo(false);

        return toResponse(medicoRepository.save(medico));
    }

    private void validarRequest(MedicoRequest request) {
        if(request.getNome() == null || request.getNome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome do medico");
        }

        if (request.getCrm() == null || request.getCrm().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o CRM do medico");
        }

        if (request.getEspecialidade() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a especialidade do medico");
        }
    }

    private String normalizarCrm(String crm) {
        return crm.trim().toUpperCase();
    }

    private MedicoResponse toResponse(Medico medico) {
        return new MedicoResponse(
                medico.getId(),
                medico.getNome(),
                medico.getCrm(),
                medico.getEspecialidade(),
                medico.getAtivo()
        );
    }
}
