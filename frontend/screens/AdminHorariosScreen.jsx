import React, { useState } from 'react';
import { Calendar, ShieldAlert, Lock, Unlock, Play, AlertCircle } from 'lucide-react';

export default function AdminHorariosScreen({
  slots,
  onGerarHorarios,
  onBloquearIntervalo,
  onBloquearSlot,
  onDesbloquearSlot,
  formatDateTime,
  isLoading,
  errorMessage,
}) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [duracao, setDuracao] = useState(30);

  const [bloqueioInicio, setBloqueioInicio] = useState('');
  const [bloqueioFim, setBloqueioFim] = useState('');

  const [activeTab, setActiveTab] = useState('list'); // list, generate, block_range

  const handleGerar = (e) => {
    e.preventDefault();
    if (!dataInicio || !dataFim) return;
    onGerarHorarios({
      dataInicio,
      dataFim,
      duracaoMinutos: Number(duracao),
    });
    // Reset fields
    setDataInicio('');
    setDataFim('');
    setDuracao(30);
    setActiveTab('list');
  };

  const handleBloquearIntervalo = (e) => {
    e.preventDefault();
    if (!bloqueioInicio || !bloqueioFim) return;
    onBloquearIntervalo({
      inicio: `${bloqueioInicio}:00`,
      fim: `${bloqueioFim}:00`,
    });
    // Reset fields
    setBloqueioInicio('');
    setBloqueioFim('');
    setActiveTab('list');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DISPONIVEL':
        return { backgroundColor: 'rgba(31, 154, 111, 0.1)', color: 'var(--green)' };
      case 'BLOQUEADO':
        return { backgroundColor: 'rgba(209, 78, 78, 0.1)', color: 'var(--red)' };
      case 'AGENDADO':
      default:
        return { backgroundColor: 'rgba(31, 126, 200, 0.1)', color: 'var(--blue)' };
    }
  };

  // Sort slots by date desc
  const sortedSlots = [...slots].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('list')}
          className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-ghost'}`}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
          }}
        >
          Lista de Horários
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`btn ${activeTab === 'generate' ? 'btn-primary' : 'btn-ghost'}`}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
          }}
        >
          Gerar Horários
        </button>
        <button
          onClick={() => setActiveTab('block_range')}
          className={`btn ${activeTab === 'block_range' ? 'btn-primary' : 'btn-ghost'}`}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
          }}
        >
          Bloquear Intervalo
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeTab === 'generate' && (
        <section className="panel" style={{ maxWidth: '600px', width: '100%' }}>
          <h3>Gerar Grade de Horários</h3>
          <p className="empty-hint" style={{ marginBottom: '20px' }}>
            Esta operação irá gerar horários de atendimento padrão (08:00 - 12:00 e 13:30 - 16:30)
            excluindo finais de semana.
          </p>

          <form onSubmit={handleGerar} style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Data Inicial</label>
                <input
                  type="date"
                  required
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Data Final</label>
                <input
                  type="date"
                  required
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Duração da Consulta (minutos)</label>
              <input
                type="number"
                required
                min="10"
                max="120"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Gerar Grade
            </button>
          </form>
        </section>
      )}

      {activeTab === 'block_range' && (
        <section className="panel" style={{ maxWidth: '600px', width: '100%' }}>
          <h3>Bloquear Intervalo de Horários</h3>
          <p className="empty-hint" style={{ marginBottom: '20px' }}>
            Bloqueie todos os horários livres que caiam dentro do intervalo especificado.
          </p>

          <form onSubmit={handleBloquearIntervalo} style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Início</label>
                <input
                  type="datetime-local"
                  required
                  value={bloqueioInicio}
                  onChange={(e) => setBloqueioInicio(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Fim</label>
                <input
                  type="datetime-local"
                  required
                  value={bloqueioFim}
                  onChange={(e) => setBloqueioFim(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-danger" style={{ marginTop: '10px' }}>
              Bloquear Intervalo
            </button>
          </form>
        </section>
      )}

      {activeTab === 'list' && (
        <section className="panel">
          <div className="panel-title-row">
            <div>
              <h3>Grade de Horários Cadastrados</h3>
              <p className="empty-hint" style={{ marginTop: '4px' }}>Todos os horários criados na base do sistema, em ordem cronológica reversa.</p>
            </div>
          </div>

          {isLoading ? (
            <p className="empty-hint">Carregando horários...</p>
          ) : sortedSlots.length === 0 ? (
            <p className="empty-hint">Nenhum horário cadastrado no sistema.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Data / Hora</th>
                    <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: 'var(--muted)', fontWeight: '600', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSlots.map((slot) => (
                    <tr key={slot.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>#{slot.id}</td>
                      <td style={{ padding: '12px 8px' }}>{formatDateTime(slot.dataHora)}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            ...getStatusStyle(slot.status),
                          }}
                        >
                          {slot.status === 'DISPONIVEL' && 'Disponível'}
                          {slot.status === 'BLOQUEADO' && 'Bloqueado'}
                          {slot.status === 'AGENDADO' && 'Agendado'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        {slot.status === 'DISPONIVEL' && (
                          <button
                            onClick={() => onBloquearSlot(slot.id)}
                            className="btn btn-danger"
                            style={{
                              padding: '5px 10px',
                              fontSize: '0.8rem',
                            }}
                          >
                            <Lock size={12} /> Bloquear
                          </button>
                        )}
                        {slot.status === 'BLOQUEADO' && (
                          <button
                            onClick={() => onDesbloquearSlot(slot.id)}
                            className="btn btn-success"
                            style={{
                              padding: '5px 10px',
                              fontSize: '0.8rem',
                            }}
                          >
                            <Unlock size={12} /> Desbloquear
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
      )}
    </div>
  );
}
