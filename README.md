# SevenX Media - Premium Advertising Platform

Um site de publicidade moderno e profissional com integração Stripe para assinaturas premium.

![Light Theme](https://img.shields.io/badge/Theme-Light-blue)
![TailwindCSS](https://img.shields.io/badge/CSS-Tailwind-38B2AC)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)

## 🚀 Características

- ✨ Design minimalista e profissional (Light Theme)
- 💳 Integração completa com Stripe
- 📱 Totalmente responsivo
- 🎨 TailwindCSS + Framer Motion
- 📄 Páginas legais completas (Terms, Privacy, Refund)
- 🔒 Seguro e pronto para produção

## 💰 Planos de Assinatura

| Plano | Preço | Descrição |
|-------|-------|-----------|
| **Monthly Pass** | $12/mês | Acesso premium mensal |
| **Yearly Access** | $80/ano | Economize 45% |
| **Lifetime Founder** | $199.99 | Pagamento único, acesso vitalício |

## 📋 Pré-requisitos

- Python 3.11+
- Node.js 16+
- MongoDB
- Conta Stripe

## ⚙️ Configuração Rápida

### 1. Instalar Dependências

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
yarn install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env e adicione sua chave Stripe

# Frontend
cp frontend/.env.example frontend/.env
# Ajuste a URL do backend se necessário
```

### 3. Iniciar o Projeto

```bash
# Backend
cd backend
uvicorn server:app --reload

# Frontend (em outro terminal)
cd frontend
yarn start
```

Acesse: `http://localhost:3000`

## 🔑 Configurar Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copie sua **Secret Key** (começa com sk_test_ para teste)
3. Cole em `backend/.env`:
   ```
   STRIPE_API_KEY=SUA_CHAVE_AQUI
   ```

**Guia completo:** Veja `STRIPE_SETUP.md`

## 📁 Estrutura do Projeto

```
/app
├── backend/              # FastAPI + Python
│   ├── server.py        # API e integração Stripe
│   ├── .env.example     # Template de variáveis
│   └── requirements.txt
├── frontend/            # React + TailwindCSS
│   ├── src/
│   │   ├── pages/      # Páginas do site
│   │   └── components/ # Componentes reutilizáveis
│   ├── .env.example
│   └── package.json
└── .gitignore          # Protege arquivos sensíveis
```

## 🛡️ Segurança

- ✅ Arquivos `.env` protegidos pelo `.gitignore`
- ✅ Preços definidos no backend (sem manipulação)
- ✅ Validação de webhooks Stripe
- ✅ CORS configurado corretamente

## 📚 Documentação

- **`STRIPE_SETUP.md`** - Configurar pagamentos Stripe
- **`GIT_SETUP.md`** - Guia completo de Git/GitHub
- **`GITHUB_CHECKLIST.md`** - Checklist rápido antes de subir

## 🧪 Testar Pagamentos

Use o cartão de teste Stripe:
- Número: `4242 4242 4242 4242`
- Data: Qualquer data futura
- CVC: Qualquer 3 dígitos

## 🌐 Deploy em Produção

1. Configure variáveis de ambiente no servidor
2. Use chaves Stripe de produção (começam com sk_live_)
3. Configure webhook: `https://seu-dominio.com/api/webhook/stripe`
4. Atualize CORS e URLs no `.env`

## 📝 Tecnologias

### Frontend
- React 19
- TailwindCSS
- Framer Motion
- Shadcn UI
- React Router
- Axios

### Backend
- FastAPI
- Stripe Python SDK
- MongoDB (Motor)
- Pydantic
- Python-dotenv

## 🤝 Contribuindo

Este é um projeto privado, mas contribuições são bem-vindas!

## 📄 Licença

© 2024-2025 SevenX Media. Todos os direitos reservados.

## 📞 Suporte

Para dúvidas sobre:
- **Stripe**: Veja `STRIPE_SETUP.md`
- **Git/GitHub**: Veja `GIT_SETUP.md`
- **Problemas técnicos**: Verifique os logs em `/var/log/supervisor/`

---

**Feito com ❤️ usando TailwindCSS**
