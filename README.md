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

O projeto usa só bibliotecas compatíveis com o Expo Go (nenhum módulo nativo
customizado ainda) — não precisa de build nenhum para testar no dia a dia.

```bash
npm install
npm start
```

No terminal do Metro, aperte `a` (Android), `i` (iOS, só em macOS) ou escaneie
o QR code com o app **Expo Go**. Também dá pra rodar direto:

```bash
npm run android   # abre no emulador/dispositivo Android via Expo Go
npm run ios       # abre no simulador iOS via Expo Go (só em macOS)
npm run web       # preview rápido no navegador, útil para revisar layout
```

> Se em algum momento `npm run android`/`ios` reclamar de "No development
> build installed", é sinal de que alguma dependência instalada exige um
> dev client customizado (ex.: `expo-dev-client` ou um módulo nativo fora do
> Expo Go). Rode `npx expo start --go` para forçar o modo Expo Go, ou gere um
> development build com EAS (veja a seção abaixo).

## Build nativa (Android e iOS) via EAS

O projeto já tem [`eas.json`](./eas.json) com 2 perfis (`preview`,
`production`) para gerar builds instaláveis de verdade (fora do Expo Go).
Não é preciso instalar nada globalmente — dá pra usar `npx eas-cli` direto
(evita problemas de PATH no Windows quando um `npm install -g` não fica
visível no PowerShell):

```bash
npx eas-cli login
npx eas-cli build:configure   # vincula o projeto à sua conta Expo e grava o projectId em app.json
```

Se preferir instalar globalmente (aí os comandos viram só `eas ...`):

```bash
npm install -g eas-cli
```

Depois de instalar globalmente, feche e abra um novo terminal antes de
rodar `eas login` — o PowerShell só recarrega o PATH em uma sessão nova.

Depois disso (troque `eas` por `npx eas-cli` se não instalou globalmente):

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

- Build iOS não exige macOS local — a EAS compila na nuvem. Só é necessário
  Xcode local se for rodar/depurar via `npx expo run:ios` diretamente numa
  máquina Mac.
- Se mais pra frente o projeto precisar de um módulo nativo que o Expo Go não
  suporta, reinstale `expo-dev-client` (`npx expo install expo-dev-client`) e
  adicione de volta um perfil `development` (`developmentClient: true`) no
  `eas.json` para gerar um build de desenvolvimento instalável.
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
