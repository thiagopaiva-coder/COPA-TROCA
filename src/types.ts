/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'colecionador' | 'gestor' | 'admin';

export interface User {
  id: string;
  nome: string;
  sobrenome?: string;
  cpf?: string;
  dataNascimento?: string;
  enderecoCompleto?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  email: string;
  role: UserRole;
  ativo: boolean;
  avatar: string;
  telefone?: string;
  wishlist: string[]; // List of sticker IDs or numbers
  colecao: string[]; // List of sticker numbers owned
  repetidas: string[]; // List of sticker numbers held in duplicate
}

export type StickerType = 'venda' | 'troca' | 'ambos';
export type StickerRarity = 'comum' | 'raro' | 'lendario';
export type StickerStatus = 'disponivel' | 'negociado';

export interface Sticker {
  id: string;
  numero: string; // e.g., "BRA 10", "ARG 10"
  selecao: string; // e.g., "Brasil", "Argentina"
  imagem: string; // CSS gradient class or flag indicator
  tipo: StickerType;
  preco?: number; // mandatory if tipo is 'venda' or 'ambos'
  raridade: StickerRarity;
  status: StickerStatus;
  criadorId: string; // Gestor ID
  criadorNome: string;
}

export type BidStatus = 'pendente' | 'aceito' | 'recusado';

export interface Bid {
  id: string;
  stickerId: string;
  stickerNumero: string;
  stickerSelecao: string;
  colecionadorId: string;
  colecionadorNome: string;
  valor: number;
  tipo: 'venda' | 'troca' | 'ambos';
  status: BidStatus;
  data: string;
  mensagem?: string;
}

export type SwapStatus = 'pendente' | 'concluida' | 'cancelada';

export interface Swap {
  id: string;
  colecionadorId: string;
  colecionadorNome: string;
  stickerId: string;
  stickerNumero: string;
  stickerSelecao: string;
  propostaStickerNumero: string; // The sticker number the colecionador offers in return
  status: SwapStatus;
  data: string;
}

export interface Transaction {
  id: string;
  stickerId: string;
  stickerNumero: string;
  stickerSelecao: string;
  compradorId: string;
  compradorNome: string;
  valor: number;
  data: string;
}

export interface AppNotification {
  id: string;
  destinatarioRole: UserRole | string; // can be directed to all gestores or specific user id
  usuarioId?: string; // empty if for everyone, or specific id
  remetenteNome: string;
  tipo: 'interesse' | 'lance_recebido' | 'lance_resposta' | 'troca_proposta' | 'troca_resposta';
  mensagem: string;
  data: string;
  lida: boolean;
  stickerId?: string;
  stickerNumero?: string;
}

export interface ActivityLog {
  id: string;
  usuario: string;
  role: UserRole;
  acao: string;
  detalhes: string;
  data: string;
}
