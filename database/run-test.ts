#!/usr/bin/env ts-node

import { testarBancoDeDados } from './test';

console.log('🚀 Iniciando testes do banco de dados SQLite...\n');

testarBancoDeDados()
  .then(() => {
    console.log('\n✅ Testes concluídos!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro durante os testes:', error);
    process.exit(1);
  }); 