import React from 'react';

export default function CancelScreen({ appointments, onCancel, formatDateTime }) {
  const activeAppointments = appointments.filter((item) => item.status === 'AGENDADO');

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h3>Cancelar Consulta</h3>
      </div>

      <div className="cancel-list">
        {activeAppointments.length === 0 && (
          <p className="empty-hint">Nao ha consultas ativas para cancelamento.</p>
        )}

        {activeAppointments.map((item) => (
          <div key={item.id} className="cancel-item">
            <div>
              <p className="tag">#{item.id}</p>
              <h4>{item.nomeBeneficiario}</h4>
              <p>{formatDateTime(item.dataHora)}</p>
            </div>
            <button className="btn btn-danger" onClick={() => onCancel(item.id)}>Cancelar</button>
          </div>
        ))}
      </div>
    </section>
  );
}
