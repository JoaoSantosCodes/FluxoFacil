@echo off
REM ===============================
REM  App Contas Mensais - Inicialização Completa e Profissional
REM ===============================

title App Contas Mensais - Inicialização Completa

echo ==========================================
echo Deseja resetar o banco de dados com dados de teste? (S/N)
set /p RESETDB="[S/N]: "
echo ==========================================

if /I "%RESETDB%"=="S" (
    echo [1/5] Populando tabela CONTAS com dados de teste...
    node database/seed.cjs
    IF %ERRORLEVEL% NEQ 0 (
        echo ERRO ao rodar seed.cjs! Verifique o script e o banco.
        pause
        exit /b 1
    )
    echo [2/5] Populando tabela RECEBIDOS com dados de teste...
    node database/seed-recebidos.cjs
    IF %ERRORLEVEL% NEQ 0 (
        echo ERRO ao rodar seed-recebidos.cjs! Verifique o script e o banco.
        pause
        exit /b 1
    )
) else (
    echo Banco de dados mantido. Nenhum dado foi sobrescrito.
)

echo [3/5] Iniciando o backend (API)...
start "Backend API" cmd /k "node database/server.cjs"

echo [4/5] Aguardando backend subir...
timeout /t 3

echo [5/5] Iniciando o frontend (Vite)...
start "Frontend Vite" cmd /k "npm run dev"

echo ==========================================
echo Todos os sistemas foram iniciados!
echo Banco de dados preservado ou populado conforme sua escolha.
echo ==========================================
pause 