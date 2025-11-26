import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ShoppingBag, Tractor, MapPin, UserCheck, ListOrdered } from 'lucide-react'; // <-- GARANTIR TODOS OS ÍCONES

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Proteção: Se não logou, vai para o login
  if (!isAuthenticated) {
      return <Navigate to="/login" replace />; 
  }
  
  // Lógica de visualização
  const isProdutor = user.tipo_usuario === 'produtor';
  const nomeCurto = user.nome.split(' ')[0];

  return (
    <div className="container" style={{maxWidth: '1000px'}}>
      <h1 style={{color: '#2c3e50'}}><UserCheck style={{verticalAlign: 'sub'}}/> Olá, {nomeCurto}!</h1>
      <p style={{color: '#7f8c8d'}}>Selecione sua próxima ação ou navegue pela vitrine.</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '30px'}}>

        {/* Card 1: Compras (Volta para a Vitrine Principal) */}
        <Link to="/" style={{textDecoration: 'none'}}>
            <div className="card" style={{padding: '30px', border: '1px solid #e67e22', cursor: 'pointer', background: '#fffaf5'}}>
                <ShoppingBag size={48} color="#e67e22"/>
                <h3 style={{color: '#e67e22'}}>Continuar Comprando</h3>
                <p>Volte para a vitrine e finalize seus pedidos.</p>
            </div>
        </Link>
        
        {/* Card 2: Painel do Produtor (Acesso Restrito) */}
        {isProdutor && (
            <Link to="/produtor" style={{textDecoration: 'none'}}>
                <div className="card" style={{padding: '30px', border: '1px solid #27ae60', cursor: 'pointer', background: '#f5fff8'}}>
                    <Tractor size={48} color="#27ae60"/>
                    <h3 style={{color: '#27ae60'}}>Painel de Gestão (Vendas)</h3>
                    <p>Cadastre novos produtos, edite e gerencie o catálogo.</p>
                </div>
            </Link>
        )}

        {/* Card 3: Histórico de Pedidos */}
        <Link to="/orders" style={{textDecoration: 'none'}}>
            <div className="card" style={{padding: '30px', border: '1px solid #3498db', cursor: 'pointer', background: '#f5fbff'}}>
                <ListOrdered size={48} color="#3498db"/>
                <h3 style={{color: '#3498db'}}>Ver Histórico de Pedidos</h3>
                <p>Acompanhe pedidos antigos e verifique status de entrega e roteirização.</p>
            </div>
        </Link>

        {/* Card 4: Cadastro de Endereço */}
        <Link to="/address" style={{textDecoration: 'none'}}>
            <div className="card" style={{padding: '30px', border: '1px solid #2980b9', cursor: 'pointer', background: '#f8faff'}}>
                <MapPin size={48} color="#2980b9"/>
                <h3 style={{color: '#2980b9'}}>Gerenciar Endereços</h3>
                <p>Atualize seus dados de entrega para a logística.</p>
            </div>
        </Link>

      </div>
    </div>
  );
}