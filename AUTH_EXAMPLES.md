/**
 * EXEMPLO: Como integrar a autenticação em componentes existentes
 */

// ============================================
// EXEMPLO 1: Usar o hook useAuth em um componente
// ============================================

import React from 'react';
import useAuth from '../hooks/useAuth';
import { Button } from '../components/ui/button';

function ExampleComponent1() {
  const { user, isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <Button>Você não está logado. Faça login!</Button>;
  }

  return <div>Bem-vindo, {user.name}!</div>;
}

// ============================================
// EXEMPLO 2: Proteger rotas autenticadas
// ============================================

import ProtectedRoute from '../components/ProtectedRoute';
import MyDashboard from './MyDashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MyDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// ============================================
// EXEMPLO 3: Usar API client com autenticação
// ============================================

import apiClient from '../services/api';

async function fetchUserData() {
  const result = await apiClient.get('/user/status');
  
  if (result.success) {
    console.log('Dados do usuário:', result.data);
  } else {
    console.error('Erro:', result.error);
  }
}

// ============================================
// EXEMPLO 4: Integrar UserMenu na navbar
// ============================================

import UserMenu from '../components/UserMenu';

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <div className="logo">Logo</div>
      <UserMenu /> {/* Mostra login/register ou menu do usuário */}
    </nav>
  );
}

// ============================================
// EXEMPLO 5: Checkout apenas para usuários autenticados
// ============================================

import { useNavigate } from 'react-router-dom';

function PaymentPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCheckout = async () => {
    // Redirecionar para login se não autenticado
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Prosseguir com checkout
    // ...
  };

  return <Button onClick={handleCheckout}>Começar Pagamento</Button>;
}

// ============================================
// EXEMPLO 6: Monitorar mudanças de autenticação
// ============================================

import { useEffect } from 'react';

function AuthMonitor() {
  const { isAuthenticated, user, error } = useAuth();

  useEffect(() => {
    if (error) {
      console.error('Erro de autenticação:', error);
      // Fazer algo quando houver erro de autenticação
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuário logado:', user);
      // Fazer algo quando usuário se loga
    } else {
      console.log('Usuário deslogado');
      // Fazer algo quando usuário se desloga
    }
  }, [isAuthenticated, user]);

  return null;
}

// ============================================
// EXEMPLO 7: Renovar token antes de expirar
// ============================================

import { useEffect } from 'react';

function TokenRefresh() {
  const { refreshToken } = useAuth();

  useEffect(() => {
    // Renovar token a cada 12 horas (metade de 24h)
    const interval = setInterval(() => {
      refreshToken();
    }, 12 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  return null;
}

// ============================================
// EXEMPLO 8: Validação de email para pagamento
// ============================================

function CheckoutForm() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Por favor, faça login para continuar</p>;
  }

  return (
    <form>
      <input type="email" defaultValue={user.email} disabled />
      <input type="text" defaultValue={user.name} disabled />
      {/* Resto do formulário */}
    </form>
  );
}

// ============================================
// EXEMPLO 9: Context com AuthProvider
// ============================================

// Em App.js
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Sua app aqui */}
      <Routes>
        {/* Suas rotas */}
      </Routes>
    </AuthProvider>
  );
}

// Em qualquer componente
import { useAuthContext } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuthContext();
  return <div>Estado de autenticação: {isAuthenticated ? 'Logado' : 'Deslogado'}</div>;
}

// ============================================
// EXEMPLO 10: Tratamento de token expirado
// ============================================

function ApiWithRetry() {
  const { refreshToken, logout } = useAuth();

  async function requestWithRetry(endpoint, options = {}) {
    try {
      return await apiClient.get(endpoint, options);
    } catch (error) {
      if (error.status === 401) {
        // Tentar renovar token
        const refreshResult = await refreshToken();
        
        if (refreshResult.success) {
          // Tentar novamente
          return await apiClient.get(endpoint, options);
        } else {
          // Token não pode ser renovado, fazer logout
          logout();
          throw new Error('Sessão expirada. Faça login novamente.');
        }
      }
      throw error;
    }
  }

  return { requestWithRetry };
}

export {
  ExampleComponent1,
  AppRoutes,
  Navbar,
  PaymentPage,
  AuthMonitor,
  TokenRefresh,
  CheckoutForm,
  ApiWithRetry,
};
