@echo off
REM 🧪 Script de Teste - Sistema de Autenticação (Windows)
REM Execute este arquivo .bat para testar os endpoints

setlocal enabledelayedexpansion

set BACKEND_URL=http://localhost:3001
set TOKEN=

echo.
echo ============================================================
echo     TESTE DO SISTEMA DE AUTENCAO COM JWT
echo ============================================================
echo.

REM Teste 1: Registrar novo usuário
echo [1/5] Testando registro de novo usuario...
echo.

curl -X POST "%BACKEND_URL%/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\""name\"":\"\"Usuario Teste\"\",\""email\"\":\"\"teste@example.com\"\",\""password\"\":\"\"Senha@123\"\",\""confirmPassword\"\":\"\"Senha@123\"\"}"

echo.
echo ============================================================
echo.

REM Teste 2: Fazer Login
echo [2/5] Testando login...
echo.

curl -X POST "%BACKEND_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\""email\"\":\"\"teste@example.com\"\",\""password\"\":\"\"Senha@123\"\"}"

echo.
echo ============================================================
echo.

REM Instrução para usuário
echo [!] Para continuar os testes, copie o token retornado acima
echo [!] e execute os comandos abaixo substituindo SEU_TOKEN_AQUI
echo.
echo === Teste 3: Verificar Token ===
curl -X GET "%BACKEND_URL%/auth/verify" ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI" ^
  -H "Content-Type: application/json"

echo.
echo === Teste 4: Renovar Token ===
curl -X POST "%BACKEND_URL%/auth/refresh" ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI" ^
  -H "Content-Type: application/json"

echo.
echo === Teste 5: Logout ===
curl -X POST "%BACKEND_URL%/auth/logout" ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI" ^
  -H "Content-Type: application/json"

echo.
echo ============================================================
echo     Testes concluidos!
echo ============================================================
echo.

pause
