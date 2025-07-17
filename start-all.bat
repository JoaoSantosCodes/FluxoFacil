@echo off
REM ===============================
REM  FluxoFacil - Sistema de Gestao Financeira
REM  Inicializacao Completa com Sincronizacao Automatica
REM ===============================

title FluxoFacil - Sistema de Gestao Financeira

echo ==========================================
echo  FLUXOFACIL - SISTEMA DE GESTAO FINANCEIRA
echo ==========================================
echo.
echo  NOVAS FUNCIONALIDADES:
echo  • Sincronizacao automatica a cada5utos
echo  • Cache local para carregamento instantaneo
echo  • Persistencia robusta (SQLite + localStorage)
echo  • Funciona offline com dados em cache
echo  • Tratamento de erros inteligente
echo.
echo ==========================================
echo Deseja resetar o banco de dados com dados de teste? (S/N)
set /p RESETDB="[S/N]: "
echo ==========================================

if /I%RESETDB%==S (
    echo [1/6] Populando tabela CONTAS com dados de teste...
    node database/seed.cjs
    IF %ERRORLEVEL% NEQ 0 (
        echo ERRO ao rodar seed.cjs! Verifique o script e o banco.
        pause
        exit /b 1
    )
    echo [2/6] Populando tabela RECEBIDOS com dados de teste...
    node database/seed-recebidos.cjs
    IF %ERRORLEVEL% NEQ 0 (
        echo ERRO ao rodar seed-recebidos.cjs! Verifique o script e o banco.
        pause
        exit /b 1  )
    echo Dados de teste carregados com sucesso!
) else (
    echo Banco de dados mantido. Nenhum dado foi sobrescrito.
)

echo [3/6] Iniciando o backend (API SQLite)...
start "Backend API - FluxoFacil" cmd /k "node database/server.cjs"

echo [4/6] Aguardando backend subir...
timeout /t 3

echo [5/6] Iniciando o frontend (Vite + React)...
start "Frontend Vite - FluxoFacil" cmd /k "npm run dev"

echo [6/6] Configurando sincronizacao automatica...
echo.

echo ==========================================
echo  TODOS OS SISTEMAS INICIADOS COM SUCESSO!
echo ==========================================
echo.
echo  SISTEMA DE SINCRONIZACAO:
echo  • Dados carregados automaticamente do cache local
echo  • Sincronizacao com servidor em background
echo  • Atualizacao automatica a cada5utos
echo  • Cache persistente entre sessoes
echo.
echo  URLs DE ACESSO:
echo  • Frontend: http://localhost:5173cho  • Backend API: http://localhost:3333
echo.
echo  DICAS:
echo  • Os dados sao salvos automaticamente no banco SQLite
echo  • Cache local garante carregamento instantaneo
echo  • Funciona offline com dados em cache
echo  • Verifique o console para logs de sincronizacao
echo.
echo ==========================================
pause 