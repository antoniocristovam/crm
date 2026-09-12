import { colors } from '@/theme';
import type {
  AttendantRankingItem,
  ChartPoint,
  Conversation,
  DashboardMetric,
  Deal,
  Lead,
  ProductRankingItem,
  SettingsEntry,
  TagKind,
  UserProfile,
} from '@/types/models';

export const TAG_LABELS: Record<TagKind, string> = {
  alunoAtivo: 'Aluno ativo',
  afiliado: 'Afiliado',
  leadQualificado: 'Lead qualificado',
  periodoTeste: 'Período de teste',
};

export const TAG_STYLES: Record<TagKind, { bg: string; fg: string }> = {
  alunoAtivo: { bg: colors.tagAlunoAtivoBg, fg: colors.tagAlunoAtivoFg },
  afiliado: { bg: colors.tagAfiliadoBg, fg: colors.tagAfiliadoFg },
  leadQualificado: { bg: colors.tagLeadQualificadoBg, fg: colors.tagLeadQualificadoFg },
  periodoTeste: { bg: colors.tagPeriodoTesteBg, fg: colors.tagPeriodoTesteFg },
};

export const INITIAL_DEALS: Deal[] = [
  { id: 'd1', name: 'Fernanda Alves', value: 1497, attendant: 'Bruno', tags: ['leadQualificado'], stageId: 'espera' },
  { id: 'd2', name: 'Ricardo Souza', value: 897, attendant: 'Camila', tags: ['periodoTeste'], stageId: 'espera' },
  { id: 'd3', name: 'Juliana Prado', value: 2497, attendant: 'Bruno', tags: ['afiliado'], stageId: 'espera' },
  { id: 'd4', name: 'Marcos Lima', value: 1197, attendant: 'Diego', tags: [], stageId: 'pre' },
  { id: 'd5', name: 'Patrícia Nunes', value: 1997, attendant: 'Camila', tags: ['leadQualificado'], stageId: 'pre' },
  { id: 'd6', name: 'Eduardo Ramos', value: 697, attendant: 'Bruno', tags: [], stageId: 'pre' },
  { id: 'd7', name: 'Aline Torres', value: 3497, attendant: 'Diego', tags: ['alunoAtivo'], stageId: 'carrinho' },
  { id: 'd8', name: 'Thiago Farias', value: 1297, attendant: 'Camila', tags: ['periodoTeste'], stageId: 'carrinho' },
  { id: 'd9', name: 'Bianca Rocha', value: 997, attendant: 'Bruno', tags: [], stageId: 'checkout' },
  { id: 'd10', name: 'Gustavo Melo', value: 2197, attendant: 'Diego', tags: ['afiliado'], stageId: 'checkout' },
  { id: 'd11', name: 'Camila Duarte', value: 1597, attendant: 'Camila', tags: ['alunoAtivo'], stageId: 'checkout' },
];

export const LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'Fernanda Alves',
    email: 'fernanda.alves@email.com',
    ticketMedio: 1497,
    cicloCompraDias: 6,
    ultimaCompraISO: '2026-08-30T14:12:00Z',
    tags: ['leadQualificado'],
  },
  {
    id: 'l2',
    name: 'Ricardo Souza',
    email: 'ricardo.souza@email.com',
    ticketMedio: 897,
    cicloCompraDias: 12,
    ultimaCompraISO: '2026-08-18T09:40:00Z',
    tags: ['periodoTeste'],
  },
  {
    id: 'l3',
    name: 'Juliana Prado',
    email: 'juliana.prado@email.com',
    ticketMedio: 2497,
    cicloCompraDias: 4,
    ultimaCompraISO: '2026-09-08T11:05:00Z',
    tags: ['afiliado', 'alunoAtivo'],
  },
  {
    id: 'l4',
    name: 'Marcos Lima',
    email: 'marcos.lima@email.com',
    ticketMedio: 1197,
    cicloCompraDias: 9,
    ultimaCompraISO: '2026-07-28T16:22:00Z',
    tags: [],
  },
  {
    id: 'l5',
    name: 'Patrícia Nunes',
    email: 'patricia.nunes@email.com',
    ticketMedio: 1997,
    cicloCompraDias: 5,
    ultimaCompraISO: '2026-09-05T08:15:00Z',
    tags: ['leadQualificado'],
  },
  {
    id: 'l6',
    name: 'Eduardo Ramos',
    email: 'eduardo.ramos@email.com',
    ticketMedio: 697,
    cicloCompraDias: 15,
    ultimaCompraISO: '2026-08-02T13:50:00Z',
    tags: [],
  },
  {
    id: 'l7',
    name: 'Aline Torres',
    email: 'aline.torres@email.com',
    ticketMedio: 3497,
    cicloCompraDias: 3,
    ultimaCompraISO: '2026-09-10T10:30:00Z',
    tags: ['alunoAtivo'],
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    contactName: 'Fernanda Alves',
    channel: 'whatsapp',
    lastMessage: 'Consigo parcelar em quantas vezes?',
    timestampISO: '2026-09-11T18:42:00Z',
    unreadCount: 3,
    attendant: 'Bruno',
    syncStatus: 'synced',
  },
  {
    id: 'c2',
    contactName: 'Ricardo Souza',
    channel: 'instagram',
    lastMessage: 'Vi o story, ainda dá pra pegar o desconto?',
    timestampISO: '2026-09-11T17:58:00Z',
    unreadCount: 0,
    attendant: 'Camila',
    syncStatus: 'pending',
  },
  {
    id: 'c3',
    contactName: 'Juliana Prado',
    channel: 'email',
    lastMessage: 'Obrigada pelo retorno rápido!',
    timestampISO: '2026-09-11T16:10:00Z',
    unreadCount: 0,
    attendant: 'Bruno',
    syncStatus: 'synced',
  },
  {
    id: 'c4',
    contactName: 'Marcos Lima',
    channel: 'whatsapp',
    lastMessage: 'Pode me mandar o boleto de novo?',
    timestampISO: '2026-09-11T15:03:00Z',
    unreadCount: 1,
    attendant: 'Diego',
    syncStatus: 'offline',
  },
  {
    id: 'c5',
    contactName: 'Patrícia Nunes',
    channel: 'whatsapp',
    lastMessage: 'Fechado, vou fazer o pagamento hoje.',
    timestampISO: '2026-09-11T12:47:00Z',
    unreadCount: 0,
    attendant: 'Camila',
    syncStatus: 'synced',
  },
  {
    id: 'c6',
    contactName: 'Eduardo Ramos',
    channel: 'instagram',
    lastMessage: 'Ainda estou avaliando, obrigado.',
    timestampISO: '2026-09-10T20:15:00Z',
    unreadCount: 0,
    attendant: 'Bruno',
    syncStatus: 'synced',
  },
];

export const DASHBOARD_METRICS: DashboardMetric[] = [
  { id: 'm1', label: 'Faturamento no mês', value: 'R$ 128,4mil', delta: '+18%', deltaPositive: true, icon: 'trending-up' },
  { id: 'm2', label: 'Novos leads', value: '342', delta: '+7%', deltaPositive: true, icon: 'account-plus' },
  { id: 'm3', label: 'Ticket médio', value: 'R$ 1.487', delta: '+3%', deltaPositive: true, icon: 'cash' },
  { id: 'm4', label: 'Taxa de conversão', value: '24,8%', delta: '-1,2%', deltaPositive: false, icon: 'chart-donut' },
  { id: 'm5', label: 'Ciclo médio de venda', value: '6,4 dias', delta: '-0,8 dia', deltaPositive: true, icon: 'clock-fast' },
];

export const REVENUE_CHART: ChartPoint[] = [
  { label: 'Mar', value: 62 },
  { label: 'Abr', value: 74 },
  { label: 'Mai', value: 68 },
  { label: 'Jun', value: 81 },
  { label: 'Jul', value: 95 },
  { label: 'Ago', value: 88 },
  { label: 'Set', value: 128 },
];

export const PIPELINE_DISTRIBUTION: ChartPoint[] = [
  { label: 'Espera', value: 3 },
  { label: 'Pré', value: 3 },
  { label: 'Carrinho', value: 2 },
  { label: 'Checkout', value: 3 },
];

export const PRODUCT_RANKING: ProductRankingItem[] = [
  { id: 'p1', name: 'Mentoria Avançada', sales: 84, revenue: 125_580 },
  { id: 'p2', name: 'Curso Completo CRM', sales: 61, revenue: 91_240 },
  { id: 'p3', name: 'Workshop ao vivo', sales: 47, revenue: 42_090 },
];

export const ATTENDANT_RANKING: AttendantRankingItem[] = [
  { id: 'a1', name: 'Bruno Castro', deals: 38, revenue: 68_420 },
  { id: 'a2', name: 'Camila Duarte', deals: 33, revenue: 59_310 },
  { id: 'a3', name: 'Diego Fontes', deals: 27, revenue: 47_980 },
];

export const CURRENT_USER: UserProfile = {
  name: 'Antonio Cristóvam',
  role: 'Gestor de vendas',
  email: 'antonio.cristovam.neto@gmail.com',
  avatarColor: colors.accentViolet,
};

export const SETTINGS_ENTRIES: SettingsEntry[] = [
  {
    id: 's1',
    label: 'Automações',
    description: 'Regras de disparo automático por etapa do funil',
    icon: 'flash-outline',
    readOnly: true,
    badge: 'Somente leitura',
  },
  {
    id: 's2',
    label: 'Impulsos',
    description: 'Campanhas de reengajamento e recuperação de carrinho',
    icon: 'rocket-outline',
    readOnly: true,
    badge: 'Somente leitura',
  },
  {
    id: 's3',
    label: 'Notificações push',
    description: 'Alertas de novos leads, mensagens e mudanças de etapa',
    icon: 'notifications-outline',
  },
  {
    id: 's4',
    label: 'Conta e equipe',
    description: 'Dados da empresa, atendentes e permissões',
    icon: 'people-outline',
  },
  {
    id: 's5',
    label: 'Preferências',
    description: 'Tema, idioma e formato de moeda',
    icon: 'options-outline',
  },
];
