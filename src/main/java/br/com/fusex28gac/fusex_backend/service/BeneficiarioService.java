package br.com.fusex28gac.fusex_backend.service;

import br.com.fusex28gac.fusex_backend.dto.BeneficiarioRequest;
import br.com.fusex28gac.fusex_backend.model.Beneficiario;
import br.com.fusex28gac.fusex_backend.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BeneficiarioService {

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    public Beneficiario salvar(BeneficiarioRequest beneficiarioRequest) {
        Beneficiario beneficiario = new Beneficiario();
        beneficiario.setNomeCompleto(beneficiarioRequest.getNomeCompleto());
        beneficiario.setCpf(beneficiario.getCpf());
        beneficiario.setPreccp(beneficiarioRequest.getPreccp());
        beneficiario.setDataNascimento(beneficiarioRequest.getDataNascimento());
        beneficiario.setAtivo(true);

        return beneficiarioRepository.save(beneficiario);
    }
}
