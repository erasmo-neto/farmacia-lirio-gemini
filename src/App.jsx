import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Box, Heart, AlertCircle, Plus, Info, CheckCircle2, Lock, LogIn, FileText, Settings, User } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showModalDoacao, setShowModalDoacao] = useState(false);

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
          A Farmácia Solidária Lírio dos Vales arrecada medicamentos doados por amostras grátis, médicos, parceiros e comunidade para distribuir gratuitamente à população carente mediante receita válida.
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

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-slate-800">Como funciona o projeto?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Arrecadação', desc: 'Recebemos medicamentos lacrados e na validade (exceto controlados).' },
            { step: '2', title: 'Triagem Clínica', desc: 'A farmacêutica verifica qualidade, lote e cadastra no estoque oficial.' },
            { step: '3', title: 'Distribuição', desc: 'O paciente consulta online e retira o remédio gratuitamente com a receita.' }
          ].map((item) => (
            <div key={item.step} className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center space-y-3 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-6xl font-black text-emerald-100/50">{item.step}</div>
              <h4 className="font-bold text-emerald-900 relative z-10">{item.title}</h4>
              <p className="text-sm text-emerald-700 relative z-10">{item.desc}</p>
            </div>
          ))}
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
            A entrega do medicamento é <strong>100% gratuita</strong> e condicionada à apresentação de Receita Médica válida (180 dias para uso geral, 365 dias para anticoncepcionais) e documento de identificação.
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
                <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Enviar Receita e Solicitar
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
        <p className="text-xs text-center text-slate-400 pt-2">(Apenas clique em Entrar para testar)</p>
      </div>
    </div>
  );

  const AdminPanel = () => {
    const [adminTab, setAdminTab] = useState('lotes');
    const [showModalNovoLote, setShowModalNovoLote] = useState(false);

    return (
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-emerald-900 text-white p-4 rounded-xl mb-4">
            <p className="text-xs text-emerald-300 uppercase font-bold tracking-wider mb-1">Voluntário Logado</p>
            <p className="font-medium flex items-center gap-2"><User className="w-4 h-4" /> Equipa Farmácia</p>
          </div>
          <button 
            onClick={() => setAdminTab('lotes')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminTab === 'lotes' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Box className="w-5 h-5" /> Gestão de Lotes
          </button>
          <button 
            onClick={() => setAdminTab('pedidos')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminTab === 'pedidos' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <FileText className="w-5 h-5" /> Triagem de Pedidos
          </button>
          <button 
            onClick={() => setIsAdminAuthenticated(false)}
            className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-red-600 hover:bg-red-50 mt-8"
          >
            Sair do Sistema
          </button>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {adminTab === 'lotes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Estoque e Lotes</h2>
                  <p className="text-slate-500 text-sm">Controle interno de quantidades sincronizado com o Supabase.</p>
                </div>
                <button 
                  onClick={() => setShowModalNovoLote(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Dar Entrada em Lote
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="p-3 font-semibold">Medicamento</th>
                      <th className="p-3 font-semibold">Lote / Validade</th>
                      <th className="p-3 font-semibold">Qtd. Interna</th>
                      <th className="p-3 font-semibold">Doador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotes.map((lote) => {
                      const med = medicamentos.find(m => m.id === lote.medicamento_id);
                      return (
                        <tr key={lote.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{med?.nome || 'Medicamento'}</p>
                            <p className="text-xs text-slate-500">{med?.principio}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-slate-700">Lote: {lote.lote}</p>
                            <p className="text-xs text-slate-500">Val: {lote.validade}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-emerald-700">{lote.qtd_caixas} caixas</p>
                            <p className="text-xs text-slate-500">({lote.qtd_caixas * lote.unidades_por_caixa} unid. total)</p>
                          </td>
                          <td className="p-3 text-sm text-slate-600">{lote.doador}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'pedidos' && (
            <div className="text-center py-12 text-slate-500">
              Módulo de triagem de pedidos em desenvolvimento.
            </div>
          )}
        </div>

        {showModalNovoLote && (
          <ModalEntradaLote 
            onClose={() => setShowModalNovoLote(false)} 
            onSuccess={carregarDadosDoSupabase}
            medicamentos={medicamentos}
            categorias={categorias}
            doadores={doadores}
            setCategorias={setCategorias}
            setDoadores={setDoadores}
          />
        )}
      </div>
    );
  };

  const ModalEntradaLote = ({ onClose, onSuccess, medicamentos, categorias, doadores, setCategorias, setDoadores }) => {
    const [tipoMedicamento, setTipoMedicamento] = useState('existente');
    const [medSelecionado, setMedSelecionado] = useState(medicamentos[0]?.id || '');
    
    // Novo Medicamento
    const [novoNome, setNovoNome] = useState('');
    const [novoPrincipio, setNovoPrincipio] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState(categorias[0]);
    const [novaCategoriaInput, setNovaCategoriaInput] = useState('');

    // Lote
    const [numLote, setNumLote] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [qtdCaixas, setQtdCaixas] = useState(1);
    const [unidadesCaixa, setUnidadesCaixa] = useState(10);
    
    // Doador
    const [selectedDoador, setSelectedDoador] = useState(doadores[0]);
    const [novoDoadorInput, setNovoDoadorInput] = useState('');

    const isAddingCategoria = selectedCategoria === 'adicionar_nova';
    const isAddingDoador = selectedDoador === 'adicionar_novo';

    const handleSalvarLote = async (e) => {
      e.preventDefault();
      try {
        let medIdFinal = medSelecionado;

        // Se for novo medicamento, insere na tabela 'medicamentos' primeiro
        if (tipoMedicamento === 'novo') {
          const categoriaFinal = isAddingCategoria ? novaCategoriaInput : selectedCategoria;
          
          if (isAddingCategoria && novaCategoriaInput.trim()) {
            setCategorias([...categorias, novaCategoriaInput.trim()]);
          }

          const { data: medInserido, error: errMed } = await supabase
            .from('medicamentos')
            .insert([{ 
              nome_comercial: novoNome.toUpperCase(), 
              principio_ativo: novoPrincipio, 
              categoria: categoriaFinal 
            }])
            .select()
            .single();

          if (errMed) throw errMed;
          medIdFinal = medInserido.id;
        }

        const doadorFinal = isAddingDoador ? novoDoadorInput : selectedDoador;
        if (isAddingDoador && novoDoadorInput.trim()) {
          setDoadores([...doadores, novoDoadorInput.trim()]);
        }

        // Insere o lote na tabela 'estoque_lotes'
        const { error: errLote } = await supabase
          .from('estoque_lotes')
          .insert([{
            medicamento_id: medIdFinal,
            numero_lote: numLote,
            data_validade: dataValidade,
            qtd_caixas: parseInt(qtdCaixas),
            unidades_por_caixa: parseInt(unidadesCaixa),
            parceiro_doador: doadorFinal
          }]);

        if (errLote) throw errLote;

        onSuccess();
        onClose();
      } catch (error) {
        alert('Erro ao salvar no Supabase: ' + error.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-emerald-800 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <h3 className="font-bold flex items-center gap-2"><Box className="w-5 h-5" /> Dar Entrada em Lote</h3>
            <button onClick={onClose} className="text-emerald-200 hover:text-white">✕</button>
          </div>
          
          <form onSubmit={handleSalvarLote} className="p-6 space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                type="button"
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tipoMedicamento === 'existente' ? 'bg-white shadow text-emerald-800' : 'text-slate-500'}`}
                onClick={() => setTipoMedicamento('existente')}
              >
                Existente no Catálogo
              </button>
              <button 
                type="button"
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tipoMedicamento === 'novo' ? 'bg-amber-400 shadow text-amber-950' : 'text-slate-500'}`}
                onClick={() => setTipoMedicamento('novo')}
              >
                + Cadastrar Novo
              </button>
            </div>

            {tipoMedicamento === 'existente' ? (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Selecione o Medicamento</label>
                <select 
                  value={medSelecionado}
                  onChange={(e) => setMedSelecionado(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {medicamentos.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.principio})</option>)}
                </select>
              </div>
            ) : (
              <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg space-y-4">
                <h4 className="text-sm font-bold text-amber-800">Dados do Novo Medicamento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome Comercial</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: DIPIRONA 500MG" 
                      value={novoNome} 
                      onChange={e => setNovoNome(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Princípio Ativo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Dipirona monoidratada" 
                      value={novoPrincipio} 
                      onChange={e => setNovoPrincipio(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Categoria</label>
                    <select 
                      value={selectedCategoria}
                      onChange={(e) => setSelectedCategoria(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      <option value="adicionar_nova" className="font-bold text-emerald-700">+ Nova Categoria...</option>
                    </select>
                    {isAddingCategoria && (
                      <input 
                        type="text" 
                        required
                        placeholder="Digite o nome da nova categoria" 
                        value={novaCategoriaInput}
                        onChange={(e) => setNovaCategoriaInput(e.target.value)}
                        className="w-full mt-2 p-2 border border-emerald-400 bg-white rounded-lg" 
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número do Lote</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: L78912" 
                  value={numLote} 
                  onChange={e => setNumLote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade (Mês/Ano)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: 10/2027" 
                  value={dataValidade} 
                  onChange={e => setDataValidade(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qtd. de Caixas</label>
                <input 
                  type="number" 
                  min={1} 
                  required
                  value={qtdCaixas} 
                  onChange={e => setQtdCaixas(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unidades por Caixa</label>
                <input 
                  type="number" 
                  min={1} 
                  required
                  value={unidadesCaixa} 
                  onChange={e => setUnidadesCaixa(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg" 
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Doador / Parceiro / Médico</label>
                <select 
                  value={selectedDoador}
                  onChange={(e) => setSelectedDoador(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {doadores.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="adicionar_novo" className="font-bold text-emerald-700">+ Cadastrar Novo Doador...</option>
                </select>
                {isAddingDoador && (
                  <input 
                    type="text" 
                    required
                    placeholder="Digite o nome do novo doador" 
                    value={novoDoadorInput}
                    onChange={(e) => setNovoDoadorInput(e.target.value)}
                    className="w-full mt-2 p-2 border border-emerald-400 bg-white rounded-lg" 
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-lg">Salvar Lote no Supabase</button>
            </div>
          </form>
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
          
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg mt-4">
            <h3 className="font-bold text-red-800 flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4" /> NÃO podemos receber:</h3>
            <ul className="text-sm text-red-700 space-y-1 list-disc pl-5">
              <li>Medicamentos de Controle Especial (Portaria 344).</li>
              <li>Medicamentos termolábeis (que precisam de refrigeração).</li>
              <li>Líquidos, cremes ou pomadas já abertos.</li>
            </ul>
          </div>

          <div className="pt-4 text-center space-y-3">
            <p className="text-sm text-slate-500">Para combinar a entrega da sua doação, entre em contato:</p>
            <a href="https://wa.me/5515999999999" target="_blank" rel="noreferrer" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-sm">
              Falar no WhatsApp da Igreja
            </a>
            <button onClick={() => setShowModalDoacao(false)} className="text-slate-400 hover:text-slate-600 text-sm font-medium mt-2">
              Voltar
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
    </div>
  );
}