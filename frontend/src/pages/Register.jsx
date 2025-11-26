import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Check } from 'lucide-react';

const URL_REGISTER = 'sabor-que-conecta-fullstack-production.up.railway.app/register';

export default function Register() {
  const navigate = useNavigate();
  // Valor inicial agora define o tipo de usuário
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo_usuario: 'consumidor' }); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const response = await fetch(URL_REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        
        const data = await response.json();

        if (response.ok) {
            alert(`Registro de ${data.user.nome} concluído com sucesso! Faça o login.`);
            navigate('/login');
        } else {
            alert(`Erro no registro: ${data.error || 'Verifique o email ou senha.'}`);
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
        <h2 style={{ color: '#27ae60', marginTop: 0 }}>
          <UserPlus size={24} style={{marginRight: '10px'}}/> Registrar Usuário
        </h2>
        <p>Crie sua conta na plataforma Sabor que Conecta.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label><Check size={16} style={{marginRight: '5px', verticalAlign: 'middle'}}/> Nome</label>
            <input required placeholder="Seu nome completo" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          
          <div className="input-group">
            <label><Mail size={16} style={{marginRight: '5px', verticalAlign: 'middle'}}/> E-mail</label>
            <input required type="email" placeholder="seuemail@fatec.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          
          <div className="input-group">
            <label><Lock size={16} style={{marginRight: '5px', verticalAlign: 'middle'}}/> Senha</label>
            <input required type="password" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
          </div>

          {/* NOVO: SELETOR DE PAPEL */}
          <div className="input-group">
            <label><UserPlus size={16} style={{marginRight: '5px', verticalAlign: 'middle'}}/> Você é...</label>
            <select required value={form.tipo_usuario} onChange={e => setForm({...form, tipo_usuario: e.target.value})}>
              <option value="consumidor">Comprador (Consumidor)</option>
              <option value="produtor">Vendedor (Produtor/Sítio)</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '15px'}} disabled={loading}>
            {loading ? 'Processando...' : 'Cadastrar Conta'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Já tem conta? <Link to="/login" style={{color: '#e67e22', textDecoration: 'none'}}>Faça Login</Link>
        </p>
      </div>
    </div>
  );
}