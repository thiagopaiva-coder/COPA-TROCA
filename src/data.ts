/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Sticker, Bid, Swap, Transaction, AppNotification, ActivityLog, UserRole } from './types';

export const SELECOES_MUNDIAL = [
  { nome: 'Brasil', sigla: 'BRA', corGradiente: 'from-green-600 via-yellow-500 to-blue-600', continent: 'América do Sul' },
  { nome: 'Argentina', sigla: 'ARG', corGradiente: 'from-sky-400 via-white to-sky-400', continent: 'América do Sul' },
  { nome: 'França', sigla: 'FRA', corGradiente: 'from-blue-700 via-white to-red-600', continent: 'Europa' },
  { nome: 'Alemanha', sigla: 'GER', corGradiente: 'from-black via-red-600 to-yellow-500', continent: 'Europa' },
  { nome: 'Japão', sigla: 'JPN', corGradiente: 'from-red-600 via-white to-red-500', continent: 'Ásia' },
  { nome: 'Marrocos', sigla: 'MAR', corGradiente: 'from-red-700 via-emerald-600 to-red-700', continent: 'África' },
  { nome: 'Espanha', sigla: 'ESP', corGradiente: 'from-red-600 via-yellow-500 to-red-600', continent: 'Europa' },
  { nome: 'Portugal', sigla: 'POR', corGradiente: 'from-green-700 via-red-600 to-yellow-500', continent: 'Europa' },
  { nome: 'Estados Unidos', sigla: 'USA', corGradiente: 'from-blue-800 via-red-500 to-white', continent: 'América do Norte' },
  { nome: 'México', sigla: 'MEX', corGradiente: 'from-green-800 via-white to-red-600', continent: 'América do Norte' },
];

export const FIGURINHAS_INICIAIS: Sticker[] = [
  {
    id: 'st-1',
    numero: 'BRA 10',
    selecao: 'Brasil',
    imagem: 'from-green-600 via-yellow-500 to-blue-600',
    tipo: 'ambos',
    preco: 250.00,
    raridade: 'lendario',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-2',
    numero: 'ARG 10',
    selecao: 'Argentina',
    imagem: 'from-sky-400 via-white to-sky-300',
    tipo: 'venda',
    preco: 220.00,
    raridade: 'lendario',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-3',
    numero: 'FRA 7',
    selecao: 'França',
    imagem: 'from-blue-700 via-white to-red-600',
    tipo: 'troca',
    raridade: 'raro',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-4',
    numero: 'GER 9',
    selecao: 'Alemanha',
    imagem: 'from-black via-red-600 to-yellow-500',
    tipo: 'venda',
    preco: 45.00,
    raridade: 'comum',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-5',
    numero: 'POR 7',
    selecao: 'Portugal',
    imagem: 'from-green-700 via-red-600 to-yellow-500',
    tipo: 'ambos',
    preco: 180.00,
    raridade: 'lendario',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-6',
    numero: 'JPN 14',
    selecao: 'Japão',
    imagem: 'from-red-600 via-white to-red-500',
    tipo: 'troca',
    raridade: 'comum',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-7',
    numero: 'USA 10',
    selecao: 'Estados Unidos',
    imagem: 'from-blue-800 via-red-500 to-white',
    tipo: 'venda',
    preco: 30.00,
    raridade: 'comum',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-8',
    numero: 'MAR 2',
    selecao: 'Marrocos',
    imagem: 'from-red-700 via-emerald-600 to-red-700',
    tipo: 'troca',
    raridade: 'raro',
    status: 'negociado',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-9',
    numero: 'ESP 8',
    selecao: 'Espanha',
    imagem: 'from-red-600 via-yellow-500 to-red-600',
    tipo: 'venda',
    preco: 50.00,
    raridade: 'comum',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  },
  {
    id: 'st-10',
    numero: 'BRA 9',
    selecao: 'Brasil',
    imagem: 'from-green-600 via-yellow-500 to-blue-600',
    tipo: 'ambos',
    preco: 75.00,
    raridade: 'raro',
    status: 'disponivel',
    criadorId: 'usr-gestor',
    criadorNome: 'Marcos Silva (Gestor)',
  }
];

export const USUARIOS_INICIAIS: User[] = [
  {
    id: 'usr-colecionador',
    nome: 'Thiago Paiva (Colecionador)',
    email: 'colecionador@copatrocas.com.br',
    role: 'colecionador',
    ativo: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    telefone: '(11) 98765-4321',
    wishlist: ['BRA 10', 'ARG 10', 'POR 7'],
    colecao: ['BRA 9', 'USA 10', 'GER 9'],
    repetidas: ['USA 10']
  },
  {
    id: 'usr-gestor',
    nome: 'Marcos Silva (Gestor)',
    email: 'gestor@copatrocas.com.br',
    role: 'gestor',
    ativo: true,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    telefone: '(21) 99999-8888',
    wishlist: [],
    colecao: [],
    repetidas: []
  },
  {
    id: 'usr-admin',
    nome: 'Ana Costa (Admin)',
    email: 'admin@copatrocas.com.br',
    role: 'admin',
    ativo: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    telefone: '(11) 91111-2222',
    wishlist: [],
    colecao: [],
    repetidas: []
  }
];

export const LANCES_INICIAIS: Bid[] = [
  {
    id: 'bid-1',
    stickerId: 'st-1',
    stickerNumero: 'BRA 10',
    stickerSelecao: 'Brasil',
    colecionadorId: 'usr-colecionador',
    colecionadorNome: 'Thiago Paiva (Colecionador)',
    valor: 230.00,
    tipo: 'ambos',
    status: 'pendente',
    data: '2026-06-22T14:30:00Z',
    mensagem: 'Tenho muito interesse nessa figurinha lendária brasileira! Aceita um pequeno desconto ou troca?'
  },
  {
    id: 'bid-2',
    stickerId: 'st-9',
    stickerNumero: 'ESP 8',
    stickerSelecao: 'Espanha',
    colecionadorId: 'usr-colecionador',
    colecionadorNome: 'Thiago Paiva (Colecionador)',
    valor: 50.00,
    tipo: 'venda',
    status: 'aceito',
    data: '2026-06-21T10:00:00Z',
    mensagem: 'Fecho pelo preço oficial.'
  }
];

export const TROCAS_INICIAIS: Swap[] = [
  {
    id: 'swap-1',
    colecionadorId: 'usr-colecionador',
    colecionadorNome: 'Thiago Paiva (Colecionador)',
    stickerId: 'st-3',
    stickerNumero: 'FRA 7',
    stickerSelecao: 'França',
    propostaStickerNumero: 'USA 10',
    status: 'pendente',
    data: '2026-06-23T05:00:00Z'
  },
  {
    id: 'swap-2',
    colecionadorId: 'usr-colecionador',
    colecionadorNome: 'Thiago Paiva (Colecionador)',
    stickerId: 'st-8',
    stickerNumero: 'MAR 2',
    stickerSelecao: 'Marrocos',
    propostaStickerNumero: 'GER 9',
    status: 'concluida',
    data: '2026-06-20T16:45:00Z'
  }
];

export const TRANSACOES_INICIAIS: Transaction[] = [
  {
    id: 'tx-1',
    stickerId: 'st-9',
    stickerNumero: 'ESP 8',
    stickerSelecao: 'Espanha',
    compradorId: 'usr-colecionador',
    compradorNome: 'Thiago Paiva (Colecionador)',
    valor: 50.00,
    data: '2026-06-21T10:05:00Z'
  },
  {
    id: 'tx-2',
    stickerId: 'st-8',
    stickerNumero: 'MAR 2',
    stickerSelecao: 'Marrocos',
    compradorId: 'usr-outro-colecionador',
    compradorNome: 'Gabriel Santos (Parceiro)',
    valor: 45.00,
    data: '2026-06-19T14:12:00Z'
  }
];

export const NOTIFICACOES_INICIAIS: AppNotification[] = [
  {
    id: 'notif-1',
    destinatarioRole: 'gestor',
    remetenteNome: 'Thiago Paiva (Colecionador)',
    tipo: 'lance_recebido',
    mensagem: 'Thiago Paiva enviou um lance de R$ 230,00 para a figurinha BRA 10.',
    data: '2026-06-22T14:30:00Z',
    lida: false,
    stickerId: 'st-1',
    stickerNumero: 'BRA 10'
  },
  {
    id: 'notif-2',
    destinatarioRole: 'usr-colecionador',
    usuarioId: 'usr-colecionador',
    remetenteNome: 'Marcos Silva (Gestor)',
    tipo: 'lance_resposta',
    mensagem: 'Seu lance de R$ 50,00 para a figurinha ESP 8 foi ACEITO! Entre em contato via WhatsApp para entrega.',
    data: '2026-06-21T10:05:00Z',
    lida: false,
    stickerId: 'st-9',
    stickerNumero: 'ESP 8'
  },
  {
    id: 'notif-3',
    destinatarioRole: 'gestor',
    remetenteNome: 'Thiago Paiva (Colecionador)',
    tipo: 'interesse',
    mensagem: 'Thiago Paiva demonstrou interesse na figurinha ARG 10 (Argentina).',
    data: '2026-06-23T06:00:00Z',
    lida: false,
    stickerId: 'st-2',
    stickerNumero: 'ARG 10'
  }
];

export const LOGS_INICIAIS: ActivityLog[] = [
  {
    id: 'log-1',
    usuario: 'Marcos Silva (Gestor)',
    role: 'gestor',
    acao: 'Criação de figurinha',
    detalhes: 'Cadastrou a figurinha lendária BRA 10 (Brasil).',
    data: '2026-06-22T09:15:00Z'
  },
  {
    id: 'log-2',
    usuario: 'Thiago Paiva (Colecionador)',
    role: 'colecionador',
    acao: 'Envio de lance',
    detalhes: 'Enviou uma oferta de R$ 230,00 para BRA 10.',
    data: '2026-06-22T14:30:00Z'
  },
  {
    id: 'log-3',
    usuario: 'Marcos Silva (Gestor)',
    role: 'gestor',
    acao: 'Aceite de oferta',
    detalhes: 'Aceitou proposta de R$ 50,00 de Thiago Paiva por ESP 8.',
    data: '2026-06-21T10:05:00Z'
  },
  {
    id: 'log-4',
    usuario: 'Ana Costa (Admin)',
    role: 'admin',
    acao: 'Acesso Admin',
    detalhes: 'Visualizou logs de atividades e painel geral de segurança.',
    data: '2026-06-23T01:00:00Z'
  }
];

// Helper functions for persistent mock logic in localStorage
const KEYS = {
  STICKERS: 'copatrocas_stickers',
  USERS: 'copatrocas_users',
  BIDS: 'copatrocas_bids',
  SWAPS: 'copatrocas_swaps',
  TRANSACTIONS: 'copatrocas_transactions',
  NOTIFICATIONS: 'copatrocas_notifications',
  LOGS: 'copatrocas_logs',
};

export const initializeDatabase = (force = false) => {
  if (force || !localStorage.getItem(KEYS.STICKERS)) {
    localStorage.setItem(KEYS.STICKERS, JSON.stringify(FIGURINHAS_INICIAIS));
    localStorage.setItem(KEYS.USERS, JSON.stringify(USUARIOS_INICIAIS));
    localStorage.setItem(KEYS.BIDS, JSON.stringify(LANCES_INICIAIS));
    localStorage.setItem(KEYS.SWAPS, JSON.stringify(TROCAS_INICIAIS));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(TRANSACOES_INICIAIS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(NOTIFICACOES_INICIAIS));
    localStorage.setItem(KEYS.LOGS, JSON.stringify(LOGS_INICIAIS));
  }
};

// Raw getters/seters
export const getStickersFromStorage = (): Sticker[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.STICKERS) || '[]');
};

export const saveStickersToStorage = (stickers: Sticker[]) => {
  localStorage.setItem(KEYS.STICKERS, JSON.stringify(stickers));
};

export const getUsersFromStorage = (): User[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
};

export const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getBidsFromStorage = (): Bid[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.BIDS) || '[]');
};

export const saveBidsToStorage = (bids: Bid[]) => {
  localStorage.setItem(KEYS.BIDS, JSON.stringify(bids));
};

export const getSwapsFromStorage = (): Swap[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.SWAPS) || '[]');
};

export const saveSwapsToStorage = (swaps: Swap[]) => {
  localStorage.setItem(KEYS.SWAPS, JSON.stringify(swaps));
};

export const getTransactionsFromStorage = (): Transaction[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
};

export const saveTransactionsToStorage = (txs: Transaction[]) => {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
};

export const getNotificationsFromStorage = (): AppNotification[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
};

export const saveNotificationsToStorage = (notifs: AppNotification[]) => {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
};

export const getLogsFromStorage = (): ActivityLog[] => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]');
};

export const saveLogsToStorage = (logs: ActivityLog[]) => {
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
};

export const addActivityLog = (usuario: string, role: UserRole, acao: string, detalhes: string) => {
  const logs = getLogsFromStorage();
  const newLog: ActivityLog = {
    id: `log-${Date.now()}`,
    usuario,
    role,
    acao,
    detalhes,
    data: new Date().toISOString(),
  };
  logs.unshift(newLog);
  saveLogsToStorage(logs);
};
