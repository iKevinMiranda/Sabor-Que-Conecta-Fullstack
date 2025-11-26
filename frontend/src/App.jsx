import { Routes, Route } from 'react-router-dom';
import Consumidor from './pages/Consumidor'; // A Vitrine
import Produtor from './pages/Produtor';
import Register from './pages/Register';
import Login from './pages/Login';
import Address from './pages/Address';
import Navbar from './components/Navbar'; // <-- IMPORT DO NAVBAR
import Dashboard from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory'; // <-- IMPORT DA NOVA PÁGINA

export default function App() {
  return (
    <>
      <Navbar /> {/* <-- NAV BAR VAI AQUI */}
      <div style={{ paddingTop: '20px' }}>
        <Routes>
          {/* VITRINE É AGORA A HOME: / */}
          <Route path="/" element={<Consumidor />} />
          
          {/* Rotas de Autenticação/Menu */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          
          {/* Rotas de Gestão */}
          <Route path="/address" element={<Address />} />
          <Route path="/produtor" element={<Produtor />} />

          {/* Rotas de Conteúdo */}
          <Route path="/orders" element={<OrderHistory />} /> {/* <-- NOVA ROTA AQUI */}
          <Route path="/consumidor" element={<Consumidor />} />          
        </Routes>
      </div>
    </>
  )
}