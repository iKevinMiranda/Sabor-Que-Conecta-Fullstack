import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ShoppingCart, User, LogIn, LogOut, Tractor, Home, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={{ 
      background: 'white', 
      borderBottom: '1px solid #eee', 
      padding: '10px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'sticky', // Garante que fique fixo no topo
      top: 0,
      zIndex: 1000 // Fica acima dos outros elementos
    }}>
      {/* Lado Esquerdo: Logo/Home */}
      <Link to="/" style={{ textDecoration: 'none', color: '#27ae60', fontSize: '1.8rem', fontWeight: 'bold' }}>
        Sabor que Conecta
      </Link>

      {/* Lado Direito: Menu de Acesso/Usuário */}
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* Ícone do Carrinho (Sempre visível, leva para a vitrine) */}
        <Link to="/" style={{ color: '#e67e22', textDecoration: 'none', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
            <ShoppingCart size={20} style={{marginRight: '5px'}}/> Comprar
        </Link>
        
        {isAuthenticated ? (
          <>
            {/* Opção Pós-Login */}
            <Link to="/dashboard" style={{ color: '#2c3e50', textDecoration: 'none', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                <User size={20} style={{marginRight: '5px'}}/> Olá, {user.nome.split(' ')[0]}
            </Link>
            
            <button onClick={logout} className="btn" style={{ background: '#c0392b', color: 'white', padding: '8px 15px' }}>
              <LogOut size={16}/> Sair
            </button>
          </>
        ) : (
          <>
            {/* Opções Não Logado */}
            <Link to="/login" style={{ color: '#27ae60', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <LogIn size={18}/> Login
            </Link>
            <Link to="/register" style={{ color: '#27ae60', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <UserPlus size={18}/> Cadastrar
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}