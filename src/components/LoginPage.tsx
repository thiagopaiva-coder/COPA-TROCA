/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, Mail, Shield, User as UserIcon, Users, AlertCircle, 
  Sparkles, MapPin, Calendar, Hash, Phone, ArrowRight 
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (email: string, role: UserRole) => void;
  onBack: () => void;
  existingUsers?: User[];
  onRegisterUser?: (newUser: User) => void;
}

export default function LoginPage({ 
  onLoginSuccess, 
  onBack, 
  existingUsers = [], 
  onRegisterUser 
}: LoginPageProps) {
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Toggle Mode State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Brand New Registration States
  const [regRole, setRegRole] = useState<'colecionador' | 'gestor'>('colecionador');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Complete Address States
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Quick Format Helper for CPF (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Apply layout mask
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    }
    setCpf(value);
  };

  // Quick Format Helper for CEP (00000-000)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
    }
    setCep(value);

    // Auto-completion simulation for demo feel!
    if (value.length === 8) {
      setRua('Avenida das Nações');
      setBairro('Jardim Copa');
      setCidade('São Paulo');
      setEstado('SP');
    }
  };

  // Quick Format Helper for Telefone ((99) 99999-9999)
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
    }
    setTelefone(value);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos do e-mail e senha.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      
      const found = existingUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
      if (found) {
        // Simple password mock check
        onLoginSuccess(email, found.role);
      } else {
        // Fallback checks for original demo accounts
        if (cleanEmail === 'colecionador@copatrocas.com.br' && password === '123456') {
          onLoginSuccess(email, 'colecionador');
        } else if (cleanEmail === 'gestor@copatrocas.com.br' && password === '123456') {
          onLoginSuccess(email, 'gestor');
        } else if (cleanEmail === 'admin@copatrocas.com.br' && password === '123456') {
          onLoginSuccess(email, 'admin');
        } else {
          setError('E-mail ou senha incorretos. Verifique suas credenciais!');
        }
      }
    }, 450);
  };

  // Register user handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field Validations
    if (!nome || !sobrenome || !cpf || !dataNascimento || !telefone || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os dados pessoais básicos.');
      return;
    }

    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      setError('Por favor, indique o endereço residencial completo.');
      return;
    }

    if (password !== confirmPassword) {
      setError('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    // CPF validator length check
    if (cpf.replace(/\D/g, '').length !== 11) {
      setError('Digite um CPF brasileiro válido com 11 dígitos.');
      return;
    }

    // Check duplicate emails
    const cleanEmail = email.trim().toLowerCase();
    const isEmailTaken = existingUsers.some(u => u.email.trim().toLowerCase() === cleanEmail);
    if (isEmailTaken || cleanEmail === 'colecionador@copatrocas.com.br' || cleanEmail === 'gestor@copatrocas.com.br' || cleanEmail === 'admin@copatrocas.com.br') {
      setError('Este endereço de e-mail já está sendo utilizado no sistema.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const newRegisteredUser: User = {
        id: `user-${Date.now()}`,
        nome: `${nome.trim()} ${sobrenome.trim()}`,
        sobrenome: sobrenome.trim(),
        cpf: cpf,
        dataNascimento: dataNascimento,
        telefone: telefone,
        enderecoCompleto: {
          rua: rua.trim(),
          numero: numero.trim(),
          complemento: complemento.trim(),
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase(),
          cep: cep
        },
        email: cleanEmail,
        role: regRole,
        ativo: true,
        // Assign a nice random sporty avatar from Unsplash
        avatar: regRole === 'gestor' 
          ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        wishlist: [],
        colecao: [],
        repetidas: []
      };

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      
      // Complete after delay
      setTimeout(() => {
        if (onRegisterUser) {
          onRegisterUser(newRegisteredUser);
        }
      }, 800);

    }, 600);
  };

  const fillQuickAccess = (profile: UserRole) => {
    setError('');
    const credentials = {
      colecionador: { email: 'colecionador@copatrocas.com.br', pass: '123456' },
      gestor: { email: 'gestor@copatrocas.com.br', pass: '123456' },
      admin: { email: 'admin@copatrocas.com.br', pass: '123456' },
    };

    setEmail(credentials[profile].email);
    setPassword(credentials[profile].pass);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 py-16">
      {/* Dynamic Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-full ${isRegisterMode ? 'max-w-2xl' : 'max-w-md'} z-10 transition-all duration-300`}
      >
        {/* Back link */}
        <button
          onClick={onBack}
          className="text-xs text-neutral-400 hover:text-white mb-6 flex items-center gap-2 transition-colors duration-200 cursor-pointer focus:outline-none"
        >
          &larr; Voltar para o início
        </button>

        {/* glass container */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* subtle header golden line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-yellow-500 via-emerald-400 to-blue-500"></div>

          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white flex items-center justify-center gap-2 uppercase tracking-wide">
              Copa Trocas <Sparkles className="w-5 h-5 text-yellow-400 animate-spin duration-5000" />
            </h2>
            <p className="text-xs text-neutral-300 mt-1.5 font-medium">
              {isRegisterMode 
                ? 'Preencha seus dados para começar a negociar figurinhas' 
                : 'Acesse o maior ecossistema de figurinhas da Copa do Mundo 2026.'}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-white/5 border border-white/15 p-1 rounded-xl mb-6">
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegisterMode 
                  ? 'bg-yellow-400 text-neutral-900 shadow-md' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              id="tab-open-register"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegisterMode 
                  ? 'bg-yellow-400 text-neutral-900 shadow-md' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Criar Nova Conta (Ficha Cadastral)
            </button>
          </div>

          {/* State feedbacks */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-xs text-emerald-300 flex items-start gap-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mt-1.5"></div>
              <span>{success}</span>
            </motion.div>
          )}

          {/* MODE: REGISTER FIELD FORM */}
          {isRegisterMode ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Profile Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Qual é o seu objetivo na plataforma?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('colecionador')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      regRole === 'colecionador'
                        ? 'bg-blue-600/20 border-blue-400 text-blue-200'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Colecionador (Trocar Cromos)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('gestor')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      regRole === 'gestor'
                        ? 'bg-emerald-600/20 border-emerald-400 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Gestor (Intermediar e Vender)</span>
                  </button>
                </div>
              </div>

              {/* 1. Basic Fields */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-3 flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-yellow-400" />
                  Dados Pessoais
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Nome
                    </label>
                    <input
                      required
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: João"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Sobrenome
                    </label>
                    <input
                      required
                      type="text"
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      placeholder="Ex: Silva"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      CPF
                    </label>
                    <input
                      required
                      type="text"
                      value={cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white font-mono text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Data de Nascimento
                    </label>
                    <input
                      required
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Full Address Block */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Endereço Residencial Completo
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      CEP
                    </label>
                    <input
                      required
                      type="text"
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white font-mono text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Rua / Logradouro
                    </label>
                    <input
                      required
                      type="text"
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      placeholder="Ex: Avenida Paulista"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Número
                    </label>
                    <input
                      required
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Ex: 1200"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      placeholder="Apto 45, Bloco B"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Bairro
                    </label>
                    <input
                      required
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Centro"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Cidade
                    </label>
                    <input
                      required
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Estado (UF)
                    </label>
                    <input
                      required
                      type="text"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      placeholder="Ex: SP"
                      maxLength={2}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white uppercase text-xs transition-all focus:outline-none placeholder-neutral-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Credentials and Phone */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-3 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Credenciais de Autenticação
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Número de Telefone Comercial / Contato
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={telefone}
                        onChange={handleTelefoneChange}
                        placeholder="(11) 99999-9999"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                      />
                      <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      E-mail de Login
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: seuemail@copatrocas.com"
                        className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-500"
                      />
                      <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Senha Provisória
                    </label>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-neutral-950 font-black rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs uppercase tracking-widest mt-4"
              >
                {isLoading ? 'Registrando Informações...' : 'Confirmar e Cadastrar no Banco de Dados'}
              </button>
            </form>
          ) : (
            // MODE: LOGIN FORM
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: colecionador@copatrocas.com.br"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 text-white text-sm transition-all focus:outline-none placeholder-neutral-500"
                    />
                    <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha demonstrativa"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 text-white text-sm transition-all focus:outline-none placeholder-neutral-500"
                    />
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-neutral-400" />
                  </div>
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl shadow-lg shadow-yellow-500/10 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm mt-2"
                >
                  {isLoading ? 'Autenticando...' : 'Acessar Conta'}
                </button>
              </form>

              {/* Quick access Demo card */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider text-center mb-4">
                  Acesso Rápido para Testes Gerais
                </h4>
                <div className="space-y-2.5">
                  <button
                    id="btn-quick-collector"
                    type="button"
                    onClick={() => fillQuickAccess('colecionador')}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-200">Colecionador</p>
                        <p className="text-[10px] text-neutral-500">Thiago Paiva (com repetidas)</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">Preencher</span>
                  </button>

                  <button
                    id="btn-quick-gestor"
                    type="button"
                    onClick={() => fillQuickAccess('gestor')}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-emerald-600/10 border border-white/10 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-200">Gestor de Vendas</p>
                        <p className="text-[10px] text-neutral-500">Marcos Silva (Controle financeiro)</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">Preencher</span>
                  </button>

                  <button
                    id="btn-quick-admin"
                    type="button"
                    onClick={() => fillQuickAccess('admin')}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-yellow-600/10 border border-white/10 hover:border-yellow-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500/80 group-hover:scale-105 transition-transform">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-200">Administrador</p>
                        <p className="text-[10px] text-neutral-500">Ana Costa (Métricas, Logs & Usuários)</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">Preencher</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
