#!/bin/bash

# Verifica se está logado no npm
npm whoami || (echo "Por favor, faça login no npm primeiro com: npm login" && exit 1)

# Limpa a pasta dist
rm -rf dist

# Build do projeto
npm run build

# Publica o pacote
npm publish --access public
