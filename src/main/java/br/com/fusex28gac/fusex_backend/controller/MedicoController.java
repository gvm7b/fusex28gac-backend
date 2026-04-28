package br.com.fusex28gac.fusex_backend.controller;

import br.com.fusex28gac.fusex_backend.dto.MedicoRequest;
import br.com.fusex28gac.fusex_backend.dto.MedicoResponse;
import br.com.fusex28gac.fusex_backend.model.EspecialidadeMedica;
import br.com.fusex28gac.fusex_backend.service.MedicoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
public class MedicoController {

    private final MedicoService medicoService;

    public MedicoController (MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    @PostMapping
    public ResponseEntity<MedicoResponse> criar(@RequestBody MedicoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicoService.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<MedicoResponse>> listarTodos() {
        return ResponseEntity.ok(medicoService.listarTodos());
    }

    @GetMapping("{id}")
    public ResponseEntity<MedicoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(medicoService.buscarPorId(id));
    }

    @GetMapping("/especialidade/{especialidade}")
    public ResponseEntity<List<MedicoResponse>> listarPorEspecialidade(@PathVariable EspecialidadeMedica especialidade) {
        return ResponseEntity.ok(medicoService.listarPorEspecialidade(especialidade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicoResponse> atualizar(@PathVariable Long id, @RequestBody MedicoRequest request) {
        return ResponseEntity.ok(medicoService.atualizar(id, request));
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<MedicoResponse> desativar(@PathVariable Long id) {
        return ResponseEntity.ok(medicoService.desativar(id));
    }
}
