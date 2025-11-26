import React, { useState, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Estado que armazena as informações do usuário logado
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  // Função mock para simular o login (receberia o objeto do usuário)
  const login = (userData) => {
    setUser(userData);
  };

  // Função de logout: Limpa o usuário e redireciona para a home
  const logout = () => {
    setUser(null);
    navigate('/');
  };

  // O valor que será disponibilizado para toda a aplicação
  const value = { user, login, logout, isAuthenticated: user !== null };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};