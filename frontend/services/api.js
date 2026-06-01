const API_BASE_URL = 'http://localhost:8080';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

function buildAuthHeader(login, senha) {
  if (!login || !senha) return {};
  const token = btoa(`${login}:${senha}`);
  return { Authorization: `Basic ${token}` };
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    if (data && typeof data.message === 'string' && data.message) {
      return data.message;
    }
  } catch (error) {
    // Ignore JSON parse errors.
  }

  if (response.status === 400) {
    return 'Dados inválidos. Verifique os campos digitados.';
  }
  if (response.status === 401) {
    return 'Senha incorreta.';
  }
  if (response.status === 403) {
    return 'Cadastro inativo ou pendente de validação pelo FUSEX.';
  }
  if (response.status === 404) {
    return 'Usuário não cadastrado ou não encontrado.';
  }
  if (response.status === 409) {
    return 'Usuário ou CPF já cadastrado.';
  }

  return response.statusText || 'Erro inesperado';
}

async function request(path, { method = 'GET', body, auth } = {}) {
  const headers = { ...JSON_HEADERS, ...(auth ? buildAuthHeader(auth.login, auth.senha) : {}) };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: payload });
}

export function registerBeneficiario(payload) {
  return request('/beneficiarios', { method: 'POST', body: payload });
}

export function listAvailableSlots() {
  return request('/horarios/disponiveis');
}

export function listAppointmentsByBeneficiario(beneficiarioId, auth) {
  return request(`/agendamentos/beneficiario/${beneficiarioId}`, { auth });
}

export function createAppointment(payload, auth) {
  return request('/agendamentos', { method: 'POST', body: payload, auth });
}

export function cancelAppointment(id, auth) {
  return request(`/agendamentos/${id}/cancelamento`, { method: 'PATCH', auth });
}

export function listBeneficiarios(auth) {
  return request('/beneficiarios', { auth });
}

export function validarBeneficiario(id, payload, auth) {
  return request(`/beneficiarios/${id}/validacao`, { method: 'PATCH', body: payload, auth });
}

export function listMedicos(auth) {
  return request('/medicos', { auth });
}

export function createMedico(payload, auth) {
  return request('/medicos', { method: 'POST', body: payload, auth });
}

export function desativarMedico(id, auth) {
  return request(`/medicos/${id}/desativar`, { method: 'PATCH', auth });
}

export function listAllAppointments(auth) {
  return request('/agendamentos', { auth });
}

export function createHorario(payload, auth) {
  return request('/horarios', { method: 'POST', body: payload, auth });
}

export function gerarHorarios(payload, auth) {
  return request('/horarios/geracao', { method: 'POST', body: payload, auth });
}

export function bloquearHorario(id, auth) {
  return request(`/horarios/${id}/bloqueio`, { method: 'PATCH', auth });
}

export function desbloquearHorario(id, auth) {
  return request(`/horarios/${id}/desbloqueio`, { method: 'PATCH', auth });
}

export function bloquearIntervalo(payload, auth) {
  return request('/horarios/bloqueio-intervalo', { method: 'PATCH', body: payload, auth });
}

export function listAllSlots(auth) {
  return request('/horarios', { auth });
}
