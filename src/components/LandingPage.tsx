/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shuffle, Coins, Shield, Users, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface LandingPageProps {
  onStartLogin: () => void;
  onQuickRole: (role: 'colecionador' | 'gestor' | 'admin') => void;
  stats: {
    stickersCount: number;
    swapsCount: number;
    bidsCount: number;
    usersCount: number;
  };
}

export default function LandingPage({ onStartLogin, onQuickRole, stats }: LandingPageProps) {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen text-white select-none">
      {/* Background ambient circular highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse duration-4000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-35 animate-pulse duration-3000"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-25 animate-pulse duration-5000"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hover:bg-white/10 transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-300">Copa do Mundo 2026 - Edição Exclusiva</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-emerald-400">
            Colecione, Troque e Venda <br/>
            <span className="text-yellow-400">Sem Complicação</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed font-sans font-normal">
            A forma mais moderna e segura de preencher seu álbum da Copa 2026! 
            Conecte-se com outros colecionadores, dê lances em figurinhas e gerencie suas trocas com facilidade.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="btn-hero-login"
              onClick={onStartLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all text-base"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 text-neutral-950" />
            </button>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md text-white font-semibold flex items-center justify-center gap-2 transition-all hover:border-white/20"
            >
              Como Funciona
            </a>
          </div>
        </motion.div>

        {/* Counter Stats Bento-style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-24"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all hover:scale-[1.02]"
          >
            <div>
              <span className="text-xs font-semibold uppercase text-neutral-400 tracking-widest block mb-1">Figurinhas Ativas</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-400">{stats.stickersCount}</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-4 leading-tight">Disponíveis de imediato no catálogo brasileiro e internacional</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all hover:scale-[1.02]"
          >
            <div>
              <span className="text-xs font-semibold uppercase text-neutral-400 tracking-widest block mb-1">Trocas Realizadas</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-emerald-400">{stats.swapsCount}</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-4 leading-tight">Trocas de figurinhas repetidas entre colecionadores aprovadas</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all hover:scale-[1.02]"
          >
            <div>
              <span className="text-xs font-semibold uppercase text-neutral-400 tracking-widest block mb-1">Propostas & Lances</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-400">{stats.bidsCount}</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-4 leading-tight">Propostas de compra negociadas com intermediação do gestor</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all hover:scale-[1.02]"
          >
            <div>
              <span className="text-xs font-semibold uppercase text-neutral-400 tracking-widest block mb-1">Usuários Ativos</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-indigo-400">{stats.usersCount}</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-4 leading-tight">Colecionadores cadastrados competindo ativamente pelos cromos raros</p>
          </motion.div>
        </motion.div>

        {/* Demo Roles Shortcut Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-white/10 backdrop-blur-md text-center max-w-4xl mx-auto shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-semibold py-1 px-2.5 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/20 uppercase tracking-widest">Navegação Expressa</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Acesso Rápido de Simulação (Ambiente de Demonstração)</h3>
          <p className="text-sm text-neutral-300 mb-6">Explore o painel de cada ator do sistema com um único clique, sem necessidade de preencher formulários:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onQuickRole('colecionador')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 flex items-center justify-center gap-2 transition-all hover:border-blue-500/40 font-medium group text-sm"
            >
              <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              Sou Colecionador
            </button>
            <button
              onClick={() => onQuickRole('gestor')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-emerald-600/20 border border-white/10 flex items-center justify-center gap-2 transition-all hover:border-emerald-500/40 font-medium group text-sm"
            >
              <Coins className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              Sou Gestor de Vendas
            </button>
            <button
              onClick={() => onQuickRole('admin')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-yellow-600/20 border border-white/10 flex items-center justify-center gap-2 transition-all hover:border-yellow-500/40 font-medium group text-sm"
            >
              <Shield className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
              Sou Administrador
            </button>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <div id="como-funciona" className="pt-24 pb-8 border-t border-white/10 mt-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Como Funciona a Plataforma?</h2>
            <p className="text-sm text-neutral-400">Processo simples e intuitivo planejado para colecionadores de todas as idades.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full transition-all group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-6">
                <Shuffle className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">1. Cadastre-se ou Simule</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Entre com sua conta real ou use nossos atalhos rápidos de demonstração para entender como funciona o ecossistema perfeito do Copa Trocas.
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full transition-all group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center mb-6">
                <Coins className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">2. Escolha e Negocie</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Navegue pelo catálogo completo de figurinhas anunciadas pelos gestores da Copa, envie propostas de troca de repetidas ou dê lances em dinheiro.
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full transition-all group-hover:scale-110"></div>
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">3. Finalize com Segurança</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                O gestor avalia as ofertas em tempo real. Uma vez aprovada, a transação é debitada ou a troca é consolidada, atualizando instantaneamente seu inventário.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-black/50 border-t border-white/10 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="text-base font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-emerald-400">
              COPA TROCAS 2026
            </h4>
            <p className="text-xs text-neutral-500 mt-1">Transformando a paixão nacional pelo futebol em conexões inteligentes.</p>
          </div>
          <div className="flex gap-4 text-xs text-neutral-500 hover:text-neutral-400 transition-colors">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500" /> Desenvolvido para a Copa do Mundo FIFA 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
