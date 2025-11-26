import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../AuthContext'; 

const URL_LOGIN = 'sabor-que-conecta-fullstack-production.up.railway.app/login';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(URL_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        
        const data = await response.json();

        if (response.ok) {
            alert(`Bem-vindo, ${data.user.nome}!`);
            login(data.user); 
            // Redireciona SEMPRE para a Dashboard de escolha após o login
            navigate('/dashboard'); 
        } else {
            alert(data.error || 'Erro: Usuário ou senha incorretos.');
        }

    } catch (error) {
        alert('Erro de conexão com a API.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', paddingTop: '50px' }}>
      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ color: '#e67e22', marginTop: 0 }}>
          <LogIn size={24} style={{marginRight: '10px'}}/> Acesso Restrito
        </h2>
        <p>Acesse seu painel como Produtor ou Consumidor.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><Mail size={16} style={{marginRight: '5px', verticalAlign: 'middle'}}/> E-mail</label>
            <input required type="email" placeholder="seuemail@fatec.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          
          <div className="input-group">
            <label><Lock size={16} style={{marginRight: '5px', verticalAlign: 'middle'}}/> Senha</label>
            <input required type="password" placeholder="Sua senha" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '15px'}} disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Não tem conta? <Link to="/register" style={{color: '#27ae60', textDecoration: 'none'}}>Registre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}