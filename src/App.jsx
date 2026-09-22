import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Box, Heart, AlertCircle, Plus, Info, CheckCircle2, Lock, LogIn, FileText, Settings, User, Check, X, Clock } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showModalDoacao, setShowModalDoacao] = useState(false);
  const [showModalSolicitacao, setShowModalSolicitacao] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);

  // Estados dos Dados Reais do Supabase
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([
    'Anti-hipertensivo', 
    'Anticoncepcional', 
    'Suplemento / Vitamina', 
    'Broncodilatador', 
    'Analgésico / Anti-inflamatório', 
    'Diabetes / Hipoglicemiante', 
    'Antiparkinsoniano', 
    'Antibiótico / Antimicrobiano', 
    'Outros'
  ]);
  const [doadores, setDoadores] = useState([
    'Cavalcanti Orsi', 
    'Dr. Javier', 
    'Amostra Grátis Laboratório', 
    'Doação Anônima Comunidade'
  ]);
  const [lotes, setLotes] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  // Carregar dados do Supabase ao iniciar
  useEffect(() => {
    carregarDadosDoSupabase();
  }, []);

  async function carregarDadosDoSupabase() {
    try {
      // Buscar Medicamentos
      const { data: dadosMed, error: erroMed } = await supabase.from('medicamentos').select('*');
      if (!erroMed && dadosMed) {
        setMedicamentos(dadosMed.map(m => ({
          id: m.id,
          nome: m.nome_comercial,
          principio: m.principio_ativo,
          categoria: m.categoria || 'Outros'
        })));
      }

      // Buscar Lotes / Estoque
      const { data: dadosLotes, error: erroLotes } = await supabase.from('estoque_lotes').select('*');
      if (!erroLotes && dadosLotes) {
        setLotes(dadosLotes.map(l => ({
          id: l.id,
          medicamento_id: l.medicamento_id,
          lote: l.numero_lote,
          validade: l.data_validade,
          qtd_caixas: l.qtd_caixas,
          unidades_por_caixa: l.unidades_por_caixa,
          doador: l.parceiro_doador
        })));
      }

      // Buscar Solicitações
      const { data: dadosSol, error: erroSol } = await supabase.from('solicitacoes').select('*').order('created_at', { ascending: false });
      if (!erroSol && dadosSol) {
        setSolicitacoes(dadosSol);
      }
    } catch (error) {
      console.error('Erro ao conectar com o Supabase:', error);
    }
  }

  // --- COMPONENTES DAS PÁGINAS ---

  const Header = () => (
    <header className="bg-emerald-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-emerald-300" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Farmácia Solidária</h1>
            <p className="text-xs text-emerald-200">Igreja Presbiteriana Lírio dos Vales</p>
          </div>
        </div>
        <nav className="flex gap-2">
          <button 
            onClick={() => setActiveTab('inicio')}
            className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'inicio' ? 'bg-amber-500 text-emerald-950' : 'hover:bg-emerald-700'}`}
          >
            <Info className="w-4 h-4" /> Início & Propósito
          </button>
          <button 
            onClick={() => setActiveTab('consulta')}
            className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'consulta' ? 'bg-amber-500 text-emerald-950' : 'hover:bg-emerald-700'}`}
          >
            <Search className="w-4 h-4" /> Consulta de Remédios
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'admin' ? 'bg-amber-500 text-emerald-950' : 'hover:bg-emerald-700'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Painel Admin
          </button>
        </nav>
      </div>
    </header>
  );

  const InicioView = () => (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-emerald-900 text-white rounded-2xl p-8 shadow-lg text-center space-y-6">
        <span className="bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-emerald-700">Ação Social sem fins lucrativos</span>
        <h2 className="text-4xl font-extrabold text-amber-400">Garantindo acesso digno à saúde para quem mais precisa.</h2>
        <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
          A Farmácia Solidária Lírio dos Vales arrecada medicamentos doados por amostras grátis, médicos, parceiros e comunidade para distribuição gratuita à população carente mediante receita válida.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button 
            onClick={() => setActiveTab('consulta')}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Search className="w-5 h-5" /> Solicitar Medicamento
          </button>
          <button 
            onClick={() => setShowModalDoacao(true)}
            className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Heart className="w-5 h-5" /> Quero Doar Medicamentos
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Nossa Missão</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Expressar o amor de Cristo por meio do cuidado com a saúde, oferecendo medicamentos gratuitos, orientação farmacêutica responsável e educação sobre o uso correto dos medicamentos.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 italic text-slate-500 text-sm">
            "estive enfermo, e vocês cuidaram de mim." - Mateus 25:36
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Info className="text-emerald-600" /> Responsabilidade Técnica</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Farmacêutica Resp.:</strong> Dra. Monique Camprubi Pereira (CRF Nº: 104872)</li>
            <li><strong>Registro do Projeto:</strong> CRF Nº: 96633</li>
            <li><strong>Autores:</strong> Dr. Javier Oscar Villalpando Rosas e Dra. Patrícia Neves Villalpando</li>
            <li><strong>Pastor Resp.:</strong> Rev. Erasmo Consani Neto</li>
          </ul>
        </div>
      </section>
    </div>
  );

  const ConsultaView = () => {
    const [busca, setBusca] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');

    const medicamentosFiltrados = medicamentos.filter(med => {
      const matchBusca = med.nome.toLowerCase().includes(busca.toLowerCase()) || med.principio.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = filtroCategoria ? med.categoria === filtroCategoria : true;
      return matchBusca && matchCategoria;
    });

    return (
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
          <h3 className="font-bold text-amber-900 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Regras para Solicitação</h3>
          <p className="text-sm text-amber-800 mt-1">
            A entrega do medicamento é <strong>100% gratuita</strong>. Faça a reserva online e apresente a Receita Médica válida e documento com foto para retirada no local.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou princípio ativo..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <select 
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full md:w-64 p-2 border border-slate-300 rounded-lg outline-none bg-white"
          >
            <option value="">Todas as Categorias</option>
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicamentosFiltrados.map(med => (
            <div key={med.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 flex-1">
                <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded mb-2">
                  {med.categoria}
                </span>
                <h3 className="font-bold text-lg text-slate-800">{med.nome}</h3>
                <p className="text-sm text-slate-500 mt-1">{med.principio}</p>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setMedicamentoSelecionado(med);
                    setShowModalSolicitacao(true);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Solicitar e Reservar
                </button>
              </div>
            </div>
          ))}
          {medicamentosFiltrados.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Nenhum medicamento encontrado com estes filtros.
            </div>
          )}
        </div>
      </div>
    );
  };

  const AdminLogin = () => (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-sm text-slate-500 mt-2">Área exclusiva para Voluntários e Farmacêuticos do projeto.</p>
      </div>
      <div className="space-y-4 text-left">
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">E-mail</label>
          <input type="email" placeholder="admin@liriodosvales.org" className="w-full mt-1 p-3 border border-slate-300 rounded-lg outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Senha</label>
          <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 border border-slate-300 rounded-lg outline-none" />
        </div>
        <button 
          onClick={() => setIsAdminAuthenticated(true)}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4"
        >
          <LogIn className="w-5 h-5" /> Entrar no Sistema
        </button>
      </div>
    </div>
  );

  const AdminPanel = () => {
    const [adminTab, setAdminTab] = useState('pedidos');

    const handleAtualizarStatus = async (id, novoStatus) => {
      try {
        const { error } = await supabase
          .from('solicitacoes')
          .update({ status: novoStatus })
          .eq('id', id);

        if (error) throw error;
        carregarDadosDoSupabase();
      } catch (err) {
        alert('Erro ao atualizar status: ' + err.message);
      }
    };

    return (
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-emerald-900 text-white p-4 rounded-xl mb-4">
            <p className="text-xs text-emerald-300 uppercase font-bold tracking-wider mb-1">Voluntário Logado</p>
            <p className="font-medium flex items-center gap-2"><User className="w-4 h-4" /> Equipa Farmácia</p>
          </div>
          <button 
            onClick={() => setAdminTab('pedidos')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminTab === 'pedidos' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <FileText className="w-5 h-5" /> Triagem de Pedidos
          </button>
          <button 
            onClick={() => setAdminTab('lotes')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminTab === 'lotes' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Box className="w-5 h-5" /> Gestão de Estoque
          </button>
          <button 
            onClick={() => setIsAdminAuthenticated(false)}
            className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-red-600 hover:bg-red-50 mt-8"
          >
            Sair do Sistema
          </button>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {adminTab === 'pedidos' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Triagem de Pedidos</h2>
                <p className="text-slate-500 text-sm">Analise as solicitações dos pacientes e aprove a reserva de estoque.</p>
              </div>

              <div className="space-y-4">
                {solicitacoes.map((sol) => {
                  const med = medicamentos.find(m => m.id === sol.medicamento_id);
                  return (
                    <div key={sol.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            sol.status === 'PENDENTE' ? 'bg-amber-100 text-amber-800' :
                            sol.status === 'APROVADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {sol.status}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(sol.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">{sol.nome_paciente}</h4>
                        <p className="text-sm text-slate-600">CPF: {sol.cpf_paciente} | Tel: {sol.telefone_paciente}</p>
                        <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-sm">
                          <strong>Solicitou:</strong> {sol.quantidade_solicitada}x {med?.nome || 'Medicamento'} ({med?.principio})
                        </div>
                      </div>

                      {sol.status === 'PENDENTE' && (
                        <div className="flex gap-2 w-full md:w-auto">
                          <button 
                            onClick={() => handleAtualizarStatus(sol.id, 'APROVADO')}
                            className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Aprovar
                          </button>
                          <button 
                            onClick={() => handleAtualizarStatus(sol.id, 'REJEITADO')}
                            className="flex-1 md:flex-initial bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" /> Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {solicitacoes.length === 0 && (
                  <div className="text-center py-12 text-slate-400">Nenhuma solicitação pendente no momento.</div>
                )}
              </div>
            </div>
          )}

          {adminTab === 'lotes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Estoque de Lotes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="p-3 font-semibold">Medicamento</th>
                      <th className="p-3 font-semibold">Lote / Validade</th>
                      <th className="p-3 font-semibold">Qtd. Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotes.map((lote) => {
                      const med = medicamentos.find(m => m.id === lote.medicamento_id);
                      return (
                        <tr key={lote.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-800">{med?.nome || 'Medicamento'}</td>
                          <td className="p-3 text-sm">{lote.lote} (Val: {lote.validade})</td>
                          <td className="p-3 font-bold text-emerald-700">{lote.qtd_caixas} caixas</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

const ModalSolicitacaoPaciente = ({ medicamento, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');

    // Passo 1: Identificação Segura
    const [cpf, setCpf] = useState('');
    const [whatsapp4, setWhatsapp4] = useState('');

    // Passo 2: Dados Pessoais
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [endereco, setEndereco] = useState('');
    const [beneficiarioId, setBeneficiarioId] = useState(null);

    // Passo 3: Informações Clínicas
    const [tratamento, setTratamento] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [receitaFile, setReceitaFile] = useState(null);

    // Passo 4: Consentimento
    const [consentimento, setConsentimento] = useState(false);

    const handleVerificarIdentificacao = async (e) => {
      e.preventDefault();
      setErro('');
      setEnviando(true);

      try {
        // Verifica se o beneficiário existe pelo CPF e final do WhatsApp
        const { data, error } = await supabase
          .from('beneficiarios')
          .select('*')
          .eq('cpf', cpf)
          .like('whatsapp', `%${whatsapp4}`);

        if (error) throw error;

        // Confirmação Positiva: Pré-preenche os dados
        if (data && data.length > 0) {
          const b = data[0];
          setBeneficiarioId(b.id);
          setNome(b.nome);
          setWhatsapp(b.whatsapp);
          setEndereco(b.endereco);
        } else {
          // Sem correspondência: Formulário em branco
          setBeneficiarioId(null);
          setNome('');
          setWhatsapp('');
          setEndereco('');
        }
        setStep(2);
      } catch (err) {
        setErro('Erro ao verificar dados. Tente novamente.');
      } finally {
        setEnviando(false);
      }
    };

    const handleEnviarSolicitacao = async (e) => {
      e.preventDefault();
      if (!consentimento) {
        setErro('É obrigatório aceitar os termos de consentimento.');
        return;
      }
      setEnviando(true);
      setErro('');

      try {
        let currentBeneficiarioId = beneficiarioId;

        // 1. Criar ou Atualizar Beneficiário
        if (currentBeneficiarioId) {
          await supabase.from('beneficiarios').update({
            nome, whatsapp, endereco
          }).eq('id', currentBeneficiarioId);
        } else {
          const { data: novoB, error: errB } = await supabase.from('beneficiarios').insert([{
            cpf, nome, whatsapp, endereco
          }]).select().single();
          if (errB) throw errB;
          currentBeneficiarioId = novoB.id;
        }

        // 2. Upload da Receita no Storage
        let receita_url = null;
        if (receitaFile) {
          const fileExt = receitaFile.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${currentBeneficiarioId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('receitas')
            .upload(filePath, receitaFile);

          if (uploadError) throw uploadError;
          receita_url = filePath;
        }

        // 3. Gravar Solicitação com Consentimento LGPD
        const { error: errSol } = await supabase.from('solicitacoes').insert([{
          beneficiario_id: currentBeneficiarioId,
          medicamento_id: medicamento.id,
          quantidade_solicitada: parseInt(quantidade),
          tratamento: tratamento,
          receita_url: receita_url,
          consentimento_lgpd: consentimento,
          status: 'PENDENTE'
        }]);

        if (errSol) throw errSol;

        alert('✅ Solicitação enviada com sucesso! Aguarde a análise da equipa de triagem.');
        onSuccess();
        onClose();
      } catch (err) {
        console.error(err);
        setErro('Erro ao enviar solicitação. Verifique os dados ou a ligação.');
      } finally {
        setEnviando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          <div className="bg-emerald-800 text-white p-4 flex justify-between items-center shrink-0">
            <h3 className="font-bold">Solicitar {medicamento.nome}</h3>
            <button onClick={onClose} className="text-emerald-200 hover:text-white text-xl leading-none">✕</button>
          </div>

          <div className="p-6 overflow-y-auto">
            {/* Barra de Progresso */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-emerald-600' : 'bg-slate-200'}`} />
              ))}
            </div>

            {erro && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{erro}</div>}

            {/* PASSO 1: Identificação */}
            {step === 1 && (
              <form onSubmit={handleVerificarIdentificacao} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm text-slate-600 mb-4">Para começar, informe os seus dados de contacto para verificação de segurança.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">CPF</label>
                  <input type="text" required value={cpf} onChange={e => setCpf(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" placeholder="000.000.000-00" inputMode="numeric" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Últimos 4 dígitos do WhatsApp</label>
                  <input type="text" required maxLength="4" value={whatsapp4} onChange={e => setWhatsapp4(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" placeholder="Ex: 9999" inputMode="numeric" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">Cancelar</button>
                  <button type="submit" disabled={enviando} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-lg transition-colors">{enviando ? 'A verificar...' : 'Continuar'}</button>
                </div>
              </form>
            )}

            {/* PASSO 2: Dados Pessoais */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm text-slate-600 mb-4">Confirme ou atualize as suas informações para o atendimento.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome Completo</label>
                  <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" placeholder="Ex: João Silva" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">WhatsApp (com DDD)</label>
                  <input type="text" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" placeholder="(15) 99999-9999" inputMode="numeric" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Endereço Completo</label>
                  <textarea required value={endereco} onChange={e => setEndereco(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" rows="2" placeholder="Rua, número, bairro, Tatuí/SP"></textarea>
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">Voltar</button>
                  <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-lg transition-colors">Continuar</button>
                </div>
              </form>
            )}

            {/* PASSO 3: Informações Clínicas */}
            {step === 3 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm text-slate-600 mb-4">Detalhes do medicamento e tratamento.</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-bold">Medicamento Solicitado</p>
                  <p className="font-bold text-slate-800">{medicamento.nome} <span className="font-normal text-sm">({medicamento.principio})</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Para qual tratamento utiliza?</label>
                    <textarea required value={tratamento} onChange={e => setTratamento(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" rows="2" placeholder="Descreva brevemente..."></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Qtd. (Caixas)</label>
                    <input type="number" min="1" required value={quantidade} onChange={e => setQuantidade(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Anexar Receita (PDF, JPG, PNG)</label>
                  <input type="file" accept=".pdf,image/png,image/jpeg" onChange={e => setReceitaFile(e.target.files[0])} className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white" />
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(2)} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">Voltar</button>
                  <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-lg transition-colors">Continuar</button>
                </div>
              </form>
            )}

            {/* PASSO 4: Consentimento LGPD */}
            {step === 4 && (
              <form onSubmit={handleEnviarSolicitacao} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-900 mb-4">
                  <strong className="block mb-1">Quase pronto!</strong>
                  Lembre-se: A retirada dependerá da apresentação da Receita Médica física e documento com foto no local.
                </div>
                
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" required checked={consentimento} onChange={e => setConsentimento(e.target.checked)} className="mt-1 w-4 h-4 text-emerald-600 rounded cursor-pointer" />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    Declaro que li e concordo com o uso dos meus dados para análise da solicitação pela equipa responsável da Farmácia Solidária Lírio dos Vales.
                  </span>
                </label>

                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(3)} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg">Voltar</button>
                  <button type="submit" disabled={enviando || !consentimento} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {enviando ? 'A enviar...' : 'Enviar Solicitação'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ModalDoacao = () => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="bg-emerald-800 text-white p-6 text-center space-y-2">
          <Heart className="w-12 h-12 text-emerald-300 mx-auto" />
          <h2 className="text-2xl font-bold">Quer ser um parceiro doador?</h2>
          <p className="text-emerald-100 text-sm">Sua doação pode salvar vidas e garantir o tratamento de quem precisa.</p>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-slate-800">O que aceitamos:</h3>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
            <li>Medicamentos dentro do prazo de validade.</li>
            <li>Caixas lacradas (ou cartelas/blisters inviolados).</li>
            <li>Amostras grátis de consultórios médicos.</li>
          </ul>
          <div className="pt-4 text-center">
            <button onClick={() => setShowModalDoacao(false)} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Header />
      <main className="mt-8">
        {activeTab === 'inicio' && <InicioView />}
        {activeTab === 'consulta' && <ConsultaView />}
        {activeTab === 'admin' && !isAdminAuthenticated && <AdminLogin />}
        {activeTab === 'admin' && isAdminAuthenticated && <AdminPanel />}
      </main>
      
      {showModalDoacao && <ModalDoacao />}
      {showModalSolicitacao && medicamentoSelecionado && (
        <ModalSolicitacaoPaciente 
          medicamento={medicamentoSelecionado} 
          onClose={() => setShowModalSolicitacao(false)} 
          onSuccess={carregarDadosDoSupabase} 
        />
      )}
    </div>
  );
}