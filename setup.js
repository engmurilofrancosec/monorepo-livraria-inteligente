const fs = require('fs');
const path = require('path');

const projects = [
  { dir: 'backend', env: '.env', example: '.env.example' },
  { dir: 'frontend', env: '.env', example: '.env.example' }
];

console.log('Iniciando configuração de ambiente...');

projects.forEach(p => {
  const envPath = path.join(__dirname, p.dir, p.env);
  const examplePath = path.join(__dirname, p.dir, p.example);

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log(`Arquivo ${p.dir}/.env criado com sucesso.`);
    } else {
      console.log(`Aviso: ${p.dir}/.env.example não encontrado.`);
    }
  } else {
    console.log(`ℹ${p.dir}/.env já existe. Pulando...`);
  }
});

console.log('Configuração concluída!');
