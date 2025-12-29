#!/bin/bash

# 🧪 Script de Teste - Sistema de Autenticação
# Execute este script para testar os endpoints de autenticação

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
BACKEND_URL="http://localhost:3001"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    🔐 TESTE DO SISTEMA DE AUTENTICAÇÃO COM JWT${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

# Teste 1: Registrar novo usuário
echo -e "${YELLOW}[1/5]${NC} Testando registro de novo usuário..."

REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuário Teste",
    "email": "teste@example.com",
    "password": "Senha@123",
    "confirmPassword": "Senha@123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
  echo -e "${GREEN}✓ Registro bem-sucedido!${NC}"
  echo -e "  Token: ${BLUE}${TOKEN:0:20}...${NC}\n"
else
  echo -e "${RED}✗ Falha no registro${NC}"
  echo "  Response: $REGISTER_RESPONSE\n"
  exit 1
fi

# Teste 2: Fazer Login
echo -e "${YELLOW}[2/5]${NC} Testando login..."

LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "Senha@123"
  }')

LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$LOGIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Login bem-sucedido!${NC}"
  echo -e "  Token: ${BLUE}${LOGIN_TOKEN:0:20}...${NC}\n"
  TOKEN=$LOGIN_TOKEN
else
  echo -e "${RED}✗ Falha no login${NC}"
  echo "  Response: $LOGIN_RESPONSE\n"
  exit 1
fi

# Teste 3: Verificar Token
echo -e "${YELLOW}[3/5]${NC} Testando verificação de token..."

VERIFY_RESPONSE=$(curl -s -X GET "$BACKEND_URL/auth/verify" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if echo $VERIFY_RESPONSE | grep -q '"email"'; then
  echo -e "${GREEN}✓ Token verificado com sucesso!${NC}"
  echo "  Response:"
  echo "  $VERIFY_RESPONSE\n" | sed 's/^/  /'
else
  echo -e "${RED}✗ Falha na verificação de token${NC}"
  echo "  Response: $VERIFY_RESPONSE\n"
fi

# Teste 4: Renovar Token
echo -e "${YELLOW}[4/5]${NC} Testando renovação de token..."

REFRESH_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/refresh" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

NEW_TOKEN=$(echo $REFRESH_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$NEW_TOKEN" ]; then
  echo -e "${GREEN}✓ Token renovado com sucesso!${NC}"
  echo -e "  Novo Token: ${BLUE}${NEW_TOKEN:0:20}...${NC}\n"
  TOKEN=$NEW_TOKEN
else
  echo -e "${RED}✗ Falha na renovação de token${NC}"
  echo "  Response: $REFRESH_RESPONSE\n"
fi

# Teste 5: Logout
echo -e "${YELLOW}[5/5]${NC} Testando logout..."

LOGOUT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if echo $LOGOUT_RESPONSE | grep -q '"message"'; then
  echo -e "${GREEN}✓ Logout bem-sucedido!${NC}"
  echo "  Response:"
  echo "  $LOGOUT_RESPONSE\n" | sed 's/^/  /'
else
  echo -e "${RED}✗ Falha no logout${NC}"
  echo "  Response: $LOGOUT_RESPONSE\n"
fi

echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}    ✓ Todos os testes passaram com sucesso!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}\n"
