import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Truck, Package, Edit, Trash2 } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

// DADOS MOCKADOS: Simulam pedidos dos consumidores para demonstração de logística
const PEDIDOS_MOCK = [
    { id: 101, produto: 'Tomate Italiano (5kg)', consumidor: 'Ana Silva', status: 'AGUARDANDO_PRODUTOR', data: '26/11', total: 42.50 },
    { id: 102, produto: 'Morango (12 bdj)', consumidor: 'Marcus Oliveira', status: 'EM_ROTA_ENTREGA', data: '26/11', total: 180.00 },
    { id: 103, produto: 'Cesta de Legumes', consumidor: 'Restaurante Sabor', status: 'ENTREGUE', data: '25/11', total: 45.90 },
];

const STATUS_MAP = {
    AGUARDANDO_PRODUTOR: { text: 'Aguardando Coleta', color: '#e67e22' },
    EM_ROTA_ENTREGA: { text: 'Em Rota de Entrega', color: '#2980b9' },
    ENTREGUE: { text: 'Entregue', color: '#27ae60' },
};

const URL_API = 'sabor-que-conecta-fullstack-production.up.railway.app/produtos';
const INITIAL_FORM = { id: null, nome: '', produtor: '', preco: '', categoria: 'Legumes', imagem: '' };

export default function Produtor() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  // PROTEÇÃO DE ROTA: Apenas produtores podem acessar
  if (!isAuthenticated || user.tipo_usuario !== 'produtor') {
      return <Navigate to="/login" replace />; 
  }
  
  const [form, setForm] = useState(INITIAL_FORM);
  const [view, setView] = useState('CADASTRO');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Funções de Gerenciamento de Produtos
  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await fetch(URL_API);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar lista de produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleEdit = (produto) => {
      setForm(produto);
      setView('CADASTRO');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${nome}"? Esta ação é irreversível.`)) {
        return;
    }
    try {
        const response = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            alert(`Produto ${nome} excluído com sucesso. (Operação registrada na Auditoria)`);
            fetchProdutos(); 
        } else {
             alert('Erro ao excluir na API.');
        }
    } catch (error) {
        alert('Erro de conexão.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = form.id !== null;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${URL_API}/${form.id}` : URL_API;
    
    try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (response.ok) {
             alert(`Produto ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`);
             setForm(INITIAL_FORM);
             fetchProdutos();
        } else {
             alert('Erro na API.');
        }
    } catch (error) {
         alert('Erro de conexão ou no servidor.');
    }
  };

  // Renderização das Telas
  const renderCadastro = () => (
    <>
      <div className="card" style={{padding: '30px', marginBottom: '30px'}}>
        <h2 style={{color: form.id ? '#2980b9' : '#27ae60', marginTop: 0}}>
            {form.id ? `✏️ Editando: ${form.nome}` : '🚜 Cadastrar Nova Colheita'}
        </h2>
        <p>Preencha os dados do produto.</p>
        <form onSubmit={handleSubmit}>
            <div className="input-group"><label>Produto</label><input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
            <div className="input-group"><label>Produtor</label><input required value={form.produtor} onChange={e => setForm({...form, produtor: e.target.value})} /></div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="input-group"><label>Preço (R$)</label><input required type="number" step="0.01" value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} /></div>
              <div className="input-group"><label>Categoria</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                  <option>Legumes</option><option>Verduras</option><option>Frutas</option><option>Outros</option>
                </select>
              </div>
            </div>
            
            {/* NOVO: SIMULAÇÃO DE GESTÃO DE MÍDIA (UX PROFISSIONAL) */}
            <div className="input-group">
                <label>URL da Foto (Simulação de Gestão de Mídia)</label>
                <div style={{border: '1px dashed #ccc', padding: '15px', borderRadius: '8px'}}>
                    <p style={{fontSize: '0.9rem', margin: 0, color: '#7f8c8d'}}>
                        Cole a URL da Imagem final. Em produção, este seria o **Botão de Upload** para o AWS S3.
                    </p>
                    <input 
                        required 
                        placeholder="https://sua-imagem-hospedada.com/..." 
                        value={form.imagem} 
                        onChange={e => setForm({...form, imagem: e.target.value})} 
                        style={{marginTop: '10px'}}
                    />
                </div>
            </div>
            
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1, justifyContent: 'center'}}>
                    <Save size={20} /> {form.id ? 'Salvar Edição' : 'Publicar Produto'}
                </button>
                {form.id && (
                    <button type="button" className="btn btn-outline" onClick={() => setForm(INITIAL_FORM)}>
                        Cancelar Edição
                    </button>
                )}
            </div>
        </form>
      </div>

      <h3>Catálogo Atual ({produtos.length})</h3>
      {loading ? (<p>Carregando catálogo...</p>) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {produtos.map(p => (
                <div key={p.id} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px'}}>
                    <div style={{fontWeight: 'bold', flex: 1}}>{p.nome}</div>
                    <div style={{fontSize: '0.9rem', width: '150px'}}>{p.produtor}</div>
                    <div style={{width: '80px', textAlign: 'right', fontWeight: 'bold'}}>R$ {Number(p.preco).toFixed(2)}</div>
                    
                    <button onClick={() => handleEdit(p)} className="btn btn-outline" style={{marginLeft: '15px', padding: '5px 10px'}}>
                        <Edit size={16}/> Editar
                    </button>
                    <button onClick={() => handleDelete(p.id, p.nome)} 
                            style={{marginLeft: '5px', padding: '5px 10px', background: '#e74c3c', color: 'white'}} 
                            className="btn">
                        <Trash2 size={16}/> Excluir
                    </button>
                </div>
            ))}
        </div>
      )}
    </>
  );

  const renderGestao = () => (
    <div className="card" style={{padding: '30px'}}>
      <h2 style={{color: '#2980b9', marginTop: 0}}><Package size={24}/> Gestão de Pedidos (Logística)</h2>
      <p>Visão de Roteirização e Status de Coleta.</p>
      {PEDIDOS_MOCK.map(pedido => (
        <div key={pedido.id} className="card" style={{marginBottom: '10px', padding: '15px', borderLeft: `5px solid ${STATUS_MAP[pedido.status].color}`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <strong style={{fontSize: '1.1rem'}}>Pedido #{pedido.id}</strong> - {pedido.produto}
                    <p style={{margin: '5px 0 0 0', fontSize: '0.9rem'}}>Destino: {pedido.consumidor}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                    <span style={{color: STATUS_MAP[pedido.status].color, fontWeight: 'bold'}}>{STATUS_MAP[pedido.status].text}</span>
                    <p style={{margin: '5px 0 0 0', fontSize: '0.8rem'}}>R$ {pedido.total.toFixed(2)}</p>
                </div>
            </div>
            {pedido.status === 'AGUARDANDO_PRODUTOR' && (
                 <button className="btn btn-primary" style={{marginTop: '10px', padding: '5px 10px', fontSize: '0.9rem'}}>
                    <Truck size={16}/> Marcar como "Pronto para Coleta"
                 </button>
            )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline"><ArrowLeft/> Dashboard</button>
        <span style={{fontWeight: 'bold'}}>Painel de {user.nome}</span>
        <button onClick={logout} className="btn" style={{background: '#c0392b', color: 'white'}}>
          Logout
        </button>
      </header>

      <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
        <button 
            className={`btn ${view === 'CADASTRO' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('CADASTRO')}
        >
            <Save/> Cadastro e Edição
        </button>
        <button 
            className={`btn ${view === 'GESTAO' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('GESTAO')}
        >
            <Truck/> Gerenciar Pedidos
        </button>
      </div>

      {view === 'CADASTRO' ? renderCadastro() : renderGestao()}
    </div>
  );
}