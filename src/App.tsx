/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, LogOut, Heart, Bell, Grid, Settings, 
  Menu, X, Sparkles, Database, Users, HelpCircle 
} from 'lucide-react';

import { 
  User, Sticker, Bid, Swap, Transaction, AppNotification, ActivityLog, UserRole, StickerType, StickerRarity, StickerStatus 
} from './types';

import { 
  initializeDatabase, getStickersFromStorage, saveStickersToStorage,
  getUsersFromStorage, saveUsersToStorage, getBidsFromStorage, saveBidsToStorage,
  getSwapsFromStorage, saveSwapsToStorage, getTransactionsFromStorage, saveTransactionsToStorage,
  getNotificationsFromStorage, saveNotificationsToStorage, getLogsFromStorage, saveLogsToStorage,
  addActivityLog 
} from './data';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import CollectorDashboard from './components/CollectorDashboard';
import GestorDashboard from './components/GestorDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // Database States
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Session States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<'landing' | 'login' | 'dashboard'>('landing');
  
  // Custom inside menu indicator (used when logged in)
  const [internalPanelMode, setInternalPanelMode] = useState<'normal' | 'admin'>('normal');

  // Mobile navigation trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize and load storage
  useEffect(() => {
    initializeDatabase();
    reloadAllFromStorage();
  }, []);

  const reloadAllFromStorage = () => {
    const loadedStickers = getStickersFromStorage();
    const loadedUsers = getUsersFromStorage();
    const loadedBids = getBidsFromStorage();
    const loadedSwaps = getSwapsFromStorage();
    const loadedTransactions = getTransactionsFromStorage();
    const loadedNotifications = getNotificationsFromStorage();
    const loadedLogs = getLogsFromStorage();

    setStickers(loadedStickers);
    setUsers(loadedUsers);
    setBids(loadedBids);
    setSwaps(loadedSwaps);
    setTransactions(loadedTransactions);
    setNotifications(loadedNotifications);
    setLogs(loadedLogs);

    // Sync current logged user in case of properties mutations
    const loggedStr = sessionStorage.getItem('copatrocas_active_user_id');
    if (loggedStr) {
      const match = loadedUsers.find(u => u.id === loggedStr);
      if (match) {
        setCurrentUser(match);
      }
    }
  };

  // State Writers with Syncing
  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsersToStorage(updatedUsers);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
  };

  const handleAddBid = (newBid: Omit<Bid, 'id' | 'data'>) => {
    const completeBid: Bid = {
      ...newBid,
      id: `bid-${Date.now()}`,
      data: new Date().toISOString()
    };
    const updated = [completeBid, ...bids];
    saveBidsToStorage(updated);
    setBids(updated);
  };

  const handleAddSwap = (newSwap: Omit<Swap, 'id' | 'data'>) => {
    const completeSwap: Swap = {
      ...newSwap,
      id: `swap-${Date.now()}`,
      data: new Date().toISOString()
    };
    const updated = [completeSwap, ...swaps];
    saveSwapsToStorage(updated);
    setSwaps(updated);
  };

  const handleAddNotification = (newNotif: Omit<AppNotification, 'id' | 'data' | 'lida'>) => {
    const completeNotif: AppNotification = {
      ...newNotif,
      id: `notif-${Date.now()}`,
      data: new Date().toISOString(),
      lida: false
    };
    const updated = [completeNotif, ...notifications];
    saveNotificationsToStorage(updated);
    setNotifications(updated);
  };

  const handleAddActivityLog = (acao: string, detalhes: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      usuario: currentUser.nome,
      role: currentUser.role,
      acao,
      detalhes,
      data: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    saveLogsToStorage(updated);
    setLogs(updated);
  };

  const handleNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, lida: true } : n);
    saveNotificationsToStorage(updated);
    setNotifications(updated);
  };

  // Gestor sticker handlers
  const handleAddSticker = (newSticker: Omit<Sticker, 'id' | 'criadorId' | 'criadorNome' | 'status'>) => {
    if (!currentUser) return;
    const completeSticker: Sticker = {
      ...newSticker,
      id: `st-${Date.now()}`,
      criadorId: currentUser.id,
      criadorNome: currentUser.nome,
      status: 'disponivel'
    };
    const updated = [completeSticker, ...stickers];
    saveStickersToStorage(updated);
    setStickers(updated);
  };

  const handleEditSticker = (id: string, updatedFields: Partial<Sticker>) => {
    const updated = stickers.map(s => s.id === id ? { ...s, ...updatedFields } : s);
    saveStickersToStorage(updated);
    setStickers(updated);
  };

  const handleDeleteSticker = (id: string) => {
    const updated = stickers.filter(s => s.id !== id);
    saveStickersToStorage(updated);
    setStickers(updated);
  };

  const handleUpdateBidStatus = (id: string, status: 'aceito' | 'recusado') => {
    const updated = bids.map(b => b.id === id ? { ...b, status } : b);
    saveBidsToStorage(updated);
    setBids(updated);
  };

  const handleUpdateSwapStatus = (id: string, status: 'concluida' | 'cancelada') => {
    const updated = swaps.map(s => s.id === id ? { ...s, status } : s);
    saveSwapsToStorage(updated);
    setSwaps(updated);
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'data'>) => {
    const completeTx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      data: new Date().toISOString()
    };
    const updated = [completeTx, ...transactions];
    saveTransactionsToStorage(updated);
    setTransactions(updated);
  };

  // Administrative handlers
  const handleToggleUserStatus = (id: string) => {
    const updated = users.map(user => {
      if (user.id === id) {
        const nextStatus = !user.ativo;
        // add logs
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          usuario: currentUser?.nome || 'Admin',
          role: 'admin',
          acao: nextStatus ? 'Ativação de Conta' : 'Bloqueio de Conta',
          detalhes: `${nextStatus ? 'Ativou' : 'Inativou/Bloqueou'} o acesso do usuário ${user.nome} (${user.email}).`,
          data: new Date().toISOString()
        };
        const updatedLogs = [newLog, ...logs];
        saveLogsToStorage(updatedLogs);
        setLogs(updatedLogs);
        return { ...user, ativo: nextStatus };
      }
      return user;
    });

    saveUsersToStorage(updated);
    setUsers(updated);

    // If we deactivated ourselves by mistake, log-out
    if (currentUser && currentUser.id === id) {
      handleLogout();
    }
  };

  const handleClearLogs = () => {
    saveLogsToStorage([]);
    setLogs([]);
    alert('Logs limpos!');
  };

  // Auth Operations
  const handleLoginSuccess = (email: string, role: UserRole) => {
    const matchedUser = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    
    if (matchedUser) {
      if (!matchedUser.ativo) {
        alert('Esta conta está atualmente BLOQUEADA pelo administrador do sistema.');
        return;
      }

      setCurrentUser(matchedUser);
      sessionStorage.setItem('copatrocas_active_user_id', matchedUser.id);
      setActiveScreen('dashboard');
      setInternalPanelMode('normal');

      // Add simple Activity Log
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        usuario: matchedUser.nome,
        role: matchedUser.role,
        acao: 'Autenticação',
        detalhes: `Usuário efetuou login no painel de controle.`,
        data: new Date().toISOString()
      };
      saveLogsToStorage([newLog, ...logs]);
      setLogs([newLog, ...logs]);
    }
  };

  const handleRegisterUser = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);
    setUsers(updatedUsers);

    // Add simple Activity Log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      usuario: newUser.nome,
      role: newUser.role,
      acao: 'Cadastro de Usuário',
      detalhes: `Novo usuário ${newUser.nome} cadastrado com sucesso como ${newUser.role}.`,
      data: new Date().toISOString()
    };
    saveLogsToStorage([newLog, ...logs]);
    setLogs([newLog, ...logs]);

    // Set active session
    setCurrentUser(newUser);
    sessionStorage.setItem('copatrocas_active_user_id', newUser.id);
    setActiveScreen('dashboard');
    setInternalPanelMode('normal');
  };

  const handleLogout = () => {
    if (currentUser) {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        usuario: currentUser.nome,
        role: currentUser.role,
        acao: 'Logoff',
        detalhes: `Usuário desconectou com segurança do sistema.`,
        data: new Date().toISOString()
      };
      saveLogsToStorage([newLog, ...logs]);
      setLogs([newLog, ...logs]);
    }

    setCurrentUser(null);
    sessionStorage.removeItem('copatrocas_active_user_id');
    setActiveScreen('landing');
    setInternalPanelMode('normal');
    setMobileMenuOpen(false);
  };

  const handleQuickRoleSelect = (role: 'colecionador' | 'gestor' | 'admin') => {
    const defaultEmails = {
      colecionador: 'colecionador@copatrocas.com.br',
      gestor: 'gestor@copatrocas.com.br',
      admin: 'admin@copatrocas.com.br'
    };
    handleLoginSuccess(defaultEmails[role], role);
  };

  // Reset all application data to original initial state
  const handleResetAppDatabase = () => {
    if (confirm('Tem certeza de que deseja redefinir TODAS as figurinhas, usuários e transações do sistema para os valores originais da demonstração?')) {
      initializeDatabase(true);
      reloadAllFromStorage();
      alert('Dados redefinidos com sucesso!');
      handleLogout();
    }
  };

  // Unread general notifications count (for badge in header)
  const unreadCount = notifications.filter(n => {
    if (!currentUser) return false;
    if (currentUser.role === 'gestor') {
      return n.destinatarioRole === 'gestor' && !n.lida;
    }
    return (n.destinatarioRole === currentUser.id || n.destinatarioRole === 'usr-colecionador') && !n.lida;
  }).length;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-yellow-400 selection:text-neutral-900 relative overflow-x-hidden">
      {/* Immersive Atmospheric Ambient Background Decor */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-green-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-yellow-400 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

      {/* 1. Header Fixo */}
      <header className="sticky top-0 z-40 bg-white/5 border-b border-white/10 backdrop-blur-xl h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          
          {/* Logo brand */}
          <button 
            id="logo-home"
            onClick={() => {
              if (activeScreen === 'dashboard') {
                setInternalPanelMode('normal');
              } else {
                setActiveScreen('landing');
              }
            }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-400 via-emerald-400 to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 via-white to-emerald-400 text-sm">
                ⚽
              </div>
            </div>
            <div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-emerald-400 tracking-wider uppercase text-sm block">
                Copa Trocas
              </span>
              <span className="text-[9px] text-neutral-400 font-semibold tracking-widest block -mt-1">ED. LIMITADA 2026</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {activeScreen === 'landing' ? (
              <>
                <a href="#como-funciona" className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors">Como Funciona</a>
                <button 
                  id="nav-entrar"
                  onClick={() => setActiveScreen('login')}
                  className="px-4.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all"
                >
                  Entrar na Plataforma
                </button>
              </>
            ) : activeScreen === 'login' ? (
              <button 
                id="nav-back-landing"
                onClick={() => setActiveScreen('landing')}
                className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
              >
                Voltar ao Início
              </button>
            ) : (
              // Inside Dashboard general links
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-400">
                  Loggado como: <strong className="text-white">{currentUser?.nome}</strong>
                </span>

                {/* Show Admin Button on the upper right side as requested */}
                {(currentUser?.role === 'admin' || currentUser?.role === 'gestor' || currentUser?.role === 'colecionador') && (
                  <button
                    id="btn-admin-gate"
                    onClick={() => {
                      if (internalPanelMode === 'admin') {
                        setInternalPanelMode('normal');
                      } else {
                        setInternalPanelMode('admin');
                      }
                    }}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                      internalPanelMode === 'admin'
                        ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                        : 'bg-white/5 text-yellow-300 hover:bg-yellow-400/10 border-white/12'
                    }`}
                    title="Acesso ao Painel Administrativo"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Painel Admin</span>
                  </button>
                )}

                {/* Database Reset shortcut inside header */}
                <button
                  id="btn-nav-reset"
                  onClick={handleResetAppDatabase}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-neutral-800 text-neutral-300 text-xs flex items-center gap-1"
                  title="Redefinir Banco de Dados da Simulação"
                >
                  <Database className="w-3.5 h-3.5" />
                  Reset
                </button>

                <button 
                  id="btn-logout"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-600/15 border border-red-500/20 text-red-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-red-600/25 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center gap-3">
            {currentUser && (
              <button
                onClick={() => setInternalPanelMode(prev => prev === 'admin' ? 'normal' : 'admin')}
                className={`p-2 rounded-lg border text-xs font-bold ${
                  internalPanelMode === 'admin' ? 'bg-yellow-400 text-neutral-950 border-yellow-400' : 'bg-white/5 text-yellow-300 border-white/10'
                }`}
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile nav menu modal dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-neutral-950/95 border-b border-white/10 backdrop-blur-2xl px-4 py-6 z-30 absolute top-16 left-0 right-0 space-y-4 shadow-2xl flex flex-col"
          >
            {activeScreen === 'landing' ? (
              <>
                <a 
                  href="#como-funciona" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-neutral-300 hover:text-white"
                >
                  Como Funciona
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveScreen('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-yellow-400 text-neutral-950 font-bold text-center text-sm"
                >
                  Entrar na Plataforma
                </button>
              </>
            ) : activeScreen === 'login' ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveScreen('landing');
                }}
                className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl font-bold text-white text-center text-sm"
              >
                Voltar ao Início
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-white/2 rounded-xl border border-white/5">
                  <p className="text-xs text-neutral-400">Usuário:</p>
                  <p className="font-bold text-sm text-yellow-300">{currentUser?.nome}</p>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleResetAppDatabase();
                  }}
                  className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-neutral-300 text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <Database className="w-4 h-4" /> Redefinir Dados
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-600/20 border border-red-500/20 text-red-300 rounded-xl font-semibold text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Sair da Conta
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content screen switcher */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: LANDING */}
          {activeScreen === 'landing' && (
            <motion.div key="landing" className="w-full">
              <LandingPage
                stats={{
                  stickersCount: stickers.length,
                  swapsCount: swaps.filter(s => s.status === 'concluida').length + 5, // added mock base offset
                  bidsCount: bids.length + 3,
                  usersCount: users.length,
                }}
                onStartLogin={() => setActiveScreen('login')}
                onQuickRole={handleQuickRoleSelect}
              />
            </motion.div>
          )}

          {/* SCREEN: LOGIN */}
          {activeScreen === 'login' && (
            <motion.div key="login" className="w-full">
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onBack={() => setActiveScreen('landing')}
                existingUsers={users}
                onRegisterUser={handleRegisterUser}
              />
            </motion.div>
          )}

          {/* SCREEN: INSIDE ACTIVE PANEL */}
          {activeScreen === 'dashboard' && currentUser && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* If user clicked and enabled Administrative Control Overlay */}
              {internalPanelMode === 'admin' ? (
                <AdminDashboard
                  users={users}
                  stickers={stickers}
                  transactions={transactions}
                  logs={logs}
                  onToggleUserStatus={handleToggleUserStatus}
                  onDeleteStickerGlobal={handleDeleteSticker}
                  onClearLogs={handleClearLogs}
                />
              ) : (
                // Display the primary view corresponding to the actor role
                <>
                  {currentUser.role === 'colecionador' && (
                    <CollectorDashboard
                      currentUser={currentUser}
                      onUpdateUser={handleUpdateUser}
                      stickers={stickers}
                      bids={bids}
                      swaps={swaps}
                      notifications={notifications}
                      onAddBid={handleAddBid}
                      onAddSwap={handleAddSwap}
                      onAddNotification={handleAddNotification}
                      onAddActivityLog={handleAddActivityLog}
                      onNotificationRead={handleNotificationRead}
                    />
                  )}

                  {currentUser.role === 'gestor' && (
                    <GestorDashboard
                      currentUser={currentUser}
                      onUpdateUser={handleUpdateUser}
                      stickers={stickers}
                      bids={bids}
                      swaps={swaps}
                      transactions={transactions}
                      onAddSticker={handleAddSticker}
                      onEditSticker={handleEditSticker}
                      onDeleteSticker={handleDeleteSticker}
                      onUpdateBidStatus={handleUpdateBidStatus}
                      onUpdateSwapStatus={handleUpdateSwapStatus}
                      onAddTransaction={handleAddTransaction}
                      onAddNotification={handleAddNotification}
                      onAddActivityLog={handleAddActivityLog}
                    />
                  )}

                  {currentUser.role === 'admin' && (
                    // When the main account logged in is Admin, show the complete panel.
                    <AdminDashboard
                      users={users}
                      stickers={stickers}
                      transactions={transactions}
                      logs={logs}
                      onToggleUserStatus={handleToggleUserStatus}
                      onDeleteStickerGlobal={handleDeleteSticker}
                      onClearLogs={handleClearLogs}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
