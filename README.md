# Datacrazy CRM — App Mobile

App mobile (React Native + Expo) desenvolvido em resposta ao **Desafio Dev
Mobile 2026** da Datacrazy. Contexto completo do desafio, decisões e
justificativas em [`context.md`](./context.md); tokens de design em
[`src/theme.ts`](./src/theme.ts).

## Stack

- **Expo SDK 57** (React Native 0.86, React 19), TypeScript estrito.
- **React Navigation** (bottom tabs) — 5 abas: Início, Leads, Pipelines,
  Conversas, Perfil.
- **react-native-gesture-handler + react-native-reanimated** — drag-and-drop
  do Kanban rodando na UI thread (worklets), sem round-trip para o JS a cada
  frame de gesto.
- **expo-haptics** — feedback tátil ao pegar/soltar um card e no
  sucesso/erro da mudança de etapa.
- Sem backend real ainda: dados em [`src/data/mock.ts`](./src/data/mock.ts) e
  chamada de API do pipeline isolada em
  [`src/api/deals.ts`](./src/api/deals.ts) (mock com comentário indicando
  onde plugar o `PATCH /deals/{id}/stage` real).

## Estrutura

```
src/
  theme.ts            # fonte única de cores/espaçamento/tipografia (não hardcodar hex)
  types/models.ts      # tipos de domínio (Deal, Lead, Conversation, ...)
  data/mock.ts          # dados mockados usados pelas telas
  api/deals.ts          # chamada de API do pipeline (mock, pronta para integrar)
  utils/format.ts        # formatação de moeda (BRL), datas relativas, iniciais
  components/            # Screen, Card, Tag, Avatar, StatCard, BarChart, SegmentedBar, Toast
  navigation/
    RootNavigator.tsx    # bottom tabs + tema escuro + deep linking
    types.ts
  screens/
    HomeScreen.tsx        # Dashboard: 5 métricas + 2 gráficos + rankings
    LeadsScreen.tsx        # Lista de leads com ticket médio, ciclo e última compra
    PipelineScreen.tsx      # Kanban arrastável (aba "Pipelines", nova)
    ConversationsScreen.tsx  # Multiatendimento com indicador de fila offline
    ProfileScreen.tsx         # Perfil + Automações/Impulsos (somente leitura) + push
```

## Rodando localmente

Pré-requisitos: Node 20+, e o app **Expo Go** no celular (mais rápido para
testar) ou um simulador iOS (precisa de macOS + Xcode) / emulador Android
(Android Studio).

```bash
npm install
npm start
```

No terminal do Metro, aperte `a` (Android), `i` (iOS, só em macOS) ou escaneie
o QR code com o Expo Go. Também dá pra rodar direto:

```bash
npm run android
npm run ios
npm run web   # preview rápido no navegador, útil para revisar layout
```

## Build nativa (Android e iOS) via EAS

O projeto já tem [`eas.json`](./eas.json) com 3 perfis (`development`,
`preview`, `production`). Passos para gerar os builds:

```bash
npm install -g eas-cli
eas login
eas build:configure   # vincula o projeto à sua conta Expo e grava o projectId em app.json
```

Depois disso:

```bash
# APK de teste interno (Android) — não precisa de conta de desenvolvedor
eas build --platform android --profile preview

# Build de produção para as lojas
eas build --platform android --profile production   # gera .aab para a Play Store
eas build --platform ios --profile production        # gera .ipa para a App Store (exige conta Apple Developer)

# Enviar direto para as lojas depois do build
eas submit --platform android
eas submit --platform ios
```

Notas:

- Build iOS (mesmo `--profile development` com `simulator: true`) não exige
  macOS local — a EAS compila na nuvem. Só é necessário Xcode local se for
  rodar/depurar via `npx expo run:ios` diretamente numa máquina Mac.
- `applicationId`/`bundleIdentifier` já configurados como `com.datacrazy.crm`
  em [`app.json`](./app.json); ajuste para o identificador real da Datacrazy
  antes de publicar nas lojas.
- Os ícones em `assets/` são os placeholders padrão do template Expo —
  trocar por artes finais da marca antes de gerar o build de produção.

## Pipeline Kanban — como o drag-and-drop funciona

Implementado em [`PipelineScreen.tsx`](./src/screens/PipelineScreen.tsx),
seguindo a especificação em `context.md`:

- Colunas roláveis horizontalmente (~78% da largura da tela, com snap).
- Cada card usa `Gesture.Pan().activateAfterLongPress(150)` — segura por
  150ms para "pegar" o card (evita conflito com o scroll da lista).
- Toda a lógica de arraste (posição do card fantasma, detecção de coluna sob
  o dedo) roda em **worklets**, via shared values do Reanimated — nenhum
  round-trip para o JS thread a cada frame de movimento.
- Colunas são medidas via `onLayout` + `measureInWindow`; enquanto um card
  está sendo arrastado, o scroll horizontal (das colunas) e vertical (dentro
  de cada coluna) fica travado para manter essas medições válidas.
- Ao soltar: atualização **otimista** do estado local
  (`setDeals` em `handleDrop`) e chamada a `updateDealStage` (em
  `src/api/deals.ts`). Se a chamada falhar, a mudança é revertida
  automaticamente e um toast de erro aparece — troque o corpo de
  `updateDealStage` pela chamada real ao backend quando o endpoint existir.

## Próximos passos (ver `context.md` para prioridade completa)

1. Plugar API real de deals/leads/conversas no lugar dos mocks.
2. Multiatendimento offline "de verdade": fila persistida (ex.: SQLite/MMKV)
   + sync incremental + push via FCM/APNs (hoje `ConversationsScreen` só
   mostra o estado de sincronização).
3. Se o volume de cards por coluna crescer muito em produção, trocar a
   `ScrollView` de cada coluna do Kanban por `@shopify/flash-list`.
4. Automações e Impulsos: hoje são apenas entradas informativas
   "somente leitura" no Perfil — implementar as telas de fato.
