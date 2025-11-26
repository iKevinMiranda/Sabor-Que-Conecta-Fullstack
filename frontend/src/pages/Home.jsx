import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tractor } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80) no-repeat center/cover', color: 'white'}}>
      <h1 style={{fontSize: '4rem', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Sabor que Conecta 🌿</h1>
      <p style={{fontSize: '1.5rem', marginTop: '10px'}}>Do campo direto para a sua mesa.</p>
      
      <div style={{display: 'flex', gap: '30px', marginTop: '50px'}}>
        {/* AGORA LEVA PARA O LOGIN - Consumidor e Produtor usam a mesma tela de login */}
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{padding: '20px 40px', fontSize: '1.2rem', background: '#e67e22'}}>
          <ShoppingBag size={24} /> Sou Consumidor
        </button>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{padding: '20px 40px', fontSize: '1.2rem'}}>
          <Tractor size={24} /> Sou Produtor
        </button>
      </div>
    </div>
  );
}