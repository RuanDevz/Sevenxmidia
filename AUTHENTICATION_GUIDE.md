# Sistema de Autenticação com JWT

## 📋 Overview

Este sistema implementa autenticação segura com JWT (JSON Web Tokens) no frontend e backend, incluindo:

- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Geração de tokens JWT
- ✅ Renovação de tokens
- ✅ Verificação de autenticação
- ✅ Logout
- ✅ Proteção de rotas

---

## 🔧 Configuração do Backend

### Variáveis de Ambiente Necessárias

```env
TOKEN_VERIFY_ACCESS=sua_chave_secreta_aqui
POSTGRES_URL=sua_url_do_banco_de_dados
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Endpoints de Autenticação

#### POST `/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Senha@123",
  "confirmPassword": "Senha@123"
}
```

**Response (201):**
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "isVip": false,
    "isAdmin": false
  }
}
```

#### POST `/auth/login`
Faz login do usuário.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "Senha@123"
}
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "isVip": false,
    "isAdmin": false
  }
}
```

#### GET `/auth/verify`
Verifica se o token é válido.

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Token válido",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "isVip": false,
    "isAdmin": false,
    "lastLogin": "2024-12-29T10:30:00Z"
  }
}
```

#### POST `/auth/refresh`
Renova o token JWT.

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Token renovado com sucesso",
  "token": "eyJhbGc..."
}
```

#### POST `/auth/logout`
Realiza o logout do usuário.

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🎨 Uso no Frontend

### 1. Hook useAuth

Importe e use o hook em seus componentes:

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, token, loading, error, isAuthenticated, login, register, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login('email@example.com', 'Senha@123');
    if (result.success) {
      // Fazer algo após login bem-sucedido
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bem-vindo, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Context de Autenticação (Opcional)

Use o `AuthProvider` para disponibilizar autenticação em toda a app:

```javascript
// App.js
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Seu app aqui */}
    </AuthProvider>
  );
}
```

Acesse em qualquer componente:
```javascript
import { useAuthContext } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuthContext();
  // ...
}
```

### 3. Proteger Rotas

Use o componente `ProtectedRoute` para rotas que exigem autenticação:

```javascript
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardPage from '../pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

---

## 🔐 Requisitos de Senha

A senha deve atender aos seguintes requisitos:

- ✅ Mínimo 8 caracteres
- ✅ Pelo menos uma letra maiúscula
- ✅ Pelo menos uma letra minúscula
- ✅ Pelo menos um número
- ✅ Pelo menos um caractere especial (!@#$%^&*)

---

## 📁 Estrutura de Arquivos

```
frontend/src/
├── hooks/
│   ├── use-toast.js
│   └── useAuth.js                 # Hook de autenticação
├── pages/
│   ├── LoginPage.js              # Página de login
│   ├── RegisterPage.js           # Página de registro
│   └── ...
├── components/
│   ├── ProtectedRoute.js         # Componente para rotas protegidas
│   └── ...
├── contexts/
│   └── AuthContext.js            # Context de autenticação
├── config/
│   └── api.js                    # Configuração da API
└── App.js

backend/
├── middleware/
│   └── auth.js                   # Middleware de autenticação JWT
├── routes/
│   ├── auth.js                   # Rotas de autenticação
│   └── ...
└── index.js
```

---

## 🛡️ Segurança

### Práticas Implementadas

1. **Senha com Hash**: Senhas são armazenadas com hash bcrypt (salt: 12 rodadas)
2. **JWT**: Tokens JWT com expiração de 24h
3. **Validações**: Email, senha e nome validados no servidor
4. **Sanitização**: Strings sanitizadas para evitar XSS
5. **Mensagens Genéricas**: Erros não revelam se usuário existe (evita enumeração)
6. **HTTPS**: Recomendado usar HTTPS em produção
7. **CORS**: Configurado para aceitar apenas origem do frontend

### Recomendações de Segurança Adicionais

- ⚠️ Use HTTPS em produção
- ⚠️ Implemente rate limiting nas rotas de autenticação
- ⚠️ Use cookies HttpOnly para armazenar tokens (mais seguro que localStorage)
- ⚠️ Implemente refresh token rotation
- ⚠️ Configure CSP (Content Security Policy) headers
- ⚠️ Implemente verificação de email após registro

---

## 🚀 Exemplo Completo

### Página de Login

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}

export default LoginPage;
```

---

## 🐛 Troubleshooting

### Token não persiste após recarregar página

O token é armazenado em `localStorage`. Verifique se:
- ✅ O navegador permite localStorage
- ✅ O token é válido
- ✅ O middleware `authMiddleware` está funcionando

### Erro "Token expired"

O token expira após 24h. Implemente renovação automática ou chame `/auth/refresh`.

### CORS Error

Verifique se `FRONTEND_URL` está configurada corretamente no `.env` do backend.

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue no repositório.

