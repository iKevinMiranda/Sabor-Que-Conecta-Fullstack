import { Package, MapPin, Truck } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div style={{
      // MUDANÇA: Fundo sólido com a cor primária escura para garantir o contraste
      background: '#219150', 
      minHeight: '320px',
      borderRadius: '15px',
      marginBottom: '40px', // Mais espaçamento abaixo
      padding: '50px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h1 style={{fontSize: '3.5rem', margin: 0, fontWeight: 600}}>
        Colheita Fresca, Entrega Direta.
      </h1>
      <p style={{fontSize: '1.4rem', marginTop: '10px', maxWidth: '750px'}}>
        Seu ponto de conexão com pequenos produtores rurais, garantindo produtos mais frescos e preços justos.
      </p>

      <div style={{marginTop: '30px', display: 'flex', gap: '40px', maxWidth: '800px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Truck size={28} color="white"/>
            <span style={{fontWeight: 'bold'}}>Logística Otimizada</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <MapPin size={28} color="#e67e22"/>
            <span style={{fontWeight: 'bold'}}>Rastreabilidade Total</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Package size={28} color="#3498db"/>
            <span style={{fontWeight: 'bold'}}>Zero Intermediários</span>
        </div>
      </div>
    </div>
  );
}