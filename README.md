# FluxoFácil

Um sistema completo para gerenciar fluxo financeiro, construído com React, TypeScript, Vite e SQLite.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Tema Escuro/Claro** - Interface adaptável com transições suaves
- **Banco de Dados SQLite** - Persistência local com API REST
- **Gestão de Contas** - CRUD completo para contas mensais
- **Status Inteligente** - PENDENTE, PAGO, VENCIDO com cálculo automático
- **Filtros e Busca** - Por status, fornecedor e data
- **Estatísticas** - Relatórios detalhados de gastos
- **Interface Responsiva** - Desktop e mobile
- **Loaders** - Componentes de carregamento
- **Validação** - Formulários com validação em tempo real

### 📊 Estrutura do Banco
- **STATUS** - PENDENTE, PAGO, VENCIDO
- **FORNECEDOR** - Nome do serviço
- **VALOR** - Valor da conta
- **DATA DE VENCIMENTO** - Data de vencimento
- **PARCELAS** - Número de parcelas

## 🛠️ Tecnologias

- **Frontend**: React18 TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **Estilização**: Tailwind CSS
- **Banco**: SQLite com better-sqlite3
- **Tema**: Context API com persistência
- **Animações**: Framer Motion

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd fluxofacil
```

2. **Instale as dependências**
```bash
npm install
```

3ute o app completo** (frontend + backend)
```bash
npm run dev:full
```

## 🎯 Como Usar

### Opções de Execução
1. **App Completo** (Recomendado)
```bash
npm run dev:full
```
- Frontend: http://localhost:31 Backend API: http://localhost:3333
2 **Apenas Frontend**
```bash
npm run dev
```3. **Apenas Backend**
```bash
npm run api
```

4. **Testes do Banco**
```bash
npm run test:db
```

### Navegação

- **Dashboard** - Visão geral e estatísticas
- **Consulta** - Consultas e relatórios
- **Recebidos** - Gestão de receitas
- **Contas** - Gestão de contas mensais
- **Transações** - Gestão de movimentações
- **Documentações** - Documentos e relatórios
- **Ajuda** - Suporte e tutoriais
- **Configurações** - Exportar dados e configurações

## 🗄️ API Endpoints

### Contas
- `GET /contas` - Listar todas as contas
- `GET /contas/:id` - Buscar conta específica
- `POST /contas` - Criar nova conta
- `PUT /contas/:id` - Atualizar conta
- `DELETE /contas/:id` - Deletar conta
- `GET /estatisticas` - Estatísticas gerais

### Exemplo de Uso da API
```typescript
// Criar conta
const novaConta =[object Object]  status: 'PENDENTE,
  fornecedor:Energia Elétrica,
  valor: 150
  data_vencimento: '202401-15  parcelas:1};

fetch(http://localhost:3333/contas',[object Object]  method: POST',
  headers:[object Object]Content-Type': application/json' },
  body: JSON.stringify(novaConta)
});
```

## 🎨 Tema Escuro

O app suporta tema escuro com:
- Detecção automática da preferência do sistema
- Toggle manual
- Persistência da escolha
- Transições suaves
- Cores adaptativas em todos os componentes

## 📱 Responsividade

- **Desktop**: Sidebar lateral com navegação completa
- **Mobile**: Menu hambúrguer expansível
- **Tablet**: Layout adaptativo
- **Touch**: Otimizado para interação touch

## 🔧 Desenvolvimento

### Estrutura de Arquivos
```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI
│   ├── ContasList.tsx  # Lista de contas
│   └── ContaForm.tsx   # Formulário de contas
├── contexts/           # Contextos React
│   ├── ThemeContext.tsx
│   └── ContasContext.tsx
├── services/           # Serviços
│   └── api.ts          # Cliente da API
├── types/              # Tipos TypeScript
│   └── contas.ts       # Tipos das contas
└── database/           # Backend
    ├── database.ts     # Configuração SQLite
    ├── api.ts          # API Express
    └── utils.ts        # Utilitários
```

### Scripts Disponíveis
- `npm run dev` - Frontend apenas
- `npm run api` - Backend apenas
- `npm run dev:full` - Frontend + Backend
- `npm run test:db` - Testes do banco
- `npm run build` - Build de produção

## 🚨 Troubleshooting

### Erro de Conexão com API1fique se o backend está rodando: `npm run api`
2. Confirme a porta 3333 está livre
3. Verifique o console do navegador para erros CORS

### Erro de Banco de Dados
1. Execute `npm run test:db` para verificar2erifique se o arquivo `database/contas.db` foi criado
3. Delete o arquivo `.db` para recriar o banco

### Problemas de Tema
1. Limpe o localStorage do navegador2rifique se o ThemeContext está funcionando
3. Recarregue a página

## 📈 Próximas Funcionalidades

- [ ] Gráficos e análises avançadas
- [ ] Exportação para PDF/Excel
- [ ] Backup automático
- [ ] Notificações de vencimento
-Categorização avançada
- ] Múltiplas moedas
- [ ] Relatórios personalizados

## 🤝 Contribuição

1. Fork o projeto
2ie uma branch para sua feature
3mmit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando React, TypeScript e SQLite** 