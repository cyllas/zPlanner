# 📋 zPlanner

Um gerenciador de projetos simples e eficiente via linha de comando.

## 📦 Instalação

```bash
npm install -g zplanner
```

## 🚀 Uso Rápido

```bash
# Criar uma nova fase
zplanner add-phase fase1 "Fase de Planejamento"

# Adicionar uma tarefa à fase
zplanner add-task fase1 1.1 "Definir requisitos"

# Marcar tarefa como concluída
zplanner complete-task fase1 1.1

# Ver progresso do projeto
zplanner progress
```

## 📚 Documentação Detalhada

### Estrutura do Projeto

O zPlanner organiza seu projeto em fases e tarefas:

```json
{
  "project": "Meu Projeto",
  "last_update": "14/02/2025",
  "phases": {
    "fase1": {
      "name": "Fase de Planejamento",
      "executed": false,
      "tasks": [
        {
          "id": "1.1",
          "name": "Definir requisitos",
          "executed": false
        }
      ]
    }
  }
}
```

### Comandos Disponíveis

#### 1. Gerenciamento de Fases

```bash
# Adicionar uma nova fase
zplanner add-phase <id> <nome>

# Exemplo:
zplanner add-phase design "Design do Sistema"
zplanner add-phase dev "Desenvolvimento"
zplanner add-phase test "Testes"
```

#### 2. Gerenciamento de Tarefas

```bash
# Adicionar uma nova tarefa
zplanner add-task <fase> <id> <nome>

# Exemplo:
zplanner add-task design 1.1 "Criar wireframes"
zplanner add-task design 1.2 "Definir paleta de cores"
zplanner add-task dev 2.1 "Configurar ambiente"
```

#### 3. Status das Tarefas

```bash
# Marcar tarefa como concluída
zplanner complete-task <fase> <id>

# Marcar tarefa como pendente
zplanner pending-task <fase> <id>

# Exemplos:
zplanner complete-task design 1.1  # Marca "Criar wireframes" como concluída
zplanner pending-task dev 2.1      # Marca "Configurar ambiente" como pendente
```

#### 4. Visualização e Progresso

```bash
# Listar todas as fases e tarefas
zplanner list

# Ver progresso do projeto
zplanner progress
```

### 📊 Exemplo de Saída

#### Listagem de Tarefas
```
📦 Design do Sistema:
   ✅ Criar wireframes
   ⭕ Definir paleta de cores

📦 Desenvolvimento:
   ⭕ Configurar ambiente
```

#### Progresso do Projeto
```
Progresso do Projeto:
- Tarefas: 33.3%
- Fases: 0%
```

## 🛠️ Uso Avançado

### 1. Organização de Fases

Recomendamos organizar as fases em ordem cronológica:

```bash
# Exemplo de estrutura cronológica
zplanner add-phase p1 "1. Planejamento"
zplanner add-phase p2 "2. Design"
zplanner add-phase p3 "3. Desenvolvimento"
zplanner add-phase p4 "4. Testes"
zplanner add-phase p5 "5. Deploy"
```

### 2. Nomenclatura de Tarefas

Use IDs hierárquicos para melhor organização:

```bash
# Formato: <fase>.<número>
zplanner add-task p1 1.1 "Análise de requisitos"
zplanner add-task p1 1.2 "Definição de escopo"
zplanner add-task p1 1.2.1 "Escopo MVP"
zplanner add-task p1 1.2.2 "Escopo futuro"
```

### 3. Acompanhamento de Progresso

O progresso é calculado automaticamente:
- **Tarefas**: Porcentagem de tarefas concluídas em relação ao total
- **Fases**: Porcentagem de fases com todas as tarefas concluídas

## 📝 Arquivo de Configuração

O zPlanner cria automaticamente um arquivo `planner.json` no diretório atual. Você pode:
- Fazer backup deste arquivo
- Versioná-lo com git
- Editá-lo manualmente (com cuidado)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
