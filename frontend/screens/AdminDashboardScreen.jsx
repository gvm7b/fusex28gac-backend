import React from 'react';
import { Users, UserPlus, ShieldAlert, Calendar, ClipboardList } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';

export default function AdminDashboardScreen({
  stats,
  onNavigate,
}) {
  return (
    <section className="view-grid">
      <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <h2>Painel Administrativo FUSEX</h2>
        <p>
          Bem-vindo à área de gestão. Aqui você pode validar novos cadastros, gerenciar a escala médica,
          bloquear/desbloquear horários e acompanhar todos os agendamentos.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('admin_beneficiarios')}>
            <UserPlus size={16} />
            Validar Cadastros
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('admin_horarios')}>
            <Calendar size={16} />
            Gerar Horários
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Pacientes Cadastrados"
          value={`${stats.totalBeneficiarios}`}
          hint="total no sistema"
          icon={<Users size={18} />}
          tone="blue"
        />
        <StatCard
          title="Aguardando Validação"
          value={`${stats.pendentesValidacao}`}
          hint="requer atenção"
          icon={<ShieldAlert size={18} />}
          tone={stats.pendentesValidacao > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Total Consultas"
          value={`${stats.totalAgendamentos}`}
          hint="agendadas & canceladas"
          icon={<ClipboardList size={18} />}
          tone="green"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="panel">
          <div className="panel-title-row">
            <h3>Ações Pendentes</h3>
          </div>
          {stats.pendentesValidacao > 0 ? (
            <div style={{ padding: '10px 0' }}>
              <p style={{ color: 'var(--muted)', margin: '0 0 10px 0' }}>
                Existem <strong>{stats.pendentesValidacao}</strong> beneficiários pendentes de validação no sistema.
              </p>
              <button className="btn btn-primary" onClick={() => onNavigate('admin_beneficiarios')}>
                Validar Agora
              </button>
            </div>
          ) : (
            <p className="empty-hint">Nenhum cadastro pendente de validação no momento.</p>
          )}
        </div>

        <div className="panel">
          <div className="panel-title-row">
            <h3>Gerenciamento de Médicos</h3>
          </div>
          <div style={{ padding: '10px 0' }}>
            <p style={{ color: 'var(--muted)', margin: '0 0 10px 0' }}>
              Cadastre novos profissionais e gerencie as especialidades ativas na unidade.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('admin_medicos')}>
              Gerenciar Médicos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
