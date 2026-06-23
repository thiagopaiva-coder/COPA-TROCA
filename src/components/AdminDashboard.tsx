/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Shield, Star, RefreshCw, Layers, ShieldAlert, 
  ToggleLeft, ToggleRight, Trash2, Calendar, FileClock, Search, CheckCircle, XCircle 
} from 'lucide-react';
import { User, Sticker, Transaction, ActivityLog } from '../types';

interface AdminDashboardProps {
  users: User[];
  stickers: Sticker[];
  transactions: Transaction[];
  logs: ActivityLog[];
  onToggleUserStatus: (id: string) => void;
  onDeleteStickerGlobal: (id: string) => void;
  onClearLogs: () => void;
}

export default function AdminDashboard({
  users,
  stickers,
  transactions,
  logs,
  onToggleUserStatus,
  onDeleteStickerGlobal,
  onClearLogs
}: AdminDashboardProps) {
  // Local active administrative tab: 'usuarios' | 'figurinhas' | 'auditoria'
  const [activeAdminTab, setActiveAdminTab] = useState<'usuarios' | 'figurinhas' | 'auditoria'>('usuarios');
  
  // Search state
  const [userQuery, setUserQuery] = useState('');
  const [stickerQuery, setStickerQuery] = useState('');

  // Calculations
  const activeUsersCount = users.filter(u => u.ativo).length;
  const totalVolume = transactions.reduce((acc, current) => acc + current.valor, 0);

  // Filters
  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(userQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredStickers = stickers.filter(sticker => 
    sticker.numero.toLowerCase().includes(stickerQuery.toLowerCase()) ||
    sticker.selecao.toLowerCase().includes(stickerQuery.toLowerCase()) ||
    sticker.raridade.toLowerCase().includes(stickerQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner de Boas Vindas */}
      <div className="mb-8 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/25 rounded-xl flex items-center justify-center text-yellow-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Painel Administrativo da Plataforma</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Console de auditoria, permissões de usuários e integridade de dados gerais do Copa Trocas.</p>
          </div>
        </div>
      </div>

      {/* Bento-style metrics block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="p-5 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Total de Usuários</span>
            <div className="p-1 px-2 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/15">Sincronizado</div>
          </div>
          <h3 className="text-3xl font-black text-white">{users.length}</h3>
          <p className="text-[10px] text-neutral-400 mt-2">{activeUsersCount} usuários ativos atualmente no app</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Figurinhas Ativas</span>
            <div className="p-1 px-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-[10px] font-bold border border-yellow-400/15">Estoque</div>
          </div>
          <h3 className="text-3xl font-black text-white">{stickers.length}</h3>
          <p className="text-[10px] text-neutral-400 mt-2">{stickers.filter(s => s.status === 'disponivel').length} disponíveis para lances/trocas</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Movimentação Financeira</span>
            <div className="p-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/15">Volume</div>
          </div>
          <h3 className="text-3xl font-black text-white">R$ {totalVolume.toFixed(2)}</h3>
          <p className="text-[10px] text-neutral-400 mt-2">{transactions.length} transações comerciais registradas</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Logs de Auditoria</span>
            <div className="p-1 px-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/15">Logs</div>
          </div>
          <h3 className="text-3xl font-black text-white">{logs.length}</h3>
          <p className="text-[10px] text-neutral-400 mt-2">Ações monitoradas para garantir segurança</p>
        </div>
      </div>

      {/* Admin inner menu */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('usuarios')}
          className={`px-5 py-3 font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeAdminTab === 'usuarios' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Gestão de Usuários
        </button>
        <button
          onClick={() => setActiveAdminTab('figurinhas')}
          className={`px-5 py-3 font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeAdminTab === 'figurinhas' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Monitor Geral de Figurinhas
        </button>
        <button
          onClick={() => setActiveAdminTab('auditoria')}
          className={`px-5 py-3 font-semibold text-xs transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeAdminTab === 'auditoria' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileClock className="w-4 h-4" />
          Logs de Auditoria ({logs.length})
        </button>
      </div>

      {/* Admin Inner Views */}
      <AnimatePresence mode="wait">
        {/* SUBTAB 1: USUÁRIOS */}
        {activeAdminTab === 'usuarios' && (
          <motion.div
            key="usuarios_admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Search filter for users */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Search className="w-4.5 h-4.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome, email ou ator (colecionador, gestor)..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-neutral-500"
              />
            </div>

            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-[32px] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-widest text-[9px]">
                    <th className="py-4 px-6">Avatar</th>
                    <th className="py-4 px-6">Nome Completo</th>
                    <th className="py-4 px-6">E-mail</th>
                    <th className="py-4 px-6">Perfil do Ator</th>
                    <th className="py-4 px-6">Status Conta</th>
                    <th className="py-4 px-6 text-right">Ações de Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-6">
                        <img 
                          src={user.avatar} 
                          alt={user.nome} 
                          className="w-8 h-8 rounded-full border border-white/15 object-cover"
                        />
                      </td>
                      <td className="py-3 px-6 font-bold text-white">{user.nome}</td>
                      <td className="py-3 px-6 text-neutral-400">{user.email}</td>
                      <td className="py-3 px-6 text-neutral-300 capitalize">{user.role}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          user.ativo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                        }`}>
                          {user.ativo ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => onToggleUserStatus(user.id)}
                          className={`p-1.5 px-3 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                            user.ativo 
                            ? 'bg-red-600/10 text-red-400 border-red-500/20 hover:bg-red-600/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          {user.ativo ? 'Desativar Usuário' : 'Ativar Usuário'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: FIGURINHAS GLOBAIS */}
        {activeAdminTab === 'figurinhas' && (
          <motion.div
            key="figurinhas_admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Search filter for stickers */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Search className="w-4.5 h-4.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Pesquisar por número do cromo, seleção ou raridade (lendario, raro, comum)..."
                value={stickerQuery}
                onChange={(e) => setStickerQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-neutral-500"
              />
            </div>

            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-[32px] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-widest text-[9px]">
                    <th className="py-4 px-6">ID Cromo</th>
                    <th className="py-4 px-6">Número</th>
                    <th className="py-4 px-6">Seleção</th>
                    <th className="py-4 px-6">Raridade</th>
                    <th className="py-4 px-6">Modalidade</th>
                    <th className="py-4 px-6">Valor Declarado</th>
                    <th className="py-4 px-6">Status no Canal</th>
                    <th className="py-4 px-6 text-right">Moderador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200">
                  {filteredStickers.map(sticker => (
                    <tr key={sticker.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-6 text-neutral-500">#{sticker.id}</td>
                      <td className="py-3 px-6 font-bold text-white">{sticker.numero}</td>
                      <td className="py-3 px-6 text-neutral-300">{sticker.selecao}</td>
                      <td className="py-3 px-6 font-bold uppercase">{sticker.raridade}</td>
                      <td className="py-3 px-6 uppercase">{sticker.tipo}</td>
                      <td className="py-3 px-6 font-bold">{sticker.preco ? `R$ ${sticker.preco.toFixed(2)}` : 'Somente Troca'}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-block py-0.5 px-2 rounded font-bold uppercase text-[9px] ${
                          sticker.status === 'disponivel' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-300'
                        }`}>
                          {sticker.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => {
                            if(confirm(`Tem certeza que deseja moderar e excluir permanentemente a figurinha ${sticker.numero}?`)){
                              onDeleteStickerGlobal(sticker.id);
                            }
                          }}
                          className="p-1 px-2.5 bg-red-600/10 hover:bg-red-600/25 border border-red-500/10 text-red-400 font-semibold rounded text-[10px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Deletar Cromo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: AUDITORIA / ACTIVITY LOGS */}
        {activeAdminTab === 'auditoria' && (
          <motion.div
            key="auditoria_admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">Linha do tempo em tempo real das atividades efetuadas pelos usuários logados.</p>
              <button
                onClick={onClearLogs}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white border border-white/5 cursor-pointer"
              >
                Limpar Logs
              </button>
            </div>

            <div className="bg-white/2 border border-white/5 rounded-[32px] p-6 shadow-2xl space-y-4 max-h-[500px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">Nenhuma atividade registrada.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white">{log.usuario}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase font-bold ${
                          log.role === 'admin' ? 'bg-yellow-400 text-neutral-950' :
                          log.role === 'gestor' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {log.role}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="font-semibold text-yellow-300">{log.acao}</span>
                      </div>
                      <p className="text-neutral-300">{log.detalhes}</p>
                    </div>

                    <div className="text-neutral-500 text-[10px] flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(log.data).toLocaleDateString()} {new Date(log.data).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
