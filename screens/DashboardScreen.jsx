import React from 'react';
import { CalendarCheck2, CalendarDays, CalendarPlus, ChevronRight, XCircle } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';

export default function DashboardScreen({
  scheduledCount,
  canceledCount,
  nextAppointment,
  onNavigate,
  formatDateTime,
}) {
  return (
    <section className="view-grid">
      <div className="hero-panel">
        <h2>Bem-vindo ao FUSEX</h2>
        <p>
          Fluxo atualizado com visual mais profissional. Clique em qualquer modulo para ir
          direto para a tela correta.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('book')}>
            <CalendarPlus size={16} />
            Marcar Consulta
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('appointments')}>
            <CalendarDays size={16} />
            Ver Consultas
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Consultas Agendadas"
          value={`${scheduledCount}`}
          hint="ativas no sistema"
          icon={<CalendarCheck2 size={18} />}
          tone="green"
        />
        <StatCard
          title="Consultas Canceladas"
          value={`${canceledCount}`}
          hint="historico recente"
          icon={<XCircle size={18} />}
          tone="red"
        />
        <StatCard
          title="Acoes Rapidas"
          value="5"
          hint="modulos disponiveis"
          icon={<ChevronRight size={18} />}
          tone="blue"
        />
      </div>

      <section className="panel">
        <div className="panel-title-row">
          <h3>Proxima Consulta</h3>
          <button className="link-btn" onClick={() => onNavigate('appointments')}>
            Ir para lista completa
          </button>
        </div>

        {nextAppointment ? (
          <div className="next-appointment">
            <div>
              <p className="tag">Agendamento #{nextAppointment.id}</p>
              <h4>{nextAppointment.nomeBeneficiario}</h4>
              <p>{formatDateTime(nextAppointment.dataHora)}</p>
            </div>
            <span className="status-ok">{nextAppointment.status}</span>
          </div>
        ) : (
          <p className="empty-hint">Nao existem consultas agendadas no momento.</p>
        )}
      </section>
    </section>
  );
}
