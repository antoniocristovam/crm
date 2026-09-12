/**
 * Datacrazy Mobile — design tokens
 * Direção visual: escuro, elegante, alinhado ao material de marca (desafio PDF).
 * Inspirado em padrões de CRMs modernos (Attio, Linear, Height): cards com
 * hierarquia por cor de acento lateral, tipografia limpa, grid de 8pt, pouco ruído visual.
 */

export const colors = {
  // superfícies
  background: "#0A0A18",
  surface: "#13131F",
  surfaceAlt: "#0F0F1A",
  border: "#2A2A40",
  borderStrong: "#3A3A55",

  // texto
  textPrimary: "#F5F6FA",
  textMuted: "#AAB0C4",
  textFaint: "#6E7590",

  // marca
  accentViolet: "#9B8CFF",
  accentBlue: "#6C8CFF",
  accentGradientStart: "#7C5CFF",
  accentGradientEnd: "#3B5FE0",

  // status / etapas do pipeline (cores herdadas do CRM web, para consistência)
  stageEspera: "#8B8FA3",
  stagePre: "#F2994A",
  stageCarrinho: "#6C8CFF",
  stageCheckout: "#B18CFF",

  // feedback
  success: "#3FBE7A",
  warning: "#F2C94A",
  danger: "#F26565",

  // tags (mesma paleta usada no CRM web, adaptada ao fundo escuro)
  tagAlunoAtivoBg: "#1B2A4D",
  tagAlunoAtivoFg: "#8FB2FF",
  tagAfiliadoBg: "#3A1930",
  tagAfiliadoFg: "#F28FC0",
  tagLeadQualificadoBg: "#123526",
  tagLeadQualificadoFg: "#5FE0A0",
  tagPeriodoTesteBg: "#3A2A10",
  tagPeriodoTesteFg: "#F2B24A",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  fontFamily: "System", // usa SF Pro no iOS e Roboto no Android automaticamente
  h1: { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: "700" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  bodyStrong: { fontSize: 14, fontWeight: "700" as const },
  caption: { fontSize: 11.5, fontWeight: "600" as const },
  label: { fontSize: 10.5, fontWeight: "700" as const, letterSpacing: 0.4 },
};

export const shadow = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  dragging: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 14,
  },
};

export const stageMeta = [
  { id: "espera", name: "Lista de Espera", color: colors.stageEspera },
  { id: "pre", name: "Pré-lançamento", color: colors.stagePre },
  { id: "carrinho", name: "Carrinho Aberto", color: colors.stageCarrinho },
  { id: "checkout", name: "Checkout", color: colors.stageCheckout },
] as const;