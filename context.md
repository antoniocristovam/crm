# Contexto para implementação — App Mobile Datacrazy (Desafio Dev Mobile 2026)

Cole este documento inteiro na sessão do Claude Code que já está rodando no
repositório clonado, como primeira mensagem, para que ele tenha o mesmo
contexto que foi levantado em conversa separada (chat web/mobile, sem acesso
a este repositório).

## 1. O que é o projeto

Resposta ao "Desafio Dev Mobile 2026" da Datacrazy: refazer a experiência
mobile do CRM Datacrazy, decidir se vale migrar de React Native para nativo,
e propor experiências mobile que hoje só existem na versão web.

**Decisão já tomada e justificada (não reabrir a menos que peçam): manter
React Native.** O app hoje não tem um problema de arquitetura — tem um
problema de escopo de produto (faltam features) e de otimização pontual em
Android. Documento completo com a justificativa está em
`Diagnostico_Migracao_Datacrazy.docx` (anexo/compartilhado junto com este
contexto).

## 2. Lacunas encontradas (app mobile publicado vs. CRM web)

Levantadas comparando screenshots reais do CRM web em produção com o app
publicado nas lojas (Android nota 2,3/5 com 6 avaliações; iOS nota 4,9/5 com
8 avaliações — discrepância grande, típica de RN não otimizado para
fragmentação de hardware Android, não de limitação do framework):

- **Pipeline/Kanban não existe no app.** É a lacuna mais crítica — uso diário
  direto do vendedor. Web tem colunas por etapa (Lista de Espera →
  Pré-lançamento → Carrinho Aberto → Checkout) com cards arrastáveis
  (nome, atendente, valor, tags).
- Dashboard mobile mostra só 2 gráficos simples; web tem 5 cards de métrica +
  ranking de produtos/atendentes.
- Lista de Leads no app não mostra ticket médio, ciclo de compra, última
  compra (presentes na web).
- Automações, Impulsos e a maior parte de Configurações não existem no app.
- Um review do iOS pede explicitamente mais notificações push.

## 3. Prioridade de implementação (ordem confirmada)

1. **Pipeline Kanban respons\u00edvel** — maior impacto, hoje ausente.
2. **Multiatendimento offline + push** — fila offline, sync incremental,
   notificações (FCM/APNs).
3. Dashboard completo (paridade de métricas com a web).
4. Automações/Impulsos em modo leitura.

## 4. Direção visual (já aplicada no PDF do diagnóstico, replicar no app)

Tema escuro e elegante, alinhado à identidade que a própria Datacrazy usa no
material da vaga (fundo quase preto-azulado, acento violeta/azul, cards com
borda sutil, tipografia bold em branco). **Os tokens já estão prontos em
`theme.ts`** — usar esse arquivo como fonte única de cores/espaçamento/tipografia,
não hardcodar hex nos componentes.

Resumo dos tokens (ver `theme.ts` para a lista completa):

| Token                 | Valor     | Uso                                          |
| --------------------- | --------- | -------------------------------------------- |
| `colors.background`   | `#0A0A18` | fundo de tela                                |
| `colors.surface`      | `#13131F` | cards                                        |
| `colors.border`       | `#2A2A40` | bordas de card/coluna                        |
| `colors.accentViolet` | `#9B8CFF` | destaque primário, valores monetários        |
| `colors.accentBlue`   | `#6C8CFF` | destaque secundário, coluna em hover de drag |
| `colors.textPrimary`  | `#F5F6FA` | texto principal                              |
| `colors.textMuted`    | `#AAB0C4` | texto secundário                             |

Referências de UX para o padrão de Kanban mobile e cards: **Attio**, **Linear**
e **Height** — cards com hierarquia por acento lateral/de cor, grid de 8pt,
pouco ruído visual, motion apenas nos gestos (sem animações decorativas soltas).

## 5. Especificação de interação do Kanban (já implementada em `PipelineScreen.tsx`)

- Colunas roláveis horizontalmente, largura ~78% da tela, com snap.
- Cards arrastáveis **entre colunas** via `react-native-gesture-handler` +
  `react-native-reanimated` — o gesto roda na UI thread (worklets), sem
  round-trip pro JS thread a cada frame de movimento.
- Coluna de destino detectada por posição absoluta do dedo (`absoluteX`)
  contra os retângulos de cada coluna, medidos via `onLayout`.
- Highlight visual da coluna de destino durante o arraste.
- Ao soltar: atualização otimista do estado local; a chamada de API real
  (`PATCH /deals/{id}/stage`) deve ser plugada onde há o comentário
  `// Chamada real de API` dentro de `handleDrop`, com rollback para a
  coluna original em caso de erro (toast de erro).

**Arquivos prontos para colar no repositório:**

- `theme.ts` → sugestão: `src/theme.ts` (ou onde já existir um arquivo de tema)
- `PipelineScreen.tsx` → sugestão: `src/screens/PipelineScreen.tsx`

Dependências necessárias, caso ainda não estejam no projeto:

```bash
yarn add react-native-reanimated react-native-gesture-handler
# iOS
cd ios && pod install
```

Configuração obrigatória:

- Envolver o `App` raiz com `<GestureHandlerRootView style={{ flex: 1 }}>`.
- Adicionar `'react-native-reanimated/plugin'` como **último** plugin em
  `babel.config.js`.
- Registrar `PipelineScreen` como uma nova aba/rota na navegação existente
  (a proposta é adicionar "Pipelines" como quinta aba na tab bar, com um
  badge "NOVO" — ver protótipo web de referência, se disponível).

## 6. Próximos passos sugeridos para esta sessão do Claude Code

1. Integrar `theme.ts` e `PipelineScreen.tsx` na estrutura real do projeto
   (ajustar imports conforme os path aliases já configurados).
2. Ligar a nova rota/aba de Pipelines na navegação existente.
3. Substituir os dados mockados de `INITIAL_DEALS` pela chamada real à API
   do CRM (endpoint de listagem de deals por pipeline/etapa).
4. Implementar o `PATCH` de mudança de etapa com rollback em erro.
5. Se o volume de cards por coluna for grande em produção, trocar a
   `ScrollView` de cada coluna por `@shopify/flash-list` para virtualização
   (comentário já deixado no código indicando onde).
6. Aplicar os mesmos tokens de `theme.ts` nas telas já existentes (Início,
   Leads, Conversas, Perfil) para consistência visual com a nova direção.

## 7. Documentos de referência já produzidos (fora deste repositório)

- `Diagnostico_Migracao_Datacrazy.docx` — documento completo com diagnóstico,
  proposta técnica e especificação (Entregas 1, 2 e 3 do desafio).
- Protótipo web interativo do Kanban (referência visual/comportamental,
  não é o código de produção — o código de produção é `PipelineScreen.tsx`
  acima, em React Native real).
