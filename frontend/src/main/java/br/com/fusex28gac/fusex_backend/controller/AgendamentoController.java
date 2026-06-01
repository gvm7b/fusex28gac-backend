package br.com.fusex28gac.fusex_backend.controller;

import br.com.fusex28gac.fusex_backend.dto.AgendamentoRequest;
import br.com.fusex28gac.fusex_backend.dto.AgendamentoResponse;
import br.com.fusex28gac.fusex_backend.service.AgendamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(@RequestBody AgendamentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoService.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponse>> listarTodos() {
        return ResponseEntity.ok(agendamentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.buscarPorId(id));
    }

    @GetMapping("/beneficiario/{beneficiarioId}")
    public ResponseEntity<List<AgendamentoResponse>> listarPorBeneficiario(@PathVariable Long beneficiarioId) {
        return ResponseEntity.ok(agendamentoService.listarPorBeneficiario(beneficiarioId));
    }

    @PatchMapping("/{id}/cancelamento")
    public ResponseEntity<AgendamentoResponse> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.cancelar(id));
    }

    @PatchMapping("/{id}/remarcacao")
    public ResponseEntity<AgendamentoResponse> remarcar(@PathVariable Long id, @RequestBody AgendamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.remarcar(id, request));
    }
}
