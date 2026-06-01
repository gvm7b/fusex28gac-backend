package br.com.fusex28gac.fusex_backend.controller;

import br.com.fusex28gac.fusex_backend.dto.BeneficiarioRequest;
import br.com.fusex28gac.fusex_backend.dto.BeneficiarioResponse;
import br.com.fusex28gac.fusex_backend.dto.ValidacaoBeneficiarioRequest;
import br.com.fusex28gac.fusex_backend.service.BeneficiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/beneficiarios")
public class BeneficiarioController {

    @Autowired
    private BeneficiarioService beneficiarioService;

    @PostMapping
    public ResponseEntity<BeneficiarioResponse> cadastrar(@RequestBody BeneficiarioRequest beneficiarioRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(beneficiarioService.salvar(beneficiarioRequest));
    }

    @PatchMapping("/{id}/validacao")
    public ResponseEntity<BeneficiarioResponse> validarCadastro(@PathVariable Long id, @RequestBody ValidacaoBeneficiarioRequest request) {
        return ResponseEntity.ok(beneficiarioService.validarCadastro(id, request));
    }
}
