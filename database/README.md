# 📊 Banco de Dados SQLite - App Contas Mensais

Este diretório contém a implementação do banco de dados SQLite para o app de contas mensais.

## 🗄️ Estrutura do Banco

### Tabela: `contas`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INTEGER | Chave primária (auto-incremento) |
| `status` | TEXT | Status da conta: 'PENDENTE', 'PAGO', 'VENCIDO' |
| `fornecedor` | TEXT | Nome do fornecedor/serviço |
| `valor` | REAL | Valor da conta |
| `data_vencimento` | TEXT | Data de vencimento (YYYY-MM-DD) |
| `parcelas` | INTEGER | Número de parcelas (padrão: 1) |
| `data_criacao` | TEXT | Data de criação (auto) |
| `data_atualizacao` | TEXT | Data da última atualização (auto) |

## 📁 Arquivos

### `database.ts`
- Configuração principal do banco de dados
- Classe `DatabaseManager` com métodos CRUD
- Interface `Conta` para tipagem TypeScript

### `utils.ts`
- Funções utilitárias para formatação e validação
- Cálculos de status, datas e valores
- Geração de relatórios

### `test.ts`
- Testes do banco de dados
- Exemplos de uso de todas as funcionalidades

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar Testes
```bash
# Executar testes básicos
npm run test:db

# Executar testes completos
npm run test:db:run
```

### 3. Usar no Código
```typescript
import database, { Conta } from './database/database';
import { formatCurrency, getStatusConta } from './database/utils';

// Inserir nova conta
const novaConta: Omit<Conta, 'id' | 'data_criacao' | 'data_atualizacao'> = {
  status: 'PENDENTE',
  fornecedor: 'Energia Elétrica',
  valor: 150.00,
  data_vencimento: '2024-01-15',
  parcelas: 1
};

const id = database.insertConta(novaConta);

// Buscar todas as contas
const contas = database.getAllContas();

// Buscar contas por status
const contasPendentes = database.getContasByStatus('PENDENTE');

// Atualizar conta
database.updateConta(id, { status: 'PAGO' });

// Deletar conta
database.deleteConta(id);
```

## 🔧 Funcionalidades

### Métodos Principais
- `insertConta()` - Inserir nova conta
- `getAllContas()` - Buscar todas as contas
- `getContasByStatus()` - Buscar por status
- `getContasByFornecedor()` - Buscar por fornecedor
- `getContasVencidas()` - Buscar contas vencidas
- `getContasMesAtual()` - Buscar contas do mês atual
- `updateConta()` - Atualizar conta
- `deleteConta()` - Deletar conta
- `getContaById()` - Buscar conta por ID
- `getEstatisticas()` - Gerar estatísticas

### Utilitários
- `formatCurrency()` - Formatar valores monetários
- `formatDate()` - Formatar datas
- `getStatusConta()` - Calcular status baseado na data
- `isContaVencida()` - Verificar se conta está vencida
- `validarConta()` - Validar dados da conta
- `gerarRelatorio()` - Gerar relatório completo

## 📊 Índices Criados

Para melhor performance, foram criados os seguintes índices:
- `idx_contas_status` - Status das contas
- `idx_contas_fornecedor` - Fornecedor
- `idx_contas_data_vencimento` - Data de vencimento
- `idx_contas_data_criacao` - Data de criação

## 🔒 Validações

- Status deve ser: 'PENDENTE', 'PAGO' ou 'VENCIDO'
- Valor deve ser maior que zero
- Data de vencimento deve ser válida
- Parcelas deve ser pelo menos 1
- Fornecedor é obrigatório

## 📈 Estatísticas Disponíveis

- Total de contas
- Contas pendentes
- Contas pagas
- Contas vencidas
- Valor total pendente
- Valor total pago

## 🎯 Exemplos de Uso

### Buscar Contas Vencidas
```typescript
const contasVencidas = database.getContasVencidas();
contasVencidas.forEach(conta => {
  console.log(`${conta.fornecedor} - ${formatCurrency(conta.valor)}`);
});
```

### Gerar Relatório
```typescript
import { gerarRelatorio } from './database/utils';

const contas = database.getAllContas();
const relatorio = gerarRelatorio(contas);
console.log(`Total: ${relatorio.total} contas`);
console.log(`Valor pendente: ${formatCurrency(relatorio.valorPendente)}`);
```

### Atualizar Status de Contas Vencidas
```typescript
import { getStatusConta } from './database/utils';

const contas = database.getAllContas();
contas.forEach(conta => {
  const novoStatus = getStatusConta(conta);
  if (novoStatus !== conta.status) {
    database.updateConta(conta.id!, { status: novoStatus });
  }
});
```

## 🔧 Configuração

O banco de dados é criado automaticamente no primeiro uso. O arquivo será salvo em:
```
database/contas.db
```

## 📝 Notas

- O banco usa `better-sqlite3` para melhor performance
- Todas as datas são armazenadas no formato ISO (YYYY-MM-DD)
- Timestamps são criados automaticamente
- O banco é thread-safe e pode ser usado em aplicações concorrentes 