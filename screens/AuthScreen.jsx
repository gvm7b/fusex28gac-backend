import React, { useState } from 'react';
import { AlertCircle, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthScreen({
  onLogin,
  onRegister,
  isLoading,
  errorMessage,
  successMessage,
}) {
  const [mode, setMode] = useState('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerCpf, setRegisterCpf] = useState('');
  const [registerPreccp, setRegisterPreccp] = useState('');
  const [registerBirthDate, setRegisterBirthDate] = useState('');
  const [registerTipo, setRegisterTipo] = useState('');

  const handleLogin = async (event) => {
    if (event) event.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) return;
    await onLogin({ login: loginIdentifier, senha: loginPassword });
  };

  const handleRegister = async (event) => {
    if (event) event.preventDefault();
    if (!registerName.trim() || !registerCpf.trim() || !registerBirthDate.trim()) {
      return;
    }

    const ok = await onRegister({
      nomeCompleto: registerName,
      cpf: registerCpf,
      preccp: registerPreccp || null,
      dataNascimento: registerBirthDate,
      tipo: registerTipo || null,
    });

    if (ok) {
      setMode('login');
      setLoginIdentifier(registerCpf);
      setLoginPassword('');
    }
  };

  return (
    <div className="login-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="login-card"
      >
        <div className="login-head">
          <p>FUSEX</p>
          <h1>{mode === 'login' ? 'Modulo Paciente Online' : 'Cadastro de Paciente'}</h1>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login');
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register');
            }}
          >
            <UserPlus size={15} />
            Cadastrar
          </button>
        </div>

        <div className="login-body">
          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <label>CPF, Prontuario, Email ou PREC-CP</label>
              <input
                value={loginIdentifier}
                onChange={(event) => setLoginIdentifier(event.target.value)}
                placeholder="Digite sua identificacao"
                required
              />

              <label>Senha</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Digite sua senha"
                required
              />

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar no Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <label>Nome completo</label>
              <input
                value={registerName}
                onChange={(event) => setRegisterName(event.target.value)}
                placeholder="Digite seu nome completo"
                required
              />

              <label>CPF, Prontuario, Email ou PREC-CP</label>
              <input
                value={registerCpf}
                onChange={(event) => setRegisterCpf(event.target.value)}
                placeholder="Somente numeros"
                required
              />

              <label>PREC-CP (opcional)</label>
              <input
                value={registerPreccp}
                onChange={(event) => setRegisterPreccp(event.target.value)}
                placeholder="Somente numeros"
              />

              <label>Data de nascimento</label>
              <input
                type="date"
                value={registerBirthDate}
                onChange={(event) => setRegisterBirthDate(event.target.value)}
                required
              />

              <label>Tipo (opcional)</label>
              <input
                value={registerTipo}
                onChange={(event) => setRegisterTipo(event.target.value)}
                placeholder="Ex: Militar, Dependente"
              />

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Criar cadastro'}
              </button>

              {successMessage && (
                <div className="register-error">
                  <AlertCircle size={15} />
                  <p>{successMessage}</p>
                </div>
              )}
            </form>
          )}

          {errorMessage && (
            <div className="register-error">
              <AlertCircle size={15} />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="login-warning">
            <AlertCircle size={16} />
            <p>Uso restrito ao publico autorizado do H Gu Criciuma.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
