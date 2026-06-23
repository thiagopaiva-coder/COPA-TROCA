/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Bell, Filter, Grid, RefreshCw, Send, CheckCircle, 
  MessageSquare, CircleDollarSign, Trophy, Sparkles, Hash, Plus, Trash, UserCheck
} from 'lucide-react';
import { Sticker, Bid, Swap, AppNotification, User, StickerType, StickerRarity } from '../types';
import { SELECOES_MUNDIAL } from '../data';
import UserProfileForm from './UserProfileForm';

interface CollectorDashboardProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
  stickers: Sticker[];
  bids: Bid[];
  swaps: Swap[];
  notifications: AppNotification[];
  onAddBid: (bid: Omit<Bid, 'id' | 'data'>) => void;
  onAddSwap: (swap: Omit<Swap, 'id' | 'data'>) => void;
  onAddNotification: (notif: Omit<AppNotification, 'id' | 'data' | 'lida'>) => void;
  onAddActivityLog: (acao: string, detalhes: string) => void;
  onNotificationRead: (id: string) => void;
}

export default function CollectorDashboard({
  currentUser,
  onUpdateUser,
  stickers,
  bids,
  swaps,
  notifications,
  onAddBid,
  onAddSwap,
  onAddNotification,
  onAddActivityLog,
  onNotificationRead
}: CollectorDashboardProps) {
  // Tabs: 'catalogo' | 'desejos' | 'negociacoes' | 'notificacoes' | 'dados'
  const [activeTab, setActiveTab] = useState<'catalogo' | 'desejos' | 'negociacoes' | 'notificacoes' | 'dados'>('catalogo');

  // Filters state
  const [filterPais, setFilterPais] = useState('');
  const [filterNumero, setFilterNumero] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'venda' | 'troca'>('todos');
  const [filterRaridade, setFilterRaridade] = useState<'todos' | StickerRarity>('todos');
  const [filterStatusEspecial, setFilterStatusEspecial] = useState<'todos' | 'repetidas' | 'faltantes'>('todos');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Selected sticker for Detail Modal
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  // Bidding & Swapping Modal form states
  const [bidValue, setBidValue] = useState<number>(0);
  const [offerStickerNum, setOfferStickerNum] = useState('');
  const [bidMsg, setBidMsg] = useState('');
  const [modalMode, setModalMode] = useState<'detalhe' | 'lance' | 'troca'>('detalhe');
  const [tempSuccessMsg, setTempSuccessMsg] = useState('');

  // Editing Colecao / Wishlist inputs
  const [newStickerCode, setNewStickerCode] = useState('');
  const [isAddingToHave, setIsAddingToHave] = useState(true); // true = owns, false = wants

  // Helper arrays
  const uniqueCountries = Array.from(new Set(stickers.map(s => s.selecao)));

  // Filter logic
  const filteredStickers = stickers.filter(sticker => {
    // text query matches country name or sticker number
    const matchesSearch = 
      sticker.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sticker.selecao.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPais = filterPais ? sticker.selecao === filterPais : true;
    const matchesNumero = filterNumero ? sticker.numero.toLowerCase().includes(filterNumero.toLowerCase()) : true;
    
    const matchesTipo = 
      filterTipo === 'todos' ? true : 
      filterTipo === 'venda' ? (sticker.tipo === 'venda' || sticker.tipo === 'ambos') : 
      (sticker.tipo === 'troca' || sticker.tipo === 'ambos');

    const matchesRaridade = filterRaridade === 'todos' ? true : sticker.raridade === filterRaridade;

    // special filters based on currentUser inventory
    if (filterStatusEspecial === 'repetidas') {
      return matchesSearch && matchesPais && matchesNumero && matchesTipo && matchesRaridade && currentUser.repetidas.includes(sticker.numero);
    }
    if (filterStatusEspecial === 'faltantes') {
      return matchesSearch && matchesPais && matchesNumero && matchesTipo && matchesRaridade && !currentUser.colecao.includes(sticker.numero);
    }

    return matchesSearch && matchesPais && matchesNumero && matchesTipo && matchesRaridade;
  });

  // Actions
  const notifyInterest = (sticker: Sticker) => {
    onAddNotification({
      destinatarioRole: 'gestor',
      remetenteNome: currentUser.nome,
      tipo: 'interesse',
      mensagem: `${currentUser.nome} demonstrou interesse formal na figurinha ${sticker.numero} (${sticker.selecao}).`,
      stickerId: sticker.id,
      stickerNumero: sticker.numero,
    });

    onAddActivityLog(
      'Interesse demonstrado',
      `Ficou interessado na figurinha ${sticker.numero} (${sticker.selecao}) postada pelo Gestor.`
    );

    alert(`Sucesso! Um alerta de interesse na figurinha ${sticker.numero} foi encaminhado para os gestores.`);
  };

  const handleOpenLance = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    setBidValue(sticker.preco || 10);
    setBidMsg('');
    setModalMode('lance');
    setTempSuccessMsg('');
  };

  const handleOpenTroca = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    setOfferStickerNum(currentUser.repetidas[0] || 'BRA 10');
    setBidMsg('');
    setModalMode('troca');
    setTempSuccessMsg('');
  };

  const handleOpenDetails = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    setModalMode('detalhe');
    setTempSuccessMsg('');
  };

  const submitBid = () => {
    if (!selectedSticker) return;

    if (modalMode === 'lance') {
      if (bidValue <= 0) {
        alert('O lance precisa ser maior que R$ 0,00');
        return;
      }

      onAddBid({
        stickerId: selectedSticker.id,
        stickerNumero: selectedSticker.numero,
        stickerSelecao: selectedSticker.selecao,
        colecionadorId: currentUser.id,
        colecionadorNome: currentUser.nome,
        valor: bidValue,
        tipo: 'venda',
        status: 'pendente',
        mensagem: bidMsg
      });

      onAddNotification({
        destinatarioRole: 'gestor',
        remetenteNome: currentUser.nome,
        tipo: 'lance_recebido',
        mensagem: `${currentUser.nome} enviou uma oferta de R$ ${bidValue.toFixed(2)} por ${selectedSticker.numero}. Msg: "${bidMsg || 'Sem observações'}"`,
        stickerId: selectedSticker.id,
        stickerNumero: selectedSticker.numero
      });

      onAddActivityLog(
        'Venda: Lance Enviado',
        `Enviou oferta de R$ ${bidValue.toFixed(2)} para adquirir a figurinha ${selectedSticker.numero}.`
      );

      setTempSuccessMsg(`Lance de R$ ${bidValue.toFixed(2)} enviado aos gestores com sucesso!`);
    } else {
      // Troca proposal
      if (!offerStickerNum) {
        alert('Por favor informe a sua figurinha a ser ofertada na troca.');
        return;
      }

      onAddSwap({
        colecionadorId: currentUser.id,
        colecionadorNome: currentUser.nome,
        stickerId: selectedSticker.id,
        stickerNumero: selectedSticker.numero,
        stickerSelecao: selectedSticker.selecao,
        propostaStickerNumero: offerStickerNum,
        status: 'pendente'
      });

      onAddNotification({
        destinatarioRole: 'gestor',
        remetenteNome: currentUser.nome,
        tipo: 'troca_proposta',
        mensagem: `${currentUser.nome} propôs trocar a figurinha ${selectedSticker.numero} pela sua repetida ${offerStickerNum}.`,
        stickerId: selectedSticker.id,
        stickerNumero: selectedSticker.numero
      });

      onAddActivityLog(
        'Troca: Proposta Enviada',
        `Ofereceu a figurinha ${offerStickerNum} em troca de ${selectedSticker.numero}.`
      );

      setTempSuccessMsg(`Proposta de troca e envio da figurinha ${offerStickerNum} enviado com sucesso!`);
    }

    setTimeout(() => {
      setSelectedSticker(null);
    }, 1500);
  };

  // Add customized item to user colecao/wishlist
  const handleAddInventario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickerCode.trim()) return;

    const formattedCode = newStickerCode.trim().toUpperCase();
    const updated = { ...currentUser };

    if (isAddingToHave) {
      if (!updated.colecao.includes(formattedCode)) {
        updated.colecao.push(formattedCode);
      }
      // optionally add duplication to repeated list
      const hasCount = updated.colecao.filter(c => c === formattedCode).length;
      if (hasCount > 0 && !updated.repetidas.includes(formattedCode)) {
        updated.repetidas.push(formattedCode);
      }
      onAddActivityLog('Atualizou Coleção', `Adicionou a figurinha ${formattedCode} ao seu inventário pessoal.`);
    } else {
      if (!updated.wishlist.includes(formattedCode)) {
        updated.wishlist.push(formattedCode);
      }
      onAddActivityLog('Atualizou Wishlist', `Adicionou ${formattedCode} à sua Lista de Desejos.`);
    }

    onUpdateUser(updated);
    setNewStickerCode('');
    alert(`Figurinha ${formattedCode} cadastrada no seu perfil!`);
  };

  const handleRemoveInventario = (code: string, isHave: boolean) => {
    const updated = { ...currentUser };
    if (isHave) {
      updated.colecao = updated.colecao.filter(c => c !== code);
      updated.repetidas = updated.repetidas.filter(c => c !== code);
      onAddActivityLog('Atualizou Coleção', `Removeu a figurinha ${code} do inventário.`);
    } else {
      updated.wishlist = updated.wishlist.filter(w => w !== code);
      onAddActivityLog('Atualizou Wishlist', `Removeu ${code} da Lista de Desejos.`);
    }
    onUpdateUser(updated);
  };

  // Filtered notifications
  const userNotifications = notifications.filter(
    n => n.destinatarioRole === currentUser.id || n.destinatarioRole === 'usr-colecionador'
  );

  // Filtered Bids (user history)
  const userBids = bids.filter(b => b.colecionadorId === currentUser.id);
  const userSwaps = swaps.filter(s => s.colecionadorId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Info Banner */}
      <div className="mb-8 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.nome} 
            className="w-14 h-14 rounded-full border-2 border-yellow-400 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser.nome}</h2>
              <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-semibold">COLECIONADOR</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">E-mail: {currentUser.email} • Tel: {currentUser.telefone}</p>
          </div>
        </div>

        {/* Quick totals */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Minha Coleção</span>
            <span className="text-sm font-bold text-yellow-400">{currentUser.colecao.length} colados</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Repetidas (Troca)</span>
            <span className="text-sm font-bold text-emerald-400">{currentUser.repetidas.length} itens</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Lista de Desejos</span>
            <span className="text-sm font-bold text-indigo-400">{currentUser.wishlist.length} restam</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'catalogo' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Grid className="w-4.5 h-4.5" />
          Mercado de Figurinhas
        </button>
        <button
          onClick={() => setActiveTab('desejos')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'desejos' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-4.5 h-4.5" />
          Meu Inventário & Desejos
        </button>
        <button
          onClick={() => setActiveTab('negociacoes')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'negociacoes' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <CircleDollarSign className="w-4.5 h-4.5" />
          Histórico de Propostas ({userBids.length + userSwaps.length})
        </button>
        <button
          onClick={() => setActiveTab('notificacoes')}
          className={`px-5 py-3.5 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'notificacoes' 
              ? 'border-yellow-400 text-yellow-300 bg-white/5' 
              : 'border-transparent text-neutral-400 hover:text-white-relative relative'
          }`}
        >
          <Bell className="w-4.5 h-4.5" />
          Alertas & Notificações
          {userNotifications.some(n => !n.lida) && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          )}
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

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {/* TALA 1: CATÁLOGO GERAL */}
        {activeTab === 'catalogo' && (
          <motion.div
            key="catalogo"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Filter grid */}
            <div className="p-5 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-yellow-400 font-bold text-sm">
                <Filter className="w-4.5 h-4.5" />
                <span>FILTROS DO CATÁLOGO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Buscar termo</label>
                  <input
                    type="text"
                    placeholder="Ex: BRA 10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 transition-all text-white focus:outline-none"
                  />
                </div>

                {/* Country filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Filtrar por Seleção</label>
                  <select
                    value={filterPais}
                    onChange={(e) => setFilterPais(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="">Todas</option>
                    {uniqueCountries.map(pais => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                </div>

                {/* Sticker Type filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Disponibilidade</label>
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="todos">Todos (Venda & Troca)</option>
                    <option value="venda">Apenas Venda</option>
                    <option value="troca">Apenas Troca</option>
                  </select>
                </div>

                {/* Rarity filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Raridade</label>
                  <select
                    value={filterRaridade}
                    onChange={(e) => setFilterRaridade(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="todos">Todas</option>
                    <option value="comum">Comum</option>
                    <option value="raro">Raridade Rara</option>
                    <option value="lendario">Lendária 👑</option>
                  </select>
                </div>

                {/* Duplicates / Missing filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Minha Coleção (Status)</label>
                  <select
                    value={filterStatusEspecial}
                    onChange={(e) => setFilterStatusEspecial(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="todos">Mostrar tudo</option>
                    <option value="repetidas">Minhas Repetidas somente</option>
                    <option value="faltantes">Faltantes no meu álbum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticker grid */}
            {filteredStickers.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-neutral-400 mb-2">Nenhuma figurinha anunciada com os filtros atuais.</p>
                <button 
                  onClick={() => {
                    setFilterPais('');
                    setFilterNumero('');
                    setFilterTipo('todos');
                    setFilterRaridade('todos');
                    setFilterStatusEspecial('todos');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all text-xs"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStickers.map(sticker => {
                  const alreadyHave = currentUser.colecao.includes(sticker.numero);
                  const inWishlist = currentUser.wishlist.includes(sticker.numero);
                  const isRepeated = currentUser.repetidas.includes(sticker.numero);

                  return (
                    <motion.div
                      key={sticker.id}
                      layoutId={`sticker-card-${sticker.id}`}
                      className="p-5 rounded-[32px] border bg-white/5 border-white/10 backdrop-blur-lg flex flex-col justify-between hover:border-yellow-400/30 transition-all relative overflow-hidden group shadow-2xl"
                    >
                      {/* Sticker Physical Card Body */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gradient-to-tr flex flex-col justify-between p-4 group-hover:scale-[1.01] transition-transform">
                        {/* Beautiful country-themed backdrop gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${sticker.imagem} opacity-90 mix-blend-overlay z-0`}></div>
                        
                        {/* Grid matrix overlay for holographic sports feel */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-black/40 to-black/80 z-0"></div>

                        {/* Card metadata row */}
                        <div className="flex justify-between items-center z-10 relative">
                          <span className="text-[10px] font-bold py-1 px-2.5 rounded-full bg-black/60 text-white flex items-center gap-1 uppercase tracking-wider backdrop-blur-sm">
                            <Trophy className="w-3 h-3 text-yellow-400" />
                            {sticker.selecao}
                          </span>

                          <span className={`text-[10px] font-bold py-1 px-2 rounded-full uppercase ${
                            sticker.raridade === 'lendario' ? 'bg-yellow-400 text-neutral-950 shadow-lg shadow-yellow-500/20' :
                            sticker.raridade === 'raro' ? 'bg-indigo-500/80 text-white' : 'bg-white/10 text-neutral-200'
                          }`}>
                            {sticker.raridade}
                          </span>
                        </div>

                        {/* Large graphic number & icon */}
                        <div className="text-center py-4 flex flex-col items-center justify-center z-10 relative">
                          <span className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white drop-shadow-md">
                            {sticker.numero}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFF]/60 mt-1">CROMO OFICIAL</span>
                        </div>

                        {/* Duplicate/Possessed status badges */}
                        <div className="flex gap-1.5 z-10 relative">
                          {alreadyHave ? (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Já possuo</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-red-500/10 text-red-300 border border-red-500/20">Falta</span>
                          )}

                          {isRepeated && (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">Repetida</span>
                          )}

                          {inWishlist && (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Na Lista</span>
                          )}
                        </div>
                      </div>

                      {/* Info & Price */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-neutral-400">Anunciado por</p>
                            <p className="text-xs font-semibold text-white">{sticker.criadorNome}</p>
                          </div>
                          
                          <div className="text-right">
                            {sticker.tipo === 'venda' || sticker.tipo === 'ambos' ? (
                              <p className="text-base font-extrabold text-[#FFF]">
                                R$ {sticker.preco?.toFixed(2)}
                              </p>
                            ) : (
                              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Apenas Troca</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                          <button
                            id={`btn-detail-${sticker.id}`}
                            onClick={() => handleOpenDetails(sticker)}
                            className="py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 text-xs text-center transition-all flex items-center justify-center gap-1 border border-white/5"
                          >
                            Detalhes
                          </button>

                          {(sticker.tipo === 'venda' || sticker.tipo === 'ambos') ? (
                            <button
                              id={`btn-lance-${sticker.id}`}
                              disabled={sticker.status === 'negociado'}
                              onClick={() => handleOpenLance(sticker)}
                              className="py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-neutral-950 font-bold text-xs text-center transition-all flex items-center justify-center gap-1 shadow"
                            >
                              {sticker.status === 'negociado' ? 'Esgotado' : 'Dar Lance'}
                            </button>
                          ) : (
                            <button
                              id={`btn-troca-${sticker.id}`}
                              disabled={sticker.status === 'negociado'}
                              onClick={() => handleOpenTroca(sticker)}
                              className="py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold text-xs text-center transition-all flex items-center justify-center gap-1 shadow"
                            >
                              {sticker.status === 'negociado' ? 'Esgotado' : 'Propor Troca'}
                            </button>
                          )}
                        </div>

                        {/* Notify interest shortcut */}
                        <button
                          id={`btn-notify-${sticker.id}`}
                          onClick={() => notifyInterest(sticker)}
                          className="w-full text-center text-[10px] text-neutral-400 hover:text-neutral-200 py-1 flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 text-neutral-500" />
                          Demonstrar Interesse Automático (Notificar Dono)
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TELA 2: MEU INVENTÁRIO & WISHLIST */}
        {activeTab === 'desejos' && (
          <motion.div
            key="inventario"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left: Adder Column */}
            <div className="md:col-span-1 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl h-fit">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Gerenciar Meu Inventário
              </h3>
              <p className="text-xs text-neutral-400 mb-6">Cadastre figurinhas que você já possui ou está ansioso para obter de outros colecionadores.</p>

              <form onSubmit={handleAddInventario} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-1">Cromo/Número da Figurinha</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BRA 10, ARG 1"
                    value={newStickerCode}
                    onChange={(e) => setNewStickerCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-2">Destino / Finalidade</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingToHave(true)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        isAddingToHave 
                          ? 'bg-yellow-400 text-neutral-950 border-yellow-400' 
                          : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Já Possuo cromo
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingToHave(false)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        !isAddingToHave 
                          ? 'bg-indigo-600 text-white border-indigo-500' 
                          : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Lista de Desejos
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-white/15 hover:bg-white/20 border border-white/10 rounded-xl font-bold text-white text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Salvar no Meu Perfil
                </button>
              </form>
            </div>

            {/* Right: Lists Display Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Possessed stickers */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Minha Coleção ({currentUser.colecao.length} cromos possuídos)
                </h4>

                {currentUser.colecao.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4">Sua coleção está vazia. Adicione figurinhas ao painel para iniciar.</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {currentUser.colecao.map(code => (
                      <span 
                        key={code} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-neutral-200 group hover:border-red-500/30 transition-all font-semibold"
                      >
                        {code}
                        <button 
                          onClick={() => handleRemoveInventario(code, true)}
                          className="w-4 h-4 rounded-full bg-black/30 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer text-[10px]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                  Lista de Desejos ({currentUser.wishlist.length} cromos procurados)
                </h4>

                {currentUser.wishlist.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4">Sua lista de desejos está vazia. Cadastre o que você quer!</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {currentUser.wishlist.map(code => (
                      <span 
                        key={code} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-all font-semibold"
                      >
                        {code}
                        <button 
                          onClick={() => handleRemoveInventario(code, false)}
                          className="w-4 h-4 rounded-full bg-black/30 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer text-[10px]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TELA 3: HISTÓRICO DE NEGOCIAÇÕES */}
        {activeTab === 'negociacoes' && (
          <motion.div
            key="negociacoes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Purchases / Bids Section */}
            <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-yellow-400" />
                Histórico de Lances de Compra
              </h3>

              {userBids.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4">Você ainda não realizou nenhum lance financeiro.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Figurinha</th>
                        <th className="py-3 px-4">Seleção</th>
                        <th className="py-3 px-4">Valor Ofertado</th>
                        <th className="py-3 px-4">Data do Lance</th>
                        <th className="py-3 px-4">Status da Proposta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {userBids.map(bid => (
                        <tr key={bid.id} className="hover:bg-white/5 transition-all">
                          <td className="py-3 px-4 font-bold text-white">{bid.stickerNumero}</td>
                          <td className="py-3 px-4 text-neutral-300">{bid.stickerSelecao}</td>
                          <td className="py-3 px-4 font-extrabold text-white">R$ {bid.valor.toFixed(2)}</td>
                          <td className="py-3 px-4 text-neutral-400">{new Date(bid.data).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              bid.status === 'pendente' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                              bid.status === 'aceito' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {bid.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Swaps History */}
            <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin duration-5000" />
                Histórico de Propostas de Troca
              </h3>

              {userSwaps.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4">Você ainda não propôs nenhuma troca de figurinhas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Figurinha Desejada</th>
                        <th className="py-3 px-4">Seleção</th>
                        <th className="py-3 px-4">Ofereci em Troca</th>
                        <th className="py-3 px-4">Proposta em</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {userSwaps.map(swap => (
                        <tr key={swap.id} className="hover:bg-white/5 transition-all">
                          <td className="py-3 px-4 font-bold text-white">{swap.stickerNumero}</td>
                          <td className="py-3 px-4 text-neutral-300">{swap.stickerSelecao}</td>
                          <td className="py-3 px-4 font-bold text-yellow-400">{swap.propostaStickerNumero}</td>
                          <td className="py-3 px-4 text-neutral-400">{new Date(swap.data).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              swap.status === 'pendente' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                              swap.status === 'concluida' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                              {swap.status === 'concluida' ? 'Concluída' : swap.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TELA 4: ALERTAS & NOTIFICAÇÕES */}
        {activeTab === 'notificacoes' && (
          <motion.div
            key="notificacoes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Minhas Notificações Recentes
              </h3>
            </div>

            {userNotifications.length === 0 ? (
              <div className="py-12 text-center text-neutral-400">
                Não há notificações para você até o momento.
              </div>
            ) : (
              <div className="space-y-3">
                {userNotifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-all flex justify-between items-start gap-4 ${
                      notif.lida 
                        ? 'bg-white/2 border-white/5' 
                        : 'bg-yellow-400/5 border-yellow-400/20 shadow-lg shadow-yellow-400/2'
                    }`}
                  >
                    <div>
                      <p className="text-xs text-neutral-400 mb-1 flex items-center gap-1.5">
                        <span className="font-bold text-yellow-400">{notif.remetenteNome}</span>
                        <span>•</span>
                        <span>{new Date(notif.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </p>
                      <p className="text-sm text-neutral-200 font-medium">{notif.mensagem}</p>
                    </div>

                    {!notif.lida && (
                      <button
                        onClick={() => onNotificationRead(notif.id)}
                        className="text-[10px] bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-semibold px-2 py-1 rounded"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'dados' && (
          <motion.div
            key="dados"
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

      {/* DETAIL MODAL (MODAL DE DETALHE E FORMULARIOS) */}
      <AnimatePresence>
        {selectedSticker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-neutral-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 relative overflow-hidden"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-400 to-indigo-500"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedSticker(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg"
              >
                &times;
              </button>

              {tempSuccessMsg ? (
                <div className="p-8 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Transação Iniciada!</h3>
                  <p className="text-sm text-neutral-300">{tempSuccessMsg}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <span className="text-[10px] bg-yellow-400/10 text-yellow-300 px-2 py-0.5 rounded border border-yellow-400/20 uppercase tracking-widest font-semibold">
                      Detalhes da Figurinha
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
                       {selectedSticker.numero}
                       <span className="text-sm font-normal text-neutral-400">({selectedSticker.selecao})</span>
                    </h3>
                  </div>

                  {/* Body details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`aspect-[4/3] rounded-xl bg-gradient-to-tr ${selectedSticker.imagem} relative p-4 flex flex-col justify-between overflow-hidden shadow-inner`}>
                      <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded self-start">
                        {selectedSticker.raridade.toUpperCase()}
                      </span>
                      <div className="text-center font-bold text-2xl text-white">
                        {selectedSticker.numero}
                      </div>
                      <span className="text-[8px] text-white/50 text-center font-bold uppercase tracking-wider block">ÁLBUM FIFA 2026</span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <p className="text-[10px] text-neutral-400 uppercase">Donatário / Criador</p>
                        <p className="font-semibold text-white">{selectedSticker.criadorNome}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 uppercase">Método Preferido</p>
                        <p className="font-semibold text-yellow-400 capitalize">{selectedSticker.tipo}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 uppercase">Preço Estimado</p>
                        <p className="font-semibold text-white text-base">
                          {selectedSticker.preco ? `R$ ${selectedSticker.preco.toFixed(2)}` : 'Somente Troca'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form fields depending on modality */}
                  {modalMode === 'detalhe' ? (
                    <div className="space-y-4 pt-4 border-t border-white/5 text-xs text-neutral-300">
                      <p>Análise de Mercado: Este cromo apresenta alta demanda entre colecionadores de futebol da edição de 2026.</p>
                      <div className="flex gap-2">
                        {selectedSticker.tipo !== 'troca' && (
                          <button
                            onClick={() => setModalMode('lance')}
                            className="flex-1 py-2.5 bg-yellow-400 text-neutral-950 font-bold rounded-xl text-center"
                          >
                            Dar Lance Financeiro
                          </button>
                        )}
                        {selectedSticker.tipo !== 'venda' && (
                          <button
                            onClick={() => setModalMode('troca')}
                            className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-center"
                          >
                            Oferecer Troca
                          </button>
                        )}
                      </div>
                    </div>
                  ) : modalMode === 'lance' ? (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <CircleDollarSign className="w-4.5 h-4.5 text-yellow-400" />
                        Formular Proposta Financeira (R$)
                      </h4>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Qual o seu Lance Máximo?</label>
                        <input
                          type="number"
                          value={bidValue}
                          onChange={(e) => setBidValue(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Mensagem ou Proposta (Opcional)</label>
                        <textarea
                          rows={2}
                          value={bidMsg}
                          onChange={(e) => setBidMsg(e.target.value)}
                          placeholder="Ex: Aceita 200 reais à vista por pix?"
                          className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400 resize-none"
                        ></textarea>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setModalMode('detalhe')}
                          className="flex-1 py-2.5 bg-white/10 text-white font-bold rounded-xl text-xs"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={submitBid}
                          className="flex-1 py-2.5 bg-yellow-400 text-neutral-950 font-bold rounded-xl text-xs"
                        >
                          Confirmar Lance
                        </button>
                      </div>
                    </div>
                  ) : (
                    // SWAP TROCA FORM
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <RefreshCw className="w-4.5 h-4.5 text-emerald-400" />
                        Oferecer Cromo em Troca
                      </h4>

                      {currentUser.repetidas.length === 0 ? (
                        <div className="p-3.5 bg-yellow-400/10 border border-yellow-400/25 rounded-xl text-xs text-yellow-300">
                          Atenção: Você não possui figurinhas repetidas no seu inventário cadastrado para poder trocar. Por favor adicione na aba "Meu Inventário".
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] text-neutral-400 uppercase mb-1">Escolha uma das suas repetidas para dar de volta</label>
                          <select
                            value={offerStickerNum}
                            onChange={(e) => setOfferStickerNum(e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                          >
                            {currentUser.repetidas.map(code => (
                              <option key={code} value={code}>{code}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase mb-1">Mensagem ao Gestor</label>
                        <textarea
                          rows={2}
                          value={bidMsg}
                          onChange={(e) => setBidMsg(e.target.value)}
                          placeholder="Gostaria muito de trocar esse cromo..."
                          className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-400 resize-none"
                        ></textarea>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setModalMode('detalhe')}
                          className="flex-1 py-1 px-3 bg-white/10 text-white font-bold rounded-xl text-xs height-[40px]"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={submitBid}
                          disabled={currentUser.repetidas.length === 0}
                          className="flex-1 py-2.5 bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs"
                        >
                          Enviar Proposta de Troca
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
