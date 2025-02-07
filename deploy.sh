#!/bin/bash

#Parar o script se ocorrer algum erro
set -e

#Build do projeto
npm run build

#Acessar o diretório de build
cd dist

#Inicializar um repositório Git (caso não exista)
git init

#Verificar se a branch gh-pages já existe localmente, e se não, criar a branch
git checkout -B gh-pages

#Adicionar todos os arquivos
git add -A

#Fazer o commit com uma mensagem de deploy
git commit -m "Deploy"

#Forçar o push para a branch gh-pages do repositório remoto
git push -f https://github.com/square-cpu/Haja.git gh-pages

#Voltar para o diretório anterior
cd -

echo "Deploy finalizado!"