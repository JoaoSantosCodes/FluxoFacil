# Configuração do Repositório GitHub - FluxoFácil

##1. Instalar o Git

### Opção A: Download direto
1. Acesse: https://git-scm.com/download/win
2 Baixe e instale o Git para Windows3 Durante a instalação, use as configurações padrão

### Opção B: Via Chocolatey (se tiver instalado)
```powershell
choco install git
```

### Opção C: Via Winget (Windows 10/11```powershell
winget install --id Git.Git -e --source winget
```

## 2. Configurar o Git (após instalação)

Abra o PowerShell e execute:

```powershell
# Configurar nome e email
git config --global user.name JoaoSantosCodes"
git config --global user.email seu-email@exemplo.com"

# Verificar instalação
git --version
```

## 3. Inicializar o Repositório

No diretório do projeto (D:\Cursor\Projetos\APP-2xecute:

```powershell
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: FluxoFácil - App de Gestão Financeira"

# Adicionar o repositório remoto
git remote add origin https://github.com/JoaoSantosCodes/FluxoFacil.git

# Fazer push para o GitHub
git branch -M main
git push -u origin main
```

## 4. Estrutura do Projeto

O projeto FluxoFácil inclui:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + SQLite
- **Funcionalidades**: Dashboard, Contas, Recebidos, Transações
- **Design**: Tema escuro/claro, logo personalizado, interface responsiva

##5cripts Disponíveis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar backend
npm run server
```

## 6quivos Importantes

- `src/App.tsx` - Componente principal
- `src/components/` - Componentes React
- `database/` - Backend e banco de dados
- `src/contexts/` - Contextos React
- `Favicon.svg` - Favicon personalizado
- `src/components/Logo.tsx` - Logo do app

## 7 Próximos Passos

1. Instalar o Git
2. Executar os comandos de configuração
3 Fazer push para o GitHub
4. Configurar GitHub Pages (opcional)5dicionar descrição e tags no repositório

##8. Comandos Úteis

```powershell
# Verificar status
git status

# Ver histórico de commits
git log --oneline

# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Atualizar repositório
git pull origin main
``` 