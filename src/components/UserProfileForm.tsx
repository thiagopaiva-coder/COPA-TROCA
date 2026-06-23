/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, MapPin, Calendar, Phone, 
  Mail, Sparkles, CheckCircle2, FileText, Check 
} from 'lucide-react';
import { User } from '../types';

interface UserProfileFormProps {
  currentUser: User;
  onUpdateUser: (updated: User) => void;
  onAddActivityLog: (acao: string, detalhes: string) => void;
}

export default function UserProfileForm({ 
  currentUser, 
  onUpdateUser,
  onAddActivityLog
}: UserProfileFormProps) {
  // Extract or initialize variables
  const [nome, setNome] = useState(currentUser.nome.split(' ')[0] || '');
  const [sobrenome, setSobrenome] = useState(currentUser.sobrenome || currentUser.nome.split(' ').slice(1).join(' ') || '');
  const [cpf, setCpf] = useState(currentUser.cpf || '');
  const [dataNascimento, setDataNascimento] = useState(currentUser.dataNascimento || '1998-10-18');
  const [telefone, setTelefone] = useState(currentUser.telefone || '');
  
  // Address parameters
  const [cep, setCep] = useState(currentUser.enderecoCompleto?.cep || '');
  const [rua, setRua] = useState(currentUser.enderecoCompleto?.rua || '');
  const [numero, setNumero] = useState(currentUser.enderecoCompleto?.numero || '');
  const [complemento, setComplemento] = useState(currentUser.enderecoCompleto?.complemento || '');
  const [bairro, setBairro] = useState(currentUser.enderecoCompleto?.bairro || '');
  const [cidade, setCidade] = useState(currentUser.enderecoCompleto?.cidade || '');
  const [estado, setEstado] = useState(currentUser.enderecoCompleto?.estado || '');

  // Feedbacks
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Formatting helper for CPF (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    }
    setCpf(value);
  };

  // Formatting helper for CEP (00000-000)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
    }
    setCep(value);

    // Auto load simulation for demo CEPs
    if (value.length === 8) {
      setRua(rua || 'Avenida das Palmeiras');
      setBairro(bairro || 'Copa Imperial');
      setCidade(cidade || 'Rio de Janeiro');
      setEstado(estado || 'RJ');
    }
  };

  // Formatting helper for Telefone ((99) 99999-9999)
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field Validations
    if (!nome.trim() || !sobrenome.trim() || !cpf || !dataNascimento || !telefone) {
      setError('Por favor, preencha todos os dados pessoais básicos.');
      return;
    }

    if (!cep || !rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
      setError('Por favor, preencha o endereço completo.');
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido. Certifique-se de preencher os 11 dígitos.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      
      const updatedUser: User = {
        ...currentUser,
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
          cidade: cityCamelCase(cidade),
          estado: estado.trim().toUpperCase(),
          cep: cep
        }
      };

      onUpdateUser(updatedUser);
      onAddActivityLog('Atualizou Cadastro', 'Ficha de dados pessoais atualizada com sucesso no banco de dados.');
      setSuccess('Cadastro pessoal salvo com sucesso!');
      
      // Clear success alert after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    }, 500);
  };

  const cityCamelCase = (str: string) => {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            Dados Cadastrais & Ficha Residencial
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Mantenha seu CPF, data de nascimento e endereço atualizados para transações seguras.
          </p>
        </div>
        <div className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-md text-[10px] text-yellow-400 uppercase font-black tracking-widest">
          Sincronizado via SSL
        </div>
      </div>

      {/* Feedbacks */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-200 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal Basics */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-neutral-400" />
            Informações Pessoais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Primeiro Nome
              </label>
              <input
                required
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Thiago"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Sobrenome completo
              </label>
              <input
                required
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                placeholder="Ex: Paiva"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                CPF (Cadastro de Pessoa Física)
              </label>
              <input
                required
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white font-mono text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
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

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                Telefone de Contato
              </label>
              <input
                required
                type="text"
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                E-mail (Login)
              </label>
              <input
                disabled
                type="email"
                value={currentUser.email}
                className="w-full px-3 py-2 bg-white/2 border border-white/5 rounded-xl text-neutral-500 text-xs cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Residential Address */}
        <div className="border-t border-white/10 pt-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Endereço Completo de Residência
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                CEP (Código Postal)
              </label>
              <input
                required
                type="text"
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white font-mono text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Rua / Avenida / Logradouro
              </label>
              <input
                required
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Ex: Avenida Copacabana"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Número
              </label>
              <input
                required
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: 450"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Complemento (Opcional)
              </label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Ex: Bloco C, Apto 204"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Bairro
              </label>
              <input
                required
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Ipanema"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Cidade (Município)
              </label>
              <input
                required
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Rio de Janeiro"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white text-xs transition-all focus:outline-none placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Estado (UF)
              </label>
              <input
                required
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Ex: RJ"
                maxLength={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-400 text-white uppercase text-xs transition-all focus:outline-none placeholder-neutral-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Save changes */}
        <div className="border-t border-white/10 pt-5 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/10 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          >
            {isSaving ? 'Gravando Alterações...' : (
              <>
                <Check className="w-4 h-4 text-neutral-950 stroke-[3]" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
