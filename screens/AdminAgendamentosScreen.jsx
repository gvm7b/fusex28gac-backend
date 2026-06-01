import React, { useState } from 'react';
import { Search, Calendar, ClipboardX, ShieldAlert } from 'lucide-react';

export default function AdminAgendamentosScreen({
  appointments,
  onCancel,
  formatDateTime,
  isLoading,
  errorMessage,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = appointments.filter((a) => {
    return (
      a.nomeBeneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toString().includes(searchTerm) ||
      a.beneficiarioId.toString().includes(searchTerm)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AGENDADO':
        return <span className="status-ok">Agendado</span>;
      case 'CANCELADO':
        return <span className="status-err" style={{ backgroundColor: 'rgba(209, 78, 78, 0.1)', color: '#d14e4e', padding: '4px 8px', borderRadius: '6px' }}>Cancelado</span>;
      case 'REALIZADO':
        return <span className="status-ok" style={{ backgroundColor: 'rgba(31, 154, 111, 0.1)', color: 'var(--green)', padding: '4px 8px', borderRadius: '6px' }}>Realizado</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <section className="panel" style={{ width: '100%' }}>
      <div className="panel-title-row">
        <div>
          <h3>Todos os Agendamentos</h3>
          <p className="empty-hint" style={{ marginTop: '4px' }}>Visualização e gestão de todas as consultas agendadas na unidade.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
          {errorMessage}
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input
          type="text"
          placeholder="Buscar por paciente, ID do agendamento ou ID do beneficiário..."
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

      {isLoading ? (
        <p className="empty-hint">Carregando agendamentos...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-hint">Nenhum agendamento encontrado.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)' }}>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Paciente</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Data / Hora</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Observação</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 8px', fontWeight: 'bold' }}>#{a.id}</td>
                  <td style={{ padding: '14px 8px' }}>
                    <strong>{a.nomeBeneficiario}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)' }}>ID Paciente: {a.beneficiarioId}</span>
                  </td>
                  <td style={{ padding: '14px 8px' }}>{formatDateTime(a.dataHora)}</td>
                  <td style={{ padding: '14px 8px', fontSize: '0.85rem', color: 'var(--muted)' }}>{a.observacao || '-'}</td>
                  <td style={{ padding: '14px 8px' }}>{getStatusBadge(a.status)}</td>
                  <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                    {a.status === 'AGENDADO' && (
                      <button
                        onClick={() => onCancel(a.id)}
                        className="btn btn-danger"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          marginLeft: 'auto',
                        }}
                      >
                        <ClipboardX size={14} /> Cancelar
                      </button>
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
