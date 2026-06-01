import React from 'react';
import { FileText, Stethoscope, User } from 'lucide-react';

export default function GuideScreen() {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <h3>Guia SIRE</h3>
      </div>

      <div className="guide-grid">
        <article>
          <FileText size={22} />
          <h4>Regras de Atendimento</h4>
          <p>Resumo com normas, vestimenta e orientacoes para atendimento presencial.</p>
          <button>Visualizar Guia</button>
        </article>

        <article>
          <Stethoscope size={22} />
          <h4>Fluxo Ambulatorial</h4>
          <p>Passo a passo para marcacao, comparecimento e acompanhamento de consultas.</p>
          <button>Consultar Fluxo</button>
        </article>

        <article>
          <User size={22} />
          <h4>Atualizacao Cadastral</h4>
          <p>Checklist para manter CPF, contato e dados pessoais atualizados no sistema.</p>
          <button>Atualizar Cadastro</button>
        </article>
      </div>
    </section>
  );
}
