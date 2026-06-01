import React from 'react';

export default function AppointmentsScreen({
  query,
  onQueryChange,
  appointments,
  errorMessage,
  formatDateTime,
}) {
  return (
    <section className="panel table-panel">
      <div className="panel-title-row wrap">
        <h3>Consultas Agendadas e Historico</h3>
        <div className="toolbar">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por protocolo, beneficiario ou status..."
          />
        </div>
      </div>

      {errorMessage && <p className="empty-hint">{errorMessage}</p>}

      <div className="table-wrap">
        <table>
          <colgroup>
            <col className="col-date-time" />
            <col className="col-booked-at" />
            <col className="col-status" />
          </colgroup>
          <thead>
            <tr>
              <th>Data / Hora</th>
              <th>Beneficiario</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{formatDateTime(item.dataHora)}</strong>
                  <small>#{item.id}</small>
                </td>
                <td>{item.nomeBeneficiario}</td>
                <td>
                  <span className={`status-chip ${item.status === 'AGENDADO' ? 'ok' : 'canceled'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!errorMessage && appointments.length === 0 && (
          <p className="empty-hint">Nenhum registro encontrado para essa busca.</p>
        )}
      </div>
    </section>
  );
}
