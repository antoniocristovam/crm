export type StageId = 'espera' | 'pre' | 'carrinho' | 'checkout';

export type TagKind = 'alunoAtivo' | 'afiliado' | 'leadQualificado' | 'periodoTeste';

export interface Tag {
  kind: TagKind;
  label: string;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  attendant: string;
  tags: TagKind[];
  stageId: StageId;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  ticketMedio: number;
  cicloCompraDias: number;
  ultimaCompraISO: string;
  tags: TagKind[];
}

export type Channel = 'whatsapp' | 'instagram' | 'email';
export type SyncStatus = 'synced' | 'pending' | 'offline';

export interface Conversation {
  id: string;
  contactName: string;
  channel: Channel;
  lastMessage: string;
  timestampISO: string;
  unreadCount: number;
  attendant: string;
  syncStatus: SyncStatus;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: string;
}

export interface ProductRankingItem {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface AttendantRankingItem {
  id: string;
  name: string;
  deals: number;
  revenue: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatarColor: string;
}

export interface SettingsEntry {
  id: string;
  label: string;
  description: string;
  icon: string;
  readOnly?: boolean;
  badge?: string;
}
