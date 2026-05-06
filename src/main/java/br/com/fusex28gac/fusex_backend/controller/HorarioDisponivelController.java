package br.com.fusex28gac.fusex_backend.controller;

import br.com.fusex28gac.fusex_backend.dto.HorarioDisponivelRequest;
import br.com.fusex28gac.fusex_backend.dto.HorarioDisponivelResponse;
import br.com.fusex28gac.fusex_backend.service.HorarioDisponivelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class HorarioDisponivelController {

    private final HorarioDisponivelService horarioDisponivelService;

    public HorarioDisponivelController(HorarioDisponivelService horarioDisponivelService) {
        this.horarioDisponivelService = horarioDisponivelService;
    }

    @PostMapping
    public ResponseEntity<HorarioDisponivelResponse> criar(@RequestBody HorarioDisponivelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioDisponivelService.criar(request));
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<HorarioDisponivelResponse>> listarDisponiveis() {
        return ResponseEntity.ok(horarioDisponivelService.listarDisponiveis());
    }

    @GetMapping
    public ResponseEntity<List<HorarioDisponivelResponse>> listarTodos() {
        return ResponseEntity.ok(horarioDisponivelService.listarTodos());
    }

    @PatchMapping("/{id}/bloqueio")
    public ResponseEntity<HorarioDisponivelResponse> bloquear(@PathVariable Long id) {
        return ResponseEntity.ok(horarioDisponivelService.bloquear(id));
    }
}
