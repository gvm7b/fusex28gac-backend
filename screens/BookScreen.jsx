import React, { useState } from 'react';
import { Clock3, UserRoundCheck, Stethoscope, Search, MessageSquare } from 'lucide-react';

const SPECIALTY_MAP = {
  CLINICO_GERAL: 'Clínico Geral',
  DENTISTA: 'Dentista',
};

export default function BookScreen({
  bookingStep,
  medicos = [],
  selectedMedicoId,
  availableSlots = [],
  selectedSlot,
  onReset,
  onSelectMedico,
  onBackToMedicos,
  onSelectSlot,
  onBackToSlots,
  onConfirm,
  errorMessage,
  formatDateTime,
}) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [observacao, setObservacao] = useState('');

  const selectedMedico = medicos.find((m) => m.id === selectedMedicoId);

  const filteredMedicos = medicos.filter((medico) => {
    const matchesSpecialty =
      selectedSpecialty === 'TODAS' || medico.especialidade === selectedSpecialty;
    const matchesSearch = medico.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <section className="panel booking-panel">
      <div className="panel-title-row wrap">
        <h3>Marcar Consulta</h3>
        <button className="btn btn-ghost" onClick={onReset}>
          Reiniciar fluxo
        </button>
      </div>

      <div className="stepper">
        {['Profissional', 'Horário', 'Concluir'].map((label, index) => (
          <div key={label} className="step-row">
            <div className={`step-dot ${bookingStep >= index + 1 ? 'active' : ''}`}>
              {index + 1}
            </div>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {bookingStep === 1 && (
        <div className="booking-step-container">
          <div className="slot-head">
            <h4>Selecione um Profissional</h4>
          </div>

          {/* Filters */}
          <div className="filters-row" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div className="search-box" style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar médico pelo nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 35px',
                  borderRadius: '11px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>

            <div className="specialty-tabs" style={{ display: 'flex', gap: '6px' }}>
              {['TODAS', 'CLINICO_GERAL', 'DENTISTA'].map((spec) => (
                <button
                  key={spec}
                  className={`btn ${selectedSpecialty === spec ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedSpecialty(spec)}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  {spec === 'TODAS' ? 'Todos' : SPECIALTY_MAP[spec]}
                </button>
              ))}
            </div>
          </div>

          <div className="medicos-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredMedicos.map((medico) => (
              <div
                key={medico.id}
                className="medico-card"
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '16px',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(19, 110, 181, 0.1)',
                      color: 'var(--blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600 }}>{medico.nome}</h5>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        background: medico.especialidade === 'DENTISTA' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: medico.especialidade === 'DENTISTA' ? '#a855f7' : '#10b981',
                        marginTop: '4px',
                      }}
                    >
                      {SPECIALTY_MAP[medico.especialidade]}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  <p style={{ margin: '2px 0' }}><strong>CRM:</strong> {medico.crm}</p>
                </div>

                <button className="btn btn-primary" onClick={() => onSelectMedico(medico.id)} style={{ marginTop: 'auto', width: '100%' }}>
                  Selecionar
                </button>
              </div>
            ))}
          </div>

          {filteredMedicos.length === 0 && (
            <p className="empty-hint" style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
              Nenhum médico encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      )}

      {bookingStep === 2 && (
        <div className="slot-list">
          <div className="slot-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ margin: 0 }}>Horários Disponíveis</h4>
              {selectedMedico && (
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
                  Profissional: <strong>{selectedMedico.nome}</strong> ({SPECIALTY_MAP[selectedMedico.especialidade]})
                </p>
              )}
            </div>
            <button className="btn btn-secondary" onClick={onBackToMedicos}>
              Voltar para Profissional
            </button>
          </div>

          {errorMessage && <p className="empty-hint">{errorMessage}</p>}

          {availableSlots.map((slot) => (
            <div key={slot.id} className="slot-item">
              <div>
                <p className="slot-time">
                  <Clock3 size={15} />
                  {formatDateTime(slot.dataHora)}
                </p>
                <small>#{slot.id}</small>
              </div>
              <button className="btn btn-primary" onClick={() => onSelectSlot(slot.id)}>Selecionar</button>
            </div>
          ))}

          {!errorMessage && availableSlots.length === 0 && (
            <p className="empty-hint">Nao existem horarios disponiveis no momento.</p>
          )}
        </div>
      )}

      {bookingStep === 3 && selectedSlot && selectedMedico && (
        <div className="confirm-box" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserRoundCheck size={32} />
            </div>
          </div>

          <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Confirmar Agendamento</h4>

          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--line)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              <strong>Médico:</strong> {selectedMedico.nome}
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              <strong>Especialidade:</strong> {SPECIALTY_MAP[selectedMedico.especialidade]}
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              <strong>Horário:</strong> {formatDateTime(selectedSlot.dataHora)}
            </p>
          </div>

          {/* Observation text area */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '8px',
              }}
            >
              <MessageSquare size={14} />
              Observações / Queixa Principal (Opcional)
            </label>
            <textarea
              placeholder="Digite alguma queixa ou observação relevante para a consulta..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '11px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                resize: 'none',
              }}
            />
          </div>

          <div className="confirm-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'stretch' }}>
            <button className="btn btn-primary" onClick={() => onConfirm(observacao)} style={{ flex: 1 }}>
              Confirmar
            </button>
            <button className="btn btn-ghost" onClick={onBackToSlots} style={{ flex: 1 }}>
              Alterar Horário
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
