# Feature Equipes

## Objetivo
Implementar a área de equipes do projeto Feche seu Time com foco em descoberta, cadastro e navegação responsiva.

## Contexto do projeto
- A aplicação já possui autenticação com NextAuth, Prisma, cadastro de free agents e endpoint de equipes em `/api/equipes`.
- Existe um bug na UI do modal de cadastro de equipe onde a escolha de lane não exibe claramente `TOP` e `JUNGLE` em mobile e no desktop.
- A navegação principal deve estar disponível globalmente no layout.

## Escopo desta feature
1. Corrigir o seletor de lanes no cadastro de equipe para exibir todas as opções: `TOP`, `JUNGLE`, `MID`, `ADC`, `SUPPORT` e `FILL`.
2. Adicionar uma tela de listagem de equipes semelhante à listagem de free agents.
3. Criar um navbar global renderizado no layout com links para `INICIO`, `EQUIPES` e `AGENTES`.
4. Manter autenticação no canto superior direito com experiência responsiva para mobile e desktop.

## Requisito funcional
- O cadastro de equipe deve permitir selecionar qualquer lane disponível, incluindo `TOP` e `JUNGLE`.
- A listagem de equipes deve consumir `GET /api/equipes`.
- Cada item listado deve mostrar nome da equipe, lane do capitão e vagas abertas.
- A tela deve seguir o padrão visual existente do projeto.

## Problema atual
- O seletor de lanes no modal de equipe pode parecer mostrar apenas 4 opções em telas menores.
- O motivo esperado é layout responsivo inadequado do dropdown, não a ausência dos dados.
- A barra de navegação é local em algumas páginas e não está centralizada no layout.

## Diretriz de implementação
- Preferir mudanças pequenas e localizadas.
- Reutilizar o máximo possível dos componentes já existentes.
- Evitar duplicação de navbar nas páginas.
- Garantir que os componentes novos funcionem bem em viewport estreita e larga.

## UX esperado
- Navbar fixa no topo com identidade visual do app.
- Links sempre acessíveis.
- Menu de autenticação visível no topo direito.
- Em mobile, navegação pode colapsar em menu expansível, desde que os links permaneçam fáceis de tocar.

## Critérios de aceite
- A tela de cadastro de equipe mostra visualmente todas as lanes.
- Existe uma página de equipes em `/equipes`.
- O navbar aparece em todas as páginas pelo layout global.
- A navegação é utilizável em mobile e desktop.
- O markdown acima pode servir como base para execução por Claude sem exigir contexto adicional.

## Notas técnicas
- Usar o enum `Lane` já definido em `src/types/index.ts`.
- Reaproveitar `PLAYER_POSITIONS` de `src/constants/positions.ts`.
- Reaproveitar a rota `/api/equipes` existente para listagem.
- Preservar o padrão visual escuro do projeto.

## Próximo passo sugerido
- Se necessário, adicionar refinamentos de acesso, filtros por lane e paginação na listagem de equipes.