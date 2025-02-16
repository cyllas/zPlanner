import { StyleTemplate } from '../../templates/StyleTemplate';

describe('StyleTemplate', () => {
  let template: StyleTemplate;

  beforeEach(() => {
    template = new StyleTemplate();
  });

  describe('getStyles', () => {
    it('deve retornar estilos CSS válidos', () => {
      const styles = template.generateStyles();

      // Verifica elementos principais
      expect(styles).toContain('.projeto');
      expect(styles).toContain('.projeto__titulo');
      expect(styles).toContain('.projeto__fases');
      
      // Verifica estilos de fase
      expect(styles).toContain('.fase');
      expect(styles).toContain('.fase__titulo');
      expect(styles).toContain('.fase__progresso');
      
      // Verifica estilos de tarefa
      expect(styles).toContain('.tarefa');
      expect(styles).toContain('.tarefa--concluida');

      // Verifica cores e fontes
      expect(styles).toContain('#1E2A38'); // Azul profundo
      expect(styles).toContain('#3B3F45'); // Cinza grafite
      expect(styles).toContain('#CBA36A'); // Dourado sutil
      expect(styles).toContain('Inter'); // Fonte principal

      // Verifica responsividade
      expect(styles).toContain('@media');
      expect(styles).toContain('max-width');
      expect(styles).toContain('padding');
      expect(styles).toContain('margin');
    });

    it('deve incluir estilos para subtarefas', () => {
      const styles = template.generateStyles();

      expect(styles).toContain('.tarefa__subtarefas');
      expect(styles).toContain('padding-left');
      expect(styles).toContain('border-left');
    });

    it('deve incluir estilos para barra de progresso', () => {
      const styles = template.generateStyles();

      expect(styles).toContain('.fase__progresso');
      expect(styles).toContain('.fase__barra');
      expect(styles).toContain('.fase__porcentagem');
      expect(styles).toContain('background-color');
      expect(styles).toContain('border-radius');
      expect(styles).toContain('height');
    });

    it('deve incluir estilos para metadados', () => {
      const styles = template.generateStyles();

      expect(styles).toContain('.projeto__atualizacao');
      expect(styles).toContain('font-size');
      expect(styles).toContain('color');
      expect(styles).toContain('margin');
    });
  });
});
