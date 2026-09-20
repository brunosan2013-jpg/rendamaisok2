# Calculadora de Juros — RENDA MAIS

Projeto estático, responsivo e sem dependências externas. Os dados permanecem no navegador: não há login, cookies ou envio de informações.

## Executar localmente

Abra `index.html` diretamente no navegador, ou sirva a pasta com qualquer servidor estático. Para testar a matemática, com Node.js instalado, execute `node tests.js` dentro desta pasta.

## Publicar

Envie todos os arquivos desta pasta ao diretório público de qualquer hospedagem estática (Netlify, Vercel, GitHub Pages ou hospedagem própria). Não há etapa de compilação.

## Fórmulas

Em cada mês: `saldo novo = saldo anterior × (1 + taxa mensal) + aporte`. Para taxa anual, a equivalência mensal é `(1 + taxa anual)^(1/12) − 1`. Os aportes são considerados no fim de cada mês e o arredondamento é feito apenas na exibição.

## Estrutura

- `index.html`: estrutura, SEO e conteúdo.
- `styles.css`: identidade visual responsiva; altere as variáveis em `:root` para aplicar a marca.
- `math.js`: funções puras de conversão e cálculo.
- `app.js`: interface, formato brasileiro, gráfico e tabela.
- `tests.js`: testes automatizados sem bibliotecas.

Próximas calculadoras podem reutilizar `math.js` e adicionar páginas ou módulos próprios, sem alterar a interface desta calculadora.

Projeto RENDA MAIS
