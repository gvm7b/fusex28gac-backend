package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.BeneficiarioRequest;
import br.com.fusex28gac.fusex_backend.dto.BeneficiarioResponse;
import br.com.fusex28gac.fusex_backend.dto.ValidacaoBeneficiarioRequest;
import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import br.com.fusex28gac.fusex_backend.model.StatusCadastro;
import br.com.fusex28gac.fusex_backend.model.Usuario;
import br.com.fusex28gac.fusex_backend.repository.BeneficiarioRepository;
import br.com.fusex28gac.fusex_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@Service
public class BeneficiarioService {

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;
    @Autowired
    private UsuarioRepository userRepository;

    public BeneficiarioResponse salvar(BeneficiarioRequest beneficiarioRequest) {
        String cpf = normalizarDocumento(beneficiarioRequest.getCpf());
        String preccp = normalizarDocumento(beneficiarioRequest.getPreccp());

        if (cpf == null && preccp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe CPF ou PRECCP");
        }

        if (cpf != null && beneficiarioRepository.findByCpf(cpf).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF ja cadastrado");
        }

        if (preccp != null && beneficiarioRepository.findByPreccp(preccp).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PRECCP ja cadastrado");
        }

        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setNomeCompleto(beneficiarioRequest.getNomeCompleto());
        beneficiario.setCpf(cpf);
        beneficiario.setPreccp(preccp);
        beneficiario.setDataNascimento(beneficiarioRequest.getDataNascimento());
        beneficiario.setTipo(beneficiarioRequest.getTipo());
        beneficiario.setStatusCadastro(StatusCadastro.PENDENTE_VALIDACAO);
        beneficiario.setAtivo(true);

        Beneficiario salvo = beneficiarioRepository.save(beneficiario);
        return toResponse(salvo);
    }

    public BeneficiarioResponse validarCadastro(Long id, ValidacaoBeneficiarioRequest request) {
        Beneficiario beneficiario = beneficiarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Beneficiario não encontrado"));

        if (request.getAprovado() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe se o cadastro foi aprovado");
        }

        if (request.getValidadoPorUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o usuário validador");
        }

        Usuario usuarioValidador = userRepository.findById(request.getValidadoPorUserId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario validador não encontrado"));

        beneficiario.setStatusCadastro(request.getAprovado() ? StatusCadastro.VALIDADO : StatusCadastro.REJEITADO);
        beneficiario.setDataValidacao(LocalDate.now());
        beneficiario.setValidadoPor(usuarioValidador);

        if (!request.getAprovado()) {
            beneficiario.setAtivo(false);
        }

        return toResponse(beneficiarioRepository.save(beneficiario));
    }

    private BeneficiarioResponse toResponse(Beneficiario beneficiario) {
        return new BeneficiarioResponse(
                beneficiario.getId(),
                beneficiario.getNomeCompleto(),
                beneficiario.getCpf(),
                beneficiario.getPreccp(),
                beneficiario.getDataNascimento(),
                beneficiario.getStatusCadastro(),
                beneficiario.getAtivo()
        );
    }

    private String normalizarDocumento(String valor) {
        if(valor == null) {
            return null;
        }

        String normalizado = valor.replaceAll("\\D", "");
        return normalizado.isBlank() ? null : normalizado;
    }
}
