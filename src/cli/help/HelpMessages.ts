export class HelpMessages {
  static readonly MAIN = `
Descrição:
  Gerenciador de projetos via linha de comando (CLI)

Uso:
  zplanner [comando] [opções]

Grupos de Comandos:
  Fases:
    add-phase      Cria uma nova fase
    rename-phase   Renomeia fase existente
    move-phase     Reposiciona uma fase
    remove-phase   Remove uma fase

  Tarefas:
    add-task      Cria tarefa em uma fase
    add-subtask   Cria subtarefa
    move-task     Move tarefa entre fases
    complete      Marca tarefa como concluída
    pending       Marca tarefa como pendente

  Visualização:
    list          Lista estrutura do projeto
    progress      Exibe progresso atual
    export-html   Exporta para HTML

Opções Globais:
  -v, --version   Mostra versão
  -h, --help      Mostra ajuda`;

  static readonly PHASE = {
    ADD: `
Descrição:
  Cria uma nova fase no projeto

Uso:
  zplanner add-phase <id> <nome>

Argumentos:
  id    Identificador único (ex: fase-1)
  nome  Nome descritivo da fase

Exemplo:
  $ zplanner add-phase inicio "Fase Inicial"`,

    RENAME: `
Descrição:
  Altera o nome de uma fase existente

Uso:
  zplanner rename-phase <id> <novo-nome>

Argumentos:
  id         ID da fase
  novo-nome  Novo nome desejado

Exemplo:
  $ zplanner rename-phase inicio "Fase de Iniciação"`,

    MOVE: `
Descrição:
  Muda a posição de uma fase na sequência

Uso:
  zplanner move-phase <id> <posicao>

Argumentos:
  id       ID da fase
  posicao  Nova posição (número)

Exemplo:
  $ zplanner move-phase inicio 2`,

    REMOVE: `
Descrição:
  Remove uma fase e suas tarefas

Uso:
  zplanner remove-phase <id>

Argumentos:
  id  ID da fase a remover

Exemplo:
  $ zplanner remove-phase inicio`
  };

  static readonly TASK = {
    ADD: `
Descrição:
  Adiciona nova tarefa em uma fase

Uso:
  zplanner add-task <fase> <id> <nome>

Argumentos:
  fase  ID da fase pai
  id    ID único da tarefa
  nome  Nome descritivo

Exemplo:
  $ zplanner add-task inicio task-1 "Definir escopo"`,

    ADD_SUBTASK: `
Descrição:
  Cria subtarefa vinculada a uma tarefa

Uso:
  zplanner add-subtask <fase> <tarefa-pai> <id> <nome>

Argumentos:
  fase        ID da fase
  tarefa-pai  ID da tarefa principal
  id          ID da subtarefa
  nome        Nome descritivo

Exemplo:
  $ zplanner add-subtask inicio task-1 sub-1 "Levantar requisitos"`,

    MOVE: `
Descrição:
  Transfere tarefa entre fases

Uso:
  zplanner move-task <origem> <destino> <id>

Argumentos:
  origem   ID fase atual
  destino  ID fase destino
  id       ID da tarefa

Exemplo:
  $ zplanner move-task inicio desenvolvimento task-1`,

    COMPLETE: `
Descrição:
  Marca tarefa como finalizada

Uso:
  zplanner complete <fase> <id>

Argumentos:
  fase  ID da fase
  id    ID da tarefa

Exemplo:
  $ zplanner complete inicio task-1`,

    PENDING: `
Descrição:
  Marca tarefa como pendente

Uso:
  zplanner pending <fase> <id>

Argumentos:
  fase  ID da fase
  id    ID da tarefa

Exemplo:
  $ zplanner pending inicio task-1`
  };

  static readonly VISUALIZATION = {
    LIST: `
Descrição:
  Exibe estrutura completa do projeto

Uso:
  zplanner list

Exemplo:
  $ zplanner list`,

    PROGRESS: `
Descrição:
  Mostra progresso atual do projeto

Uso:
  zplanner progress [opções]

Opções:
  -d, --detailed  Exibe detalhes por fase

Exemplos:
  $ zplanner progress
  $ zplanner progress --detailed`,

    EXPORT: `
Descrição:
  Gera relatório em HTML do projeto

Uso:
  zplanner export-html [saida]

Argumentos:
  saida  Caminho do arquivo (padrão: "zplanner.html")

Exemplos:
  $ zplanner export-html
  $ zplanner export-html relatorio.html`
  };
}
