package br.com.fusex28gac.fusex_backend.controller;

import br.com.fusex28gac.fusex_backend.dto.LoginRequest;
import br.com.fusex28gac.fusex_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dto) {
        var user = service.login(dto.getLogin(), dto.getDataNascimento());

        return ResponseEntity.ok(user);
    }
}
