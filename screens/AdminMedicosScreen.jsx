import React, { useState } from 'react';
import { Plus, Power, PowerOff, ShieldCheck, Stethoscope } from 'lucide-react';

export default function AdminMedicosScreen({
  medicos,
  onAddMedico,
  onToggleStatus,
  isLoading,
  errorMessage,
}) {
  const [nome, setNome] = useState('');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('CLINICO_GERAL');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !crm.trim()) return;
    onAddMedico({
      nome: nome.trim(),
      crm: crm.trim(),
      especialidade,
      ativo: true,
    });
    // Reset form
    setNome('');
    setCrm('');
    setEspecialidade('CLINICO_GERAL');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: showAddForm ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', gap: '24px' }}>
      {showAddForm && (
        <section className="panel">
          <h3>Novo Médico</h3>
          <p className="empty-hint" style={{ marginBottom: '16px' }}>Cadastre um profissional médico no sistema.</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Nome Completo</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>CRM</label>
              <input
                type="text"
                required
                placeholder="Ex: 123456/SP"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Especialidade</label>
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  background: '#fff',
                }}
              >
                <option value="CLINICO_GERAL">Clínico Geral</option>
                <option value="DENTISTA">Dentista</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel" style={{ flex: 1 }}>
        <div className="panel-title-row">
          <div>
            <h3>Corpo Clínico (Médicos)</h3>
            <p className="empty-hint" style={{ marginTop: '4px' }}>Profissionais cadastrados no sistema.</p>
          </div>
          {!showAddForm && (
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              <Plus size={16} /> Novo Médico
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <p className="empty-hint">Carregando médicos...</p>
        ) : medicos.length === 0 ? (
          <p className="empty-hint">Nenhum médico cadastrado.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {medicos.map((m) => (
              <div
                key={m.id}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '14px',
                  padding: '16px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(31, 126, 200, 0.1)',
                      color: 'var(--blue)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '600', color: 'var(--text)' }}>{m.nome}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>CRM: {m.crm}</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: m.especialidade === 'CLINICO_GERAL' ? '#1f7ec8' : '#8b5cf6',
                        backgroundColor: m.especialidade === 'CLINICO_GERAL' ? 'rgba(31, 126, 200, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {m.especialidade === 'CLINICO_GERAL' ? 'Clínico Geral' : 'Dentista'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--line)',
                    paddingTop: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: m.ativo ? 'var(--green)' : 'var(--muted)',
                    }}
                  >
                    {m.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  {m.ativo && (
                    <button
                      onClick={() => onToggleStatus(m.id)}
                      title="Desativar Médico"
                      className="btn btn-danger"
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <PowerOff size={14} /> Desativar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
