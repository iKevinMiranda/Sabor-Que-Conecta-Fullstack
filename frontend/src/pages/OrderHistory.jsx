import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { ArrowLeft, Clock, Package, DollarSign, ListOrdered } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

const URL_API = 'http://localhost:3000/orders/';

export default function OrderHistory() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }
    
    // NOTA: user.id é passado pelo AuthContext, tornando a API segura
    const userId = user.id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${URL_API}${userId}`);
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
                alert("Não foi possível carregar o histórico de pedidos.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);


    const getStatusColor = (status) => {
        switch (status) {
            case 'AGUARDANDO_PAGAMENTO': return '#e67e22'; // Laranja
            case 'AGUARDANDO_PRODUTOR': return '#f1c40f'; // Amarelo
            case 'EM_ROTA_ENTREGA': return '#3498db';     // Azul
            case 'ENTREGUE': return '#27ae60';             // Verde
            default: return '#7f8c8d';
        }
    };

    if (loading) {
        return <div className="container" style={{textAlign: 'center', marginTop: '50px'}}>Carregando histórico...</div>;
    }

    return (
        <div className="container" style={{maxWidth: '900px'}}>
            <header style={{marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '15px'}}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline"><ArrowLeft/> Dashboard</button>
                <h1 style={{color: '#2c3e50', marginTop: '10px'}}><ListOrdered/> Histórico de Pedidos</h1>
            </header>
            
            {pedidos.length === 0 ? (
                <p style={{textAlign: 'center', padding: '50px', border: '1px dashed #ccc'}}>Você ainda não realizou nenhum pedido.</p>
            ) : (
                pedidos.map(pedido => (
                    <div key={pedido.id} className="card" style={{marginBottom: '25px', borderLeft: `5px solid ${getStatusColor(pedido.status)}`, padding: '20px'}}>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3 style={{margin: '0', color: '#333'}}>Pedido #{pedido.id}</h3>
                            <span style={{fontWeight: 'bold', color: getStatusColor(pedido.status)}}>
                                <Package size={16} style={{verticalAlign: 'sub'}}/> {pedido.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '15px'}}>
                            <span><Clock size={14} style={{verticalAlign: 'sub'}}/> Data: {new Date(pedido.data_pedido).toLocaleDateString()}</span>
                            <span><DollarSign size={14} style={{verticalAlign: 'sub'}}/> Total: R$ {Number(pedido.valor_total).toFixed(2)}</span>
                        </div>
                        
                        <h4 style={{fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#555'}}>Itens:</h4>
                        
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {pedido.itens.map((item, index) => (
                                <li key={index} style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0'}}>
                                    <span>{item.quantidade}x {item.produto_nome}</span>
                                    <span style={{fontSize: '0.9rem', color: '#555'}}>Vendido por: {item.produtor}</span>
                                </li>
                            ))}
                        </ul>

                    </div>
                ))
            )}
        </div>
    );
}