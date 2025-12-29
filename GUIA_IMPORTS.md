# 📦 Guia de Imports - Sistema de Autenticação

Use este guia para saber exatamente o que importar em seus componentes.

---

## 🎣 Hooks

### Usar autenticação em um componente
```javascript
import useAuth from '../hooks/useAuth';

// Dentro do componente:
const { user, token, loading, error, isAuthenticated, login, register, logout, refreshToken } = useAuth();
```

---

## 🎨 Componentes

### Proteger uma rota
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

// Dentro do App.js:
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Menu de usuário na navbar
```javascript
import UserMenu from '../components/UserMenu';

// Dentro da Navbar:
<nav>
  <div>Logo</div>
  <UserMenu />
</nav>
```

---

## 🔄 Contexto (Alternativa ao Hook)

### Disponibilizar autenticação globalmente
```javascript
import { AuthProvider } from './contexts/AuthContext';

// Em App.js:
function App() {
  return (
    <AuthProvider>
      {/* Seu app aqui */}
    </AuthProvider>
  );
}
```

### Usar em qualquer componente
```javascript
import { useAuthContext } from '../contexts/AuthContext';

// Dentro do componente:
const { user, isAuthenticated } = useAuthContext();
```

---

## 🌐 API Client

### Fazer requisições autenticadas
```javascript
import apiClient from '../services/api';

// Fazer GET
const result = await apiClient.get('/user/status');
if (result.success) {
  console.log(result.data);
}

// Fazer POST
const result = await apiClient.post('/some/endpoint', { data: 'value' });

// Fazer PUT
const result = await apiClient.put('/some/endpoint', { updated: 'data' });

// Fazer DELETE
const result = await apiClient.delete('/some/endpoint');
```

---

## ⚙️ Configuração da API

### Acessar URLs dos endpoints
```javascript
import API_CONFIG from '../config/api';

// Endpoints
const registerUrl = API_CONFIG.ENDPOINTS.AUTH.REGISTER;  // '/auth/register'
const loginUrl = API_CONFIG.ENDPOINTS.AUTH.LOGIN;        // '/auth/login'

// Base URL
const baseUrl = API_CONFIG.BASE_URL;  // 'http://localhost:3001'
```

---

## 📄 Páginas Principais

### Página de Login
```javascript
import LoginPage from '../pages/LoginPage';

// Em App.js:
<Route path="/login" element={<LoginPage />} />
```

### Página de Registro
```javascript
import RegisterPage from '../pages/RegisterPage';

// Em App.js:
<Route path="/register" element={<RegisterPage />} />
```

---

## 🎯 Exemplo Completo de Integração

```javascript
// pages/MyDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';

function MyDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user.name}!</p>
      <Button onClick={() => {
        logout();
        navigate('/');
      }}>
        Logout
      </Button>
    </div>
  );
}

export default MyDashboard;

// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyDashboard from './pages/MyDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MyDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🔗 Imports dos Componentes UI

Os componentes de UI que você já tem configurados:

```javascript
// Button
import { Button } from '../components/ui/button';

// Input
import { Input } from '../components/ui/input';

// Card
import { Card } from '../components/ui/card';

// Alert
import { Alert, AlertDescription } from '../components/ui/alert';

// DropdownMenu (para UserMenu)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

// Icons (lucide-react)
import { LogOut, Settings, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

// Toast (Sonner)
import { toast } from 'sonner';
```

---

## 📝 Ordem de Imports Recomendada

```javascript
// 1. React e React Router
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 2. Bibliotecas externas
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// 3. Hooks customizados
import useAuth from '../hooks/useAuth';

// 4. Contextos
import { useAuthContext } from '../contexts/AuthContext';

// 5. Componentes
import ProtectedRoute from '../components/ProtectedRoute';
import UserMenu from '../components/UserMenu';

// 6. Componentes UI
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

// 7. Ícones
import { LogOut, Settings } from 'lucide-react';

// 8. Serviços e utilidades
import apiClient from '../services/api';
import API_CONFIG from '../config/api';

// 9. Estilos
import '../styles/MyComponent.css';
```

---

## 🚀 Checklist de Implementação

Ao implementar a autenticação em um novo componente:

- [ ] Importar `useAuth` ou `useAuthContext`
- [ ] Desestruturar `{ user, isAuthenticated, loading, error }`
- [ ] Verificar `isAuthenticated` antes de renderizar conteúdo protegido
- [ ] Importar `ProtectedRoute` se for uma rota protegida
- [ ] Importar `UserMenu` se for navbar/header
- [ ] Importar componentes UI necessários
- [ ] Importar `apiClient` se fizer requisições
- [ ] Tratar erros de autenticação
- [ ] Adicionar loading states
- [ ] Testar fluxo de login/logout

---

## 💡 Dicas

1. **Use sempre `useAuth` em vez de `useAuthContext`** para maior flexibilidade
2. **Coloque `AuthProvider` no topo se usar contexto** - no App.js ou index.js
3. **Sempre tratar o estado `loading`** para melhor UX
4. **Exibir `error`** ao usuário quando houver problema
5. **Redirecionar após login bem-sucedido** usando `useNavigate`
6. **Usar `ProtectedRoute` para rotas sensíveis** - redireciona automaticamente
7. **Verificar `isAuthenticated` antes de mostrar dados** do usuário

---

## 🔍 Verificação de Tipos (TypeScript - Opcional)

Se você migrar para TypeScript no futuro:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isVip: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<any>;
  logout: () => void;
  refreshToken: () => Promise<any>;
  verifyToken: () => Promise<void>;
}
```

---

**Última atualização**: 29 de Dezembro de 2025
