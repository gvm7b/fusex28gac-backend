import React, { useEffect, useMemo, useState } from 'react';
import { 
  Activity, 
  CalendarDays, 
  CalendarPlus, 
  CalendarX, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck, 
  FileText,
  UserCheck,
  Stethoscope,
  CalendarRange,
  Menu,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthScreen from './screens/AuthScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import AppointmentsScreen from './screens/AppointmentsScreen.jsx';
import BookScreen from './screens/BookScreen.jsx';
import CancelScreen from './screens/CancelScreen.jsx';
import GuideScreen from './screens/GuideScreen.jsx';

// Admin screens
import AdminDashboardScreen from './screens/AdminDashboardScreen.jsx';
import AdminBeneficiariosScreen from './screens/AdminBeneficiariosScreen.jsx';
import AdminMedicosScreen from './screens/AdminMedicosScreen.jsx';
import AdminAgendamentosScreen from './screens/AdminAgendamentosScreen.jsx';
import AdminHorariosScreen from './screens/AdminHorariosScreen.jsx';

import * as api from './services/api.js';

const MENU = [
  { id: 'dashboard', label: 'Painel Principal', icon: LayoutDashboard },
  { id: 'appointments', label: 'Consultas Agendadas', icon: CalendarDays },
  { id: 'book', label: 'Marcar Consulta', icon: CalendarPlus },
  { id: 'cancel', label: 'Cancelar Consulta', icon: CalendarX },
  { id: 'guide', label: 'Guia SIRE', icon: FileText },
];

const ADMIN_MENU = [
  { id: 'admin_dashboard', label: 'Painel Geral', icon: LayoutDashboard },
  { id: 'admin_beneficiarios', label: 'Validar Pacientes', icon: UserCheck },
  { id: 'admin_medicos', label: 'Gerenciar Médicos', icon: Stethoscope },
  { id: 'admin_agendamentos', label: 'Todos Agendamentos', icon: CalendarDays },
  { id: 'admin_horarios', label: 'Gerenciar Horários', icon: CalendarRange },
];

const viewAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22 },
};

export default function SighWebPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authCredentials, setAuthCredentials] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedMedicoId, setSelectedMedicoId] = useState(null);
  const [query, setQuery] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [appointmentsError, setAppointmentsError] = useState('');
  const [slotsError, setSlotsError] = useState('');

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin state
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const isAdmin = useMemo(() => {
    return authUser?.perfil === 'ADMIN' || authUser?.perfil === 'OPERADOR_FUSEX';
  }, [authUser]);

  const currentMenu = isAdmin ? ADMIN_MENU : MENU;

  const userInitials = useMemo(() => {
    if (!authUser?.nomeCompleto) return 'US';
    return authUser.nomeCompleto
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }, [authUser]);

  const filteredAppointments = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return appointments;

    return appointments.filter((item) => {
      const text = `${item.id} ${item.nomeBeneficiario} ${item.status}`.toLowerCase();
      return text.includes(term);
    });
  }, [appointments, query]);

  const selectedSlot = useMemo(
    () => availableSlots.find((slot) => slot.id === selectedSlotId) || null,
    [availableSlots, selectedSlotId]
  );

  const nextAppointment = useMemo(() => {
    const upcoming = appointments
      .filter((item) => item.status === 'AGENDADO')
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

    return upcoming[0] || null;
  }, [appointments]);

  const scheduledCount = appointments.filter((item) => item.status === 'AGENDADO').length;
  const canceledCount = appointments.filter((item) => item.status === 'CANCELADO').length;

  const resetBookingFlow = () => {
    setBookingStep(1);
    setSelectedSlotId(null);
    setSelectedMedicoId(null);
  };

  const navigate = (view) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
    if (view !== 'book') {
      resetBookingFlow();
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toLocalDateTime = (dateString) => (dateString ? `${dateString}T00:00:00` : null);

  const loadAppointments = async (beneficiarioId) => {
    setAppointmentsError('');
    try {
      const data = await api.listAppointmentsByBeneficiario(beneficiarioId);
      setAppointments(data);
    } catch (error) {
      setAppointmentsError(error.message || 'Nao foi possivel carregar os agendamentos.');
    }
  };

  const loadAvailableSlots = async () => {
    setSlotsError('');
    try {
      const data = await api.listAvailableSlots();
      setAvailableSlots(data);
    } catch (error) {
      setSlotsError(error.message || 'Nao foi possivel carregar os horarios.');
    }
  };

  const loadMedicosForPatient = async () => {
    try {
      const data = await api.listMedicos();
      setMedicos(data.filter((m) => m.ativo));
    } catch (error) {
      console.error('Erro ao carregar medicos:', error);
    }
  };

  // Load Admin Data
  const loadAdminData = async (credentials) => {
    if (!credentials) return;
    setAdminLoading(true);
    setAdminError('');
    try {
      const [bData, mData, aData, sData] = await Promise.all([
        api.listBeneficiarios(credentials),
        api.listMedicos(credentials),
        api.listAllAppointments(credentials),
        api.listAllSlots(credentials)
      ]);
      setBeneficiarios(bData);
      setMedicos(mData);
      setAdminAppointments(aData);
      setAvailableSlots(sData);
    } catch (error) {
      setAdminError(error.message || 'Erro ao carregar dados administrativos.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleLogin = async (payload) => {
    setIsAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const user = await api.login(payload);
      setAuthUser(user);
      setIsLoggedIn(true);

      const isUserAdmin = user.perfil === 'ADMIN' || user.perfil === 'OPERADOR_FUSEX';
      if (isUserAdmin) {
        const credentials = { login: payload.login, senha: payload.senha };
        setAuthCredentials(credentials);
        setActiveView('admin_dashboard');
        await loadAdminData(credentials);
      } else {
        setAuthCredentials(null);
        setActiveView('dashboard');
        await Promise.all([
          loadAppointments(user.id),
          loadAvailableSlots(),
        ]);
      }
    } catch (error) {
      setAuthError(error.message || 'Falha ao autenticar.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setIsAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      await api.registerBeneficiario({
        ...payload,
        dataNascimento: toLocalDateTime(payload.dataNascimento),
      });
      setAuthSuccess('Cadastro enviado. Aguarde a validacao do FUSEX para acessar.');
      return true;
    } catch (error) {
      setAuthError(error.message || 'Falha ao cadastrar.');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const finishBooking = async (observacao = null) => {
    if (!authUser || !selectedSlot || !selectedMedicoId) return;

    setSlotsError('');
    try {
      await api.createAppointment(
        {
          beneficiarioId: authUser.id,
          horarioId: selectedSlot.id,
          medicoId: selectedMedicoId,
          observacao: observacao,
        },
        null
      );
      await Promise.all([
        loadAppointments(authUser.id),
        loadAvailableSlots(),
      ]);
      resetBookingFlow();
      setActiveView('appointments');
    } catch (error) {
      setSlotsError(error.message || 'Nao foi possivel concluir o agendamento.');
    }
  };

  const cancelAppointment = async (id) => {
    if (!authUser) return;

    setAppointmentsError('');
    try {
      await api.cancelAppointment(id);
      await Promise.all([
        loadAppointments(authUser.id),
        loadAvailableSlots(),
      ]);
    } catch (error) {
      setAppointmentsError(error.message || 'Nao foi possivel cancelar o agendamento.');
    }
  };

  // Admin Actions
  const handleValidarBeneficiario = async (id, aprovado) => {
    setAdminError('');
    try {
      await api.validarBeneficiario(id, { aprovado, validadoPorUserId: authUser.id }, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao validar beneficiário.');
    }
  };

  const handleRegisterMedico = async (payload) => {
    setAdminError('');
    try {
      await api.createMedico(payload, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao cadastrar médico.');
    }
  };

  const handleToggleMedicoStatus = async (id) => {
    setAdminError('');
    try {
      await api.desativarMedico(id, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao desativar médico.');
    }
  };

  const handleGerarHorarios = async (payload) => {
    setAdminError('');
    try {
      await api.gerarHorarios(payload, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao gerar horários.');
    }
  };

  const handleBloquearIntervalo = async (payload) => {
    setAdminError('');
    try {
      await api.bloquearIntervalo(payload, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao bloquear intervalo.');
    }
  };

  const handleBloquearSlot = async (id) => {
    setAdminError('');
    try {
      await api.bloquearHorario(id, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao bloquear horário.');
    }
  };

  const handleDesbloquearSlot = async (id) => {
    setAdminError('');
    try {
      await api.desbloquearHorario(id, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao desbloquear horário.');
    }
  };

  const handleCancelAdminAppointment = async (id) => {
    setAdminError('');
    try {
      await api.cancelAppointment(id, authCredentials);
      await loadAdminData(authCredentials);
    } catch (error) {
      setAdminError(error.message || 'Erro ao cancelar agendamento.');
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      if (activeView === 'book') {
        loadAvailableSlots();
        loadMedicosForPatient();
      } else if (activeView === 'dashboard' || activeView === 'appointments' || activeView === 'cancel') {
        loadAppointments(authUser.id);
        loadAvailableSlots();
      }
    }
  }, [isLoggedIn, isAdmin, activeView]);

  const adminStats = useMemo(() => {
    const totalBeneficiarios = beneficiarios.length;
    const pendentesValidacao = beneficiarios.filter((b) => b.statusCadastro === 'PENDENTE_VALIDACAO').length;
    const totalAgendamentos = adminAppointments.length;
    return {
      totalBeneficiarios,
      pendentesValidacao,
      totalAgendamentos,
    };
  }, [beneficiarios, adminAppointments]);

  if (!isLoggedIn) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isAuthLoading}
        errorMessage={authError}
        successMessage={authSuccess}
      />
    );
  }

  return (
    <div className="portal-root">
      {/* Mobile sidebar overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="shield-badge">
            <ShieldCheck size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="brand-title">SIGH-WEB</p>
            <p className="brand-subtitle">H Gu Criciuma</p>
          </div>
          <button className="menu-close-btn" onClick={() => setIsMobileMenuOpen(false)} title="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="menu-list">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;

            return (
              <button key={item.id} className={`menu-item ${active ? 'active' : ''}`} onClick={() => navigate(item.id)}>
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{userInitials}</div>
            <div>
              <p className="user-name">{authUser?.nomeCompleto || 'Usuario'}</p>
              <p className="user-id">{isAdmin ? 'ADMINISTRADOR' : `ID: ${authUser?.id || '-'}`}</p>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              setIsLoggedIn(false);
              setAuthUser(null);
              setAuthCredentials(null);
              setAppointments([]);
              setAvailableSlots([]);
              setBeneficiarios([]);
              setMedicos([]);
              setAdminAppointments([]);
              setQuery('');
              setActiveView('dashboard');
            }}
          >
            <LogOut size={15} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <button className="menu-toggle-btn" onClick={() => setIsMobileMenuOpen(true)} title="Abrir menu">
            <Menu size={22} />
          </button>
          <div className="topbar-info">
            <h1>{isAdmin ? 'Painel Administrativo' : 'Painel do Paciente'}</h1>
            <p>{isAdmin ? 'Gestão operacional de pacientes, médicos, consultas e grade de horários.' : 'Modulo paciente online com fluxo modernizado e navegacao funcional.'}</p>
          </div>
          <div className="status-pill">
            <Activity size={16} />
            Sistema operacional
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* Patient Views */}
          {!isAdmin && activeView === 'dashboard' && (
            <motion.section key="dashboard" {...viewAnimation}>
              <DashboardScreen
                scheduledCount={scheduledCount}
                canceledCount={canceledCount}
                nextAppointment={nextAppointment}
                onNavigate={navigate}
                formatDateTime={formatDateTime}
              />
            </motion.section>
          )}

          {!isAdmin && activeView === 'appointments' && (
            <motion.section key="appointments" {...viewAnimation}>
              <AppointmentsScreen
                query={query}
                onQueryChange={setQuery}
                appointments={filteredAppointments}
                errorMessage={appointmentsError}
                formatDateTime={formatDateTime}
              />
            </motion.section>
          )}

          {!isAdmin && activeView === 'book' && (
            <motion.section key="book" {...viewAnimation}>
              <BookScreen
                bookingStep={bookingStep}
                medicos={medicos}
                selectedMedicoId={selectedMedicoId}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onReset={resetBookingFlow}
                onSelectMedico={(id) => {
                  setSelectedMedicoId(id);
                  setBookingStep(2);
                }}
                onBackToMedicos={() => setBookingStep(1)}
                onSelectSlot={(id) => {
                  setSelectedSlotId(id);
                  setBookingStep(3);
                }}
                onBackToSlots={() => setBookingStep(2)}
                onConfirm={finishBooking}
                errorMessage={slotsError}
                formatDateTime={formatDateTime}
              />
            </motion.section>
          )}

          {!isAdmin && activeView === 'cancel' && (
            <motion.section key="cancel" {...viewAnimation}>
              <CancelScreen
                appointments={appointments}
                onCancel={cancelAppointment}
                formatDateTime={formatDateTime}
              />
            </motion.section>
          )}

          {!isAdmin && activeView === 'guide' && (
            <motion.section key="guide" {...viewAnimation}>
              <GuideScreen />
            </motion.section>
          )}

          {/* Admin Views */}
          {isAdmin && activeView === 'admin_dashboard' && (
            <motion.section key="admin_dashboard" {...viewAnimation}>
              <AdminDashboardScreen
                stats={adminStats}
                onNavigate={navigate}
              />
            </motion.section>
          )}

          {isAdmin && activeView === 'admin_beneficiarios' && (
            <motion.section key="admin_beneficiarios" {...viewAnimation}>
              <AdminBeneficiariosScreen
                beneficiarios={beneficiarios}
                onValidar={handleValidarBeneficiario}
                isLoading={adminLoading}
                errorMessage={adminError}
              />
            </motion.section>
          )}

          {isAdmin && activeView === 'admin_medicos' && (
            <motion.section key="admin_medicos" {...viewAnimation}>
              <AdminMedicosScreen
                medicos={medicos}
                onAddMedico={handleRegisterMedico}
                onToggleStatus={handleToggleMedicoStatus}
                isLoading={adminLoading}
                errorMessage={adminError}
              />
            </motion.section>
          )}

          {isAdmin && activeView === 'admin_agendamentos' && (
            <motion.section key="admin_agendamentos" {...viewAnimation}>
              <AdminAgendamentosScreen
                appointments={adminAppointments}
                onCancel={handleCancelAdminAppointment}
                formatDateTime={formatDateTime}
                isLoading={adminLoading}
                errorMessage={adminError}
              />
            </motion.section>
          )}

          {isAdmin && activeView === 'admin_horarios' && (
            <motion.section key="admin_horarios" {...viewAnimation}>
              <AdminHorariosScreen
                slots={availableSlots}
                onGerarHorarios={handleGerarHorarios}
                onBloquearIntervalo={handleBloquearIntervalo}
                onBloquearSlot={handleBloquearSlot}
                onDesbloquearSlot={handleDesbloquearSlot}
                formatDateTime={formatDateTime}
                isLoading={adminLoading}
                errorMessage={adminError}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
