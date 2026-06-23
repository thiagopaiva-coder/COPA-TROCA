/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, Edit2, Trash2, Coins, ArrowRightLeft, TrendingUp, 
  CheckCircle, XCircle, FileText, BarChart3, Filter, ShieldCheck, RefreshCw, UserCheck 
} from 'lucide-react';
import { Sticker, Bid, Swap, Transaction, AppNotification, StickerType, StickerRarity, UserRole, User } from '../types';
import { SELECOES_MUNDIAL } from '../data';
import UserProfileForm from './UserProfileForm';

interface GestorDashboardProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
  stickers: Sticker[];
  bids: Bid[];
  swaps: Swap[];
  transactions: Transaction[];
  onAddSticker: (sticker: Omit<Sticker, 'id' | 'criadorId' | 'criadorNome' | 'status'>) => void;
  onEditSticker: (id: string, updated: Partial<Sticker>) => void;
  onDeleteSticker: (id: string) => void;
  onUpdateBidStatus: (id: string, status: 'aceito' | 'recusado') => void;
  onUpdateSwapStatus: (id: string, status: 'concluida' | 'cancelada') => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'data'>) => void;
  onAddNotification: (notif: Omit<AppNotification, 'id' | 'data' | 'lida'>) => void;
  onAddActivityLog: (acao: string, detalhes: string) => void;
}

export default function GestorDashboard({
  currentUser,
  onUpdateUser,
  stickers,
  bids,
  swaps,
  transactions,
  onAddSticker,
  onEditSticker,
  onDeleteSticker,
  onUpdateBidStatus,
  onUpdateSwapStatus,
  onAddTransaction,
  onAddNotification,
  onAddActivityLog,
}: GestorDashboardProps) {
  // Navigation tabs: 'postar' | 'lances_pendentes' | 'controle_trocas' | 'controle_financeiro' | 'dados'
  const [activeTab, setActiveTab] = useState<'postar' | 'lances_pendentes' | 'controle_trocas' | 'controle_financeiro' | 'dados'>('postar');

  // New/Edit sticker form state
  const [isEditingMode, setIsEditingMode] = useState<string | null>(null); // sticker ID if editing
  const [numero, setNumero] = useState('');
  const [selecao, setSelecao] = useState('Brasil');
  const [tipo, setTipo] = useState<StickerType>('venda');
  const [preco, setPreco] = useState<number | string>('');
  const [raridade, setRaridade] = useState<StickerRarity>('comum');

  const handleCreateOrEditSticker = (e: React.FormEvent) => {
    e.preventDefault();

    if (!numero.trim()) {
      alert('Por favor digite o número da figurinha');
      return;
    }

    const selectedTeam = SELECOES_MUNDIAL.find(s => s.nome === selecao);
    const resolvedGradient = selectedTeam ? selectedTeam.corGradiente : 'from-indigo-600 via-purple-500 to-pink-500';

    if (isEditingMode) {
      // Edit mode
      onEditSticker(isEditingMode, {
        numero: numero.trim().toUpperCase(),
        selecao,
        tipo,
        preco: tipo !== 'troca' ? Number(preco) : undefined,
        raridade,
        imagem: resolvedGradient
      });
      onAddActivityLog('Catalogação: Edição', `Editou informações da figurinha ${numero.trim().toUpperCase()} (${selecao}).`);
      alert('Figurinha editada com sucesso!');
      setIsEditingMode(null);
    } else {
      // Create mode
      onAddSticker({
        numero: numero.trim().toUpperCase(),
        selecao,
        tipo,
        preco: tipo !== 'troca' ? Number(preco) : undefined,
        raridade,
        imagem: resolvedGradient
      });
      onAddActivityLog('Catalogação: Criação', `Cadastrou nova figurinha ${numero.trim().toUpperCase()} (${selecao}) no estoque.`);
      alert('Nova figurinha catalogada no sistema!');
    }

    // Reset fields
    setNumero('');
    setTipo('venda');
    setPreco('');
    setRaridade('comum');
  };

  const startEdit = (sticker: Sticker) => {
    setIsEditingMode(sticker.id);
    setNumero(sticker.numero);
    setSelecao(sticker.selecao);
    setTipo(sticker.tipo);
    setPreco(sticker.preco || '');
    setRaridade(sticker.raridade);
    setActiveTab('postar'); // switch to editor tab
  };

  const cancelEdit = () => {
    setIsEditingMode(null);
    setNumero('');
    setTipo('venda');
    setPreco('');
    setRaridade('comum');
  };

  const handleAcceptBid = (bid: Bid) => {
    // 1. Update bid status
    onUpdateBidStatus(bid.id, 'aceito');

    // 2. Mark sticker as negotiated
    onEditSticker(bid.stickerId, { status: 'negociado' });

    // 3. Register transaction
    onAddTransaction({
      stickerId: bid.stickerId,
      stickerNumero: bid.stickerNumero,
      stickerSelecao: bid.stickerSelecao,
      compradorId: bid.colecionadorId,
      compradorNome: bid.colecionadorNome,
      valor: bid.valor
    });

    // 4. Send notification to user
    onAddNotification({
      destinatarioRole: bid.colecionadorId,
      usuarioId: bid.colecionadorId,
      remetenteNome: 'Marcos Silva (Gestor)',
      tipo: 'lance_resposta',
      mensagem: `Parabéns! Seu lance de R$ ${bid.valor.toFixed(2)} por ${bid.stickerNumero} foi ACEITO pelo Gestor. Entre em contato para combinar a coleta.`,
      stickerId: bid.stickerId,
      stickerNumero: bid.stickerNumero
    });

    onAddActivityLog(
      'Lance de Compra Aceito',
      `Aceitou lance de R$ ${bid.valor.toFixed(2)} enviado por ${bid.colecionadorNome} pela figurinha ${bid.stickerNumero}.`
    );

    alert('Oferta aceita! Transação registrada com sucesso para fins financeiros.');
  };

  const handleRefuseBid = (bid: Bid) => {
    onUpdateBidStatus(bid.id, 'recusado');

    onAddNotification({
      destinatarioRole: bid.colecionadorId,
      usuarioId: bid.colecionadorId,
      remetenteNome: 'Marcos Silva (Gestor)',
      tipo: 'lance_resposta',
      mensagem: `Seu lance de R$ ${bid.valor.toFixed(2)} por ${bid.stickerNumero} foi recusado pelo Gestor de trocas.`,
      stickerId: bid.stickerId,
      stickerNumero: bid.stickerNumero
    });

    onAddActivityLog(
      'Lance de Compra Recusado',
      `Recusou lance de R$ ${bid.valor.toFixed(2)} de ${bid.colecionadorNome} pela figurinha ${bid.stickerNumero}.`
    );

    alert('Oferta recusada e colecionador notificado.');
  };

  const handleAcceptSwap = (swap: Swap) => {
    // 1. Complete Swap
    onUpdateSwapStatus(swap.id, 'concluida');

    // 2. Mark sticker as negotiated
    onEditSticker(swap.stickerId, { status: 'negociado' });

    // 3. Send Notification to Colecionador
    onAddNotification({
      destinatarioRole: swap.colecionadorId,
      usuarioId: swap.colecionadorId,
      remetenteNome: 'Marcos Silva (Gestor)',
      tipo: 'troca_resposta',
      mensagem: `Sua proposta de troca para ${swap.stickerNumero} da sua repetida ${swap.propostaStickerNumero} foi APROVADA e CONCLUÍDA!`,
      stickerId: swap.stickerId,
      stickerNumero: swap.stickerNumero
    });

    onAddActivityLog(
      'Troca Confirmada',
      `Aprovou proposta de troca de ${swap.colecionadorNome}: cedeu ${swap.stickerNumero} e obteve cromo repetido ${swap.propostaStickerNumero}.`
    );

    alert('Troca de figurinhas autorizada e consolidada com sucesso!');
  };

  const handleRefuseSwap = (swap: Swap) => {
    onUpdateSwapStatus(swap.id, 'cancelada');

    onAddNotification({
      destinatarioRole: swap.colecionadorId,
      usuarioId: swap.colecionadorId,
      remetenteNome: 'Marcos Silva (Gestor)',
      tipo: 'troca_resposta',
      mensagem: `Sua proposta de troca de ${swap.propostaStickerNumero} por ${swap.stickerNumero} foi cancelada/recusada pelo Gestor.`,
      stickerId: swap.stickerId,
      stickerNumero: swap.stickerNumero
    });

    onAddActivityLog(
      'Troca Recusada',
      `Cancelou proposta de troca de ${swap.colecionadorNome} envolvendo cromo ${swap.stickerNumero}.`
    );

    alert('Proposta de troca cancelada.');
  };

  // Financial Stats calculation
  const totalReceived = transactions.reduce((acc, tx) => acc + tx.valor, 0);
  const activePostings = stickers.length;
  const pendingBids = bids.filter(b => b.status === 'pendente').length;
  const activeSwaps = swaps.filter(s => s.status === 'pendente').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Visual Header */}
      <div className="mb-8 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{currentUser.nome}</h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold">GESTOR DE VENDAS</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Status da Loja: <span className="text-emerald-400 font-semibold">• ONLINE</span> • Controle financeiro e de trocas unificado</p>
        </div>

        {/* Action summaries */}
        <div className="flex gap-4">
          <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Receita Total</span>
            <span className="text-lg font-black text-emerald-400">R$ {totalReceived.toFixed(2)}</span>
          </div>
          <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Postados</span>
            <span className="text-lg font-black text-yellow-300">{activePostings} itens</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('postar')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'postar' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4.5 h-4.5" />
          {isEditingMode ? 'Editando Figurinha' : 'Catalogar Cromos'}
        </button>
        <button
          onClick={() => setActiveTab('lances_pendentes')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'lances_pendentes' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white relative'
          }`}
        >
          <Coins className="w-4.5 h-4.5" />
          Propostas Financeiras ({pendingBids})
          {pendingBids > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('controle_trocas')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'controle_trocas' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white relative'
          }`}
        >
          <ArrowRightLeft className="w-4.5 h-4.5" />
          Histórico de Trocas ({activeSwaps})
          {activeSwaps > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('controle_financeiro')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'controle_financeiro' 
              ? 'border-yellow-400 text-yellow-300 bg-white/10' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5" />
          Painel Financeiro
        </button>
        <button
          onClick={() => setActiveTab('dados')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'dados' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4.5 h-4.5" />
          Ficha Cadastral IP
        </button>
      </div>

      {/* Tabs display */}
      <AnimatePresence mode="wait">
        {/* TAB 1: CATALOGAÇÃO & CRIAÇÃO */}
        {activeTab === 'postar' && (
          <motion.div
            key="postar_tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left: Sticker Creator Form */}
            <div className="lg:col-span-1 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl h-fit">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white mb-4">
                {isEditingMode ? 'Editar Formulário' : 'Catalogar Novo Cromo'}
              </h3>

              <form onSubmit={handleCreateOrEditSticker} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-1">Código / Número</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="Ex: BRA 10"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-1">Seleção / País</label>
                  <select
                    value={selecao}
                    onChange={(e) => setSelecao(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  >
                    {SELECOES_MUNDIAL.map(sel => (
                      <option key={sel.nome} value={sel.nome}>{sel.nome} ({sel.sigla})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-2">Modalidade do Anúncio</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as StickerType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="venda">Apenas Venda</option>
                    <option value="troca">Apenas Troca</option>
                    <option value="ambos">Venda & Troca (Duplo)</option>
                  </select>
                </div>

                {tipo !== 'troca' && (
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-1">Preço Sugerido (R$)</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 45.00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-2">Raridade Estatística</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['comum', 'raro', 'lendario'] as StickerRarity[]).map(rar => (
                      <button
                        key={rar}
                        type="button"
                        onClick={() => setRaridade(rar)}
                        className={`py-2 text-[10px] uppercase font-bold rounded-xl border transition-all ${
                          raridade === rar 
                            ? 'bg-yellow-400 text-neutral-950 border-yellow-400' 
                            : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {rar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {isEditingMode && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 py-2.5 bg-red-600/25 hover:bg-red-600/40 text-red-200 border border-red-500/20 rounded-xl font-bold text-xs"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold rounded-xl text-xs shadow-lg transition-transform"
                  >
                    {isEditingMode ? 'Atualizar Cromo' : 'Publicar no Catálogo'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Existing Inventory list to edit / delete */}
            <div className="lg:col-span-2 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Gerenciar Catálogo Ativo ({stickers.length} figurinhas no ar)</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stickers.map(sticker => (
                  <div 
                    key={sticker.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {/* Color background */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${sticker.imagem} flex flex-col justify-between p-1.5 overflow-hidden font-mono text-[9px] font-bold text-white shadow`}>
                        <span className="text-[7px] text-right block uppercase">{sticker.raridade}</span>
                        <span className="text-center truncate">{sticker.numero}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white uppercase">{sticker.numero}</span>
                          <span className="text-[9px] text-neutral-400">({sticker.selecao})</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          Tipo: {sticker.tipo.toUpperCase()} • 
                          {sticker.preco ? ` R$ ${sticker.preco.toFixed(2)}` : ' Apenas Troca'}
                        </p>
                        <span className={`inline-block text-[9px] px-1.5 rounded uppercase font-bold mt-1 ${
                          sticker.status === 'disponivel' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                        }`}>
                          {sticker.status === 'disponivel' ? 'Disponível' : 'Esgotada'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => startEdit(sticker)}
                        className="p-1 px-2 text-[10px] bg-white/10 hover:bg-yellow-400/20 text-yellow-300 font-semibold rounded-lg flex items-center gap-1 border border-white/10"
                      >
                        <Edit2 className="w-3 h-3" /> Editar
                      </button>
                      <button
                        onClick={() => {
                          if(confirm('Tem certeza que deseja remover esta figurinha do catálogo?')) {
                            onDeleteSticker(sticker.id);
                            onAddActivityLog('Catalogação: Exclusão', `Removeu figurinha ${sticker.numero} do estoque.`);
                          }
                        }}
                        className="p-1 px-2 text-[10px] bg-red-600/20 hover:bg-red-600/40 text-red-300 font-semibold rounded-lg flex items-center gap-1 border border-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LANCES RECEBIDOS (VENDAS) */}
        {activeTab === 'lances_pendentes' && (
          <motion.div
            key="lances_tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Gerenciar Lances e Propostas Financeiras Recebidas</h3>

            {bids.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-12">Não há lances recebidos até o momento.</p>
            ) : (
              <div className="space-y-4">
                {bids.map(bid => (
                  <div 
                    key={bid.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                      bid.status === 'pendente' 
                        ? 'bg-yellow-400/5 border-yellow-400/20' 
                        : 'bg-white/2 border-white/5 opacity-80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase">{bid.stickerNumero} ({bid.stickerSelecao})</span>
                        <span className="text-[10px] text-neutral-400">• ofertado por: {bid.colecionadorNome}</span>
                      </div>
                      <p className="text-sm font-extrabold text-yellow-300">Valor Proposto: R$ {bid.valor.toFixed(2)}</p>
                      {bid.mensagem && <p className="text-xs text-neutral-300 italic">"{bid.mensagem}"</p>}
                      <span className="text-[10px] text-neutral-500 block">Proposto em {new Date(bid.data).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {bid.status === 'pendente' ? (
                        <>
                          <button
                            onClick={() => handleAcceptBid(bid)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs flex items-center gap-1 shadow"
                          >
                            <CheckCircle className="w-4 h-4" /> Aceitar Proposta
                          </button>
                          <button
                            onClick={() => handleRefuseBid(bid)}
                            className="px-3.5 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 font-semibold text-xs flex items-center gap-1 border border-red-500/20"
                          >
                            <XCircle className="w-4 h-4" /> Recusar
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold uppercase py-1 px-3.5 rounded-full ${
                          bid.status === 'aceito' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {bid.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: CONTROLE DE TROCAS */}
        {activeTab === 'controle_trocas' && (
          <motion.div
            key="trocas_tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Controle Geral de Propostas de Troca</h3>

            {swaps.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-12">Não há propostas de trocas registradas.</p>
            ) : (
              <div className="space-y-4">
                {swaps.map(swap => (
                  <div 
                    key={swap.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                      swap.status === 'pendente' 
                        ? 'bg-blue-400/5 border-blue-400/20 shadow' 
                        : 'bg-white/2 border-white/5 opacity-80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Troca de: {swap.stickerNumero} ({swap.stickerSelecao})</span>
                        <span className="text-neutral-400 text-xs font-bold">por</span>
                        <span className="text-xs font-bold text-yellow-300">{swap.propostaStickerNumero}</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">Colecionador Solicitante: {swap.colecionadorNome}</p>
                      <span className="text-[10px] text-neutral-500 block">Proposto em {new Date(swap.data).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {swap.status === 'pendente' ? (
                        <>
                          <button
                            onClick={() => handleAcceptSwap(swap)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs flex items-center gap-1 shadow"
                          >
                            <CheckCircle className="w-4 h-4" /> Aprovar Troca
                          </button>
                          <button
                            onClick={() => handleRefuseSwap(swap)}
                            className="px-3.5 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 font-semibold text-xs flex items-center gap-1 border border-red-500/20"
                          >
                            <XCircle className="w-4 h-4" /> Recusar
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold uppercase py-1 px-3.5 rounded-full ${
                          swap.status === 'concluida' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {swap.status === 'concluida' ? 'Concluída' : swap.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: PAINEL FINANCEIRO */}
        {activeTab === 'controle_financeiro' && (
          <motion.div
            key="financeiro_tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Bento charts and totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1 */}
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-widest block mb-1">Volume Total de Transações</span>
                  <h3 className="text-3xl font-extrabold text-white">R$ {totalReceived.toFixed(2)}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-4 font-semibold">
                  <TrendingUp className="w-4.5 h-4.5" />
                  <span>Crescimento de +12% esta semana</span>
                </div>
              </div>

              {/* Box 2 (Custom CSS Bars chart of revenues by team) */}
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl col-span-2">
                <h4 className="text-sm font-bold text-white mb-4">Vendas e Receitas por Seleção de Futebol (Copa 2026)</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-xs text-neutral-300 mb-1">
                      <span>Brasil (BRA)</span>
                      <span className="font-bold">R$ 325,00 (65%)</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-yellow-400 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs text-neutral-300 mb-1">
                      <span>Argentina (ARG)</span>
                      <span className="font-bold">R$ 130,00 (26%)</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-sky-400 to-white h-full rounded-full" style={{ width: '26%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs text-neutral-300 mb-1">
                      <span>Alemanha (GER) / Espanha (ESP)</span>
                      <span className="font-bold">R$ 50,00 (9%)</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-500 to-red-600 h-full rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List of completed transactions */}
            <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Dossiê Completo de Transações Financeiras
              </h3>

              {transactions.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4">Nenhuma venda oficial finalizada e liquidada ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-widest text-[9px]">
                        <th className="py-3 px-4">ID Transação</th>
                        <th className="py-3 px-4">Cromo</th>
                        <th className="py-3 px-4">País</th>
                        <th className="py-3 px-4">Aquisitor / Comprador</th>
                        <th className="py-3 px-4 text-right">Montante Pago</th>
                        <th className="py-3 px-4 text-right">Data Liquidação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-all text-neutral-200">
                          <td className="py-3 px-4 text-neutral-500">#{tx.id}</td>
                          <td className="py-3 px-4 font-bold text-white">{tx.stickerNumero}</td>
                          <td className="py-3 px-4">{tx.stickerSelecao}</td>
                          <td className="py-3 px-4 font-semibold">{tx.compradorNome}</td>
                          <td className="py-3 px-4 text-right font-extrabold text-emerald-400">R$ {tx.valor.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-neutral-400">{new Date(tx.data).toLocaleDateString()} {new Date(tx.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'dados' && (
          <motion.div
            key="dados_tab_gestor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <UserProfileForm
              currentUser={currentUser}
              onUpdateUser={onUpdateUser}
              onAddActivityLog={onAddActivityLog}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
