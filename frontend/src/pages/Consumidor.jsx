import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, MapPin, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import HeroBanner from '../components/HeroBanner'; // Banner Promocional

const URL_API = 'http://localhost:3000/produtos';
const URL_ORDERS = 'http://localhost:3000/orders';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300/f0f0f0/6e6e6e?text=No+Photo';

export default function Consumidor() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);

  // FUNÇÃO DE FALLBACK PARA IMAGEM
  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
  };

  // Lógica de Carrinho
  const adicionarAoCarrinho = (produto) => {
    if (!isAuthenticated) {
        alert("Faça login para adicionar produtos ao seu carrinho!");
        navigate('/login');
        return;
    }

    setCarrinho((prev) => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        return prev.map(item => 
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const atualizarQuantidade = (id, delta) => {
    setCarrinho(prev => {
        const novoCarrinho = prev.map(item => 
            item.id === id ? { ...item, quantidade: item.quantidade + delta } : item
        ).filter(item => item.quantidade > 0);
        return novoCarrinho;
    });
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };


  // Submissão do Pedido (Conecta ao POST /orders)
  const handleSubmitOrder = async () => {
      if (carrinho.length === 0) {
          alert("Seu carrinho está vazio!");
          return;
      }
      
      const itensAPI = carrinho.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade,
          preco_unitario: Number(item.preco) 
      }));

      const dadosPedido = {
          consumidor_id: user ? user.id : 1, 
          endereco_entrega_id: 1, 
          itens: itensAPI
      };
      
      try {
          const response = await fetch(URL_ORDERS, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dadosPedido)
          });

          if (response.ok) {
              alert('✅ Pedido realizado e salvo no banco de dados! Aguardando pagamento.');
              setCarrinho([]); 
              navigate('/dashboard'); 
          } else {
              const data = await response.json();
              alert(`Erro ao finalizar pedido: ${data.error || 'Verifique o console.'}`);
          }
      } catch (error) {
          console.error("Erro na submissão do pedido:", error);
          alert("Erro de conexão com o servidor de pedidos.");
      }
  };


  // Fetch de Produtos
  useEffect(() => {
    fetch(URL_API)
      .then(res => res.json())
      .then(data => {
        setProdutos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const total = carrinho.reduce((acc, item) => acc + (Number(item.preco) * item.quantidade), 0);
  
  // Renderização do Carrinho
  const renderCarrinho = () => (
    <div className="card" style={{width: '300px', position: 'sticky', top: '20px', border: '2px solid #e67e22'}}>
      <h2 style={{marginTop: 0, color: '#e67e22'}}><ShoppingCart size={24}/> Meu Pedido</h2>
      
      {carrinho.length === 0 ? (
        <p style={{color: '#95a5a6', textAlign: 'center'}}>Carrinho vazio.</p>
      ) : (
        <>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', marginBottom: '15px'}}>
            {carrinho.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 'bold'}}>{item.nome}</div>
                  <div style={{fontSize: '0.8rem', color: '#7f8c8d'}}>
                    R$ {Number(item.preco).toFixed(2)} / und.
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <button onClick={() => atualizarQuantidade(item.id, -1)} className="btn" style={{padding: '5px', background: '#f5f5f5'}}><Minus size={14}/></button>
                    <span style={{fontWeight: 'bold'}}>{item.quantidade}</span>
                    <button onClick={() => atualizarQuantidade(item.id, 1)} className="btn btn-primary" style={{padding: '5px'}}><Plus size={14}/></button>
                </div>
                <button onClick={() => removerDoCarrinho(item.id)} style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', marginLeft: '10px'}}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          
          <div style={{marginTop: '10px', borderTop: '2px dashed #bdc3c7', paddingTop: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold'}}>
              <span>Total:</span>
              <span style={{color: '#2ecc71'}}>R$ {total.toFixed(2)}</span>
            </div>
            <button 
                className="btn btn-secondary" 
                style={{width: '100%', justifyContent: 'center', marginTop: '15px'}}
                onClick={handleSubmitOrder}
            >
              Finalizar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
  

  return (
    <div className="container">
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0'}}>
        <h2 style={{margin: 0, color: '#2c3e50'}}>Vitrine de Produtos 🍎</h2>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center', color: '#7f8c8d'}}>
          <MapPin size={18} /> Entregar em: <strong>Cotia - SP</strong>
        </div>
      </header>

      <HeroBanner /> 

      <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
        
        {/* GRID DE PRODUTOS */}
        <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px'}}>
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            produtos.map(prod => (
              <div key={prod.id} className="product-card">
                {/* CORREÇÃO ESTRUTURAL DA IMAGEM PARA EVITAR COLAPSO */}
                <div style={{overflow: 'hidden', flexShrink: 0, height: '200px'}}> 
                  <img 
                    src={prod.imagem} 
                    alt={prod.nome} 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                    onError={handleImageError} // <-- TRATAMENTO DE ERRO
                  />
                </div>
                <div style={{padding: '15px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <span style={{background: '#e8f5e9', color: '#2ecc71', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>{prod.produtor}</span>
                  <h3 style={{margin: '10px 0', fontSize: '1.1rem'}}>{prod.nome}</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                    <span style={{fontSize: '1.4rem', fontWeight: 'bold', color: '#2c3e50'}}>R$ {Number(prod.preco).toFixed(2)}</span>
                  </div>
                  <button className="btn btn-secondary" style={{marginTop: '15px', width: '100%', justifyContent: 'center'}} onClick={() => adicionarAoCarrinho(prod)}>
                    <ShoppingCart size={16} style={{marginRight: '5px'}}/> Adicionar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CARRINHO LATERAL */}
        {renderCarrinho()}

      </div>
    </div>
  );
}