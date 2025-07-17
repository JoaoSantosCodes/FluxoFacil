# Checklist Profissional de Integração: Frontend ↔ Backend ↔ Banco

Este checklist serve para garantir a integração correta e rastreável entre todas as camadas do projeto (banco de dados, backend/API e frontend). Mantenha este documento atualizado conforme o projeto evolui.

---

## 1. Banco de Dados
- [ ] O banco está criado e acessível?
- [ ] As tabelas necessárias existem e estão populadas?
- [ ] Os scripts de seed funcionam e inserem dados de teste corretamente?
- [ ] O banco está sendo acessado pelo backend correto (caminho, permissões)?

## 2. Backend/API
- [ ] O backend está rodando sem erros?
- [ ] Existem rotas para todas as entidades (ex: `/contas`, `/recebidos`, `/transacoes`)?
- [ ] As rotas retornam os dados corretos (testar via Postman, curl, navegador)?
- [ ] O backend está configurado para aceitar requisições do frontend (CORS, porta, etc.)?

## 3. Frontend
- [ ] O frontend está rodando sem erros?
- [ ] Cada componente/aba está implementado para buscar dados da API correspondente?
- [ ] Os dados recebidos da API estão sendo exibidos corretamente (lista, tabela, cards)?
- [ ] Há tratamento de erro local (ErrorBoundary, mensagens de erro)?
- [ ] O frontend está apontando para o backend correto (URL, porta)?

## 4. Integração
- [ ] Ao acessar cada aba, o frontend faz requisição para a API correta?
- [ ] Os dados aparecem na interface conforme esperado?
- [ ] Alterações feitas no frontend (ex: marcar conta como paga) refletem no banco e vice-versa?
- [ ] O app se mantém funcional mesmo se uma aba apresentar erro?

---

## Lições Aprendidas e Prevenção de Regressão Visual

- **Causa raiz do problema visual no Dashboard:**
  - O componente DashboardTab foi refeito sem usar as classes e estrutura do dashboard original, ignorando `.summary-cards`, `.summary-card`, `.financial-summary` e outras classes esperadas pelo CSS global.
  - Isso resultou em perda do layout moderno, animações, responsividade e surgimento de “cards apagados” ou placeholders indesejados.

- **Solução aplicada:**
  - O DashboardTab foi refatorado para usar exatamente as mesmas classes e estrutura do dashboard original, restaurando o layout moderno, animações e responsividade, mantendo a integração real dos dados.
  - Placeholders extras foram removidos e apenas cards reais são renderizados.

- **Prevenção de regressão:**
  - Sempre padronizar componentes visuais críticos para usar as mesmas classes e estrutura do CSS global do projeto.
  - Evitar estilos inline ou grids customizados em componentes que dependem de estilos globais.
  - Validar visualmente após alterações estruturais em componentes de layout.
  - Documentar padrões de estrutura e classes no onboarding e revisões de PR.

---

## Como usar este checklist
- Marque cada item conforme for validando.
- Atualize o checklist conforme novas features ou integrações forem criadas.
- Use como referência para onboarding de novos devs e revisões de entrega.

---

*Última atualização: 2024-06-07* 