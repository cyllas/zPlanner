export class StyleTemplate {
  public generateStyles(): string {
    return `
      /* Estilos Globais */
      :root {
        --cor-primaria: #1E2A38;
        --cor-secundaria: #3B3F45;
        --cor-destaque: #CBA36A;
        --cor-texto: #333333;
        --cor-fundo: #FFFFFF;
        --espacamento-padrao: 16px;
        --borda-radius: 4px;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', sans-serif;
        color: var(--cor-texto);
        background-color: var(--cor-fundo);
        line-height: 1.6;
      }

      /* Projeto */
      .projeto {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--espacamento-padrao);
      }

      .projeto__titulo {
        color: var(--cor-primaria);
        font-size: 2rem;
        margin-bottom: var(--espacamento-padrao);
      }

      .projeto__atualizacao {
        color: var(--cor-secundaria);
        font-size: 0.9rem;
        margin-bottom: calc(var(--espacamento-padrao) * 2);
      }

      .projeto__fases {
        display: grid;
        gap: calc(var(--espacamento-padrao) * 2);
      }

      /* Fase */
      .fase {
        background-color: #f5f5f5;
        border-radius: var(--borda-radius);
        padding: var(--espacamento-padrao);
      }

      .fase--concluida {
        background-color: #e8f5e9;
      }

      .fase__titulo {
        color: var(--cor-primaria);
        font-size: 1.5rem;
        margin-bottom: var(--espacamento-padrao);
      }

      .fase__progresso {
        background-color: #e0e0e0;
        border-radius: var(--borda-radius);
        height: 8px;
        margin-bottom: var(--espacamento-padrao);
        position: relative;
        overflow: hidden;
      }

      .fase__barra {
        background-color: var(--cor-destaque);
        height: 100%;
        transition: width 0.3s ease;
      }

      .fase__porcentagem {
        color: var(--cor-secundaria);
        font-size: 0.8rem;
        position: absolute;
        right: 0;
        top: -20px;
      }

      .fase__tarefas {
        display: grid;
        gap: var(--espacamento-padrao);
      }

      /* Tarefa */
      .tarefa {
        background-color: var(--cor-fundo);
        border: 1px solid #e0e0e0;
        border-radius: var(--borda-radius);
        padding: var(--espacamento-padrao);
      }

      .tarefa--concluida {
        border-color: #a5d6a7;
      }

      .tarefa__nome {
        color: var(--cor-texto);
        font-weight: 500;
      }

      .tarefa__subtarefas {
        margin-top: var(--espacamento-padrao);
        padding-left: calc(var(--espacamento-padrao) * 2);
      }

      /* Subtarefa */
      .subtarefa {
        border-left: 2px solid #e0e0e0;
        margin-top: calc(var(--espacamento-padrao) / 2);
        padding-left: var(--espacamento-padrao);
      }

      .subtarefa--concluida {
        border-left-color: #a5d6a7;
      }

      .subtarefa__nome {
        color: var(--cor-secundaria);
        font-size: 0.9rem;
      }

      .subtarefa__subtarefas {
        margin-top: calc(var(--espacamento-padrao) / 2);
        padding-left: var(--espacamento-padrao);
      }

      /* Responsividade */
      @media (max-width: 768px) {
        .projeto {
          padding: calc(var(--espacamento-padrao) / 2);
        }

        .projeto__titulo {
          font-size: 1.5rem;
        }

        .fase__titulo {
          font-size: 1.2rem;
        }

        .tarefa {
          padding: calc(var(--espacamento-padrao) / 2);
        }

        .tarefa__subtarefas {
          padding-left: var(--espacamento-padrao);
        }
      }
    `;
  }
}
