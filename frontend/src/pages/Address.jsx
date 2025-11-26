import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin } from 'lucide-react';

const URL_ADDRESS = 'sabor-que-conecta-fullstack-production.up.railway.app/address';

export default function Address() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cep: '', rua: '', numero: '', complemento: '', cidade: '', estado: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch(URL_ADDRESS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        
        if (response.ok) {
            alert('Endereço salvo! Você será redirecionado para a vitrine.');
            navigate('/consumidor'); 
        } else {
            alert('Erro ao salvar endereço. Tente novamente.');
        }

    } catch (error) {
        alert('Erro de conexão com a API.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '50px' }}>
      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ color: '#2980b9', marginTop: 0 }}>
          <MapPin size={24} style={{marginRight: '10px'}}/> Cadastro de Endereço
        </h2>
        <p>Informe seu endereço para o cálculo de frete e roteirização.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '15px'}}>
            <div className="input-group"><label>CEP</label><input required placeholder="00000-000" value={form.cep} onChange={e => setForm({...form, cep: e.target.value})} /></div>
            <div className="input-group"><label>Rua</label><input required placeholder="Ex: Av. Brasil" value={form.rua} onChange={e => setForm({...form, rua: e.target.value})} /></div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
            <div className="input-group"><label>Número</label><input required placeholder="Ex: 123" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} /></div>
            <div className="input-group"><label>Complemento</label><input placeholder="Ex: Bloco A" value={form.complemento} onChange={e => setForm({...form, complemento: e.target.value})} /></div>
            <div className="input-group"><label>Estado</label><input required placeholder="Ex: SP" value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} /></div>
          </div>
          <div className="input-group"><label>Cidade</label><input required placeholder="Ex: Cotia" value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})} /></div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '15px'}} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Endereço e Continuar'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <button onClick={() => navigate('/consumidor')} className="btn btn-outline"><Home size={16} /> Ir para a Vitrine</button>
        </p>
      </div>
    </div>
  );
}