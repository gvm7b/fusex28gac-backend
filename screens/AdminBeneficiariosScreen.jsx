import React, { useState } from 'react';
import { Check, X, Search, ShieldCheck, ShieldAlert, User } from 'lucide-react';

export default function AdminBeneficiariosScreen({
  beneficiarios,
  onValidar,
  isLoading,
  errorMessage,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, VALIDADO, PENDENTE_VALIDACAO, REJEITADO

  const filtered = beneficiarios.filter((b) => {
    const matchesSearch =
      b.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cpf.includes(searchTerm) ||
      (b.preccp && b.preccp.includes(searchTerm));

    const matchesStatus = filterStatus === 'ALL' || b.statusCadastro === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALIDADO':
        return <span className="status-ok">Validado</span>;
      case 'REJEITADO':
        return <span className="status-err" style={{ backgroundColor: 'rgba(209, 78, 78, 0.1)', color: '#d14e4e', padding: '4px 8px', borderRadius: '6px' }}>Rejeitado</span>;
      case 'PENDENTE_VALIDACAO':
      default:
        return <span className="status-pending" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706', padding: '4px 8px', borderRadius: '6px' }}>Pendente</span>;
    }
  };

  return (
    <section className="panel" style={{ width: '100%' }}>
      <div className="panel-title-row">
        <div>
          <h3>Validação de Beneficiários</h3>
          <p className="empty-hint" style={{ marginTop: '4px' }}>
            Gerencie os usuários do sistema e aprove ou recuse novas solicitações de acesso.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
          {errorMessage}
        </div>
      )}

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou PRECCP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              background: '#f8fafc',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'PENDENTE_VALIDACAO', 'VALIDADO', 'REJEITADO'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
              }}
            >
              {status === 'ALL' && 'Todos'}
              {status === 'PENDENTE_VALIDACAO' && 'Pendentes'}
              {status === 'VALIDADO' && 'Validados'}
              {status === 'REJEITADO' && 'Rejeitados'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Table */}
      {isLoading ? (
        <p className="empty-hint">Carregando beneficiários...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-hint">Nenhum beneficiário encontrado.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)' }}>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Paciente</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>CPF</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>PRECCP</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Data Nasc.</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-2)', display: 'grid', placeItems: 'center', color: 'var(--blue)' }}>
                        <User size={16} />
                      </div>
                      <div>
                        <strong style={{ display: 'block' }}>{b.nomeCompleto}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>ID: {b.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 8px' }}>{b.cpf}</td>
                  <td style={{ padding: '14px 8px' }}>{b.preccp || '-'}</td>
                  <td style={{ padding: '14px 8px' }}>
                    {b.dataNascimento ? new Date(b.dataNascimento).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td style={{ padding: '14px 8px' }}>{getStatusBadge(b.statusCadastro)}</td>
                  <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                    {b.statusCadastro === 'PENDENTE_VALIDACAO' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => onValidar(b.id, true)}
                          className="btn btn-success"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                          }}
                        >
                          <Check size={14} /> Aprovar
                        </button>
                        <button
                          onClick={() => onValidar(b.id, false)}
                          className="btn btn-danger"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                          }}
                        >
                          <X size={14} /> Rejeitar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
