import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { CONVERSATIONS } from '@/data/mock';
import type { Channel, Conversation, SyncStatus } from '@/types/models';
import { formatClock } from '@/utils/format';

const CHANNEL_META: Record<Channel, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  whatsapp: { icon: 'logo-whatsapp', color: colors.success, label: 'WhatsApp' },
  instagram: { icon: 'logo-instagram', color: colors.accentViolet, label: 'Instagram' },
  email: { icon: 'mail-outline', color: colors.accentBlue, label: 'E-mail' },
};

const SYNC_META: Record<SyncStatus, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  synced: { label: 'Sincronizado', color: colors.success, icon: 'checkmark-circle' },
  pending: { label: 'Enviando…', color: colors.warning, icon: 'time' },
  offline: { label: 'Offline · na fila', color: colors.textFaint, icon: 'cloud-offline' },
};

function ConversationRow({ conversation }: { conversation: Conversation }) {
  const channel = CHANNEL_META[conversation.channel];
  const sync = SYNC_META[conversation.syncStatus];
  const isUnread = conversation.unreadCount > 0;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          <Avatar name={conversation.contactName} />
          <View style={[styles.channelBadge, { backgroundColor: colors.surface, borderColor: channel.color }]}>
            <Ionicons name={channel.icon} size={10} color={channel.color} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.topLine}>
            <Text style={[styles.name, isUnread && styles.nameUnread]} numberOfLines={1}>
              {conversation.contactName}
            </Text>
            <Text style={styles.time}>{formatClock(conversation.timestampISO)}</Text>
          </View>

          <Text style={[styles.message, isUnread && styles.messageUnread]} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.syncChip}>
              <Ionicons name={sync.icon} size={11} color={sync.color} />
              <Text style={[styles.syncLabel, { color: sync.color }]}>{sync.label}</Text>
            </View>
            <Text style={styles.attendant}>com {conversation.attendant}</Text>
          </View>
        </View>

        {isUnread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

export function ConversationsScreen() {
  const pendingCount = useMemo(
    () => CONVERSATIONS.filter((c) => c.syncStatus !== 'synced').length,
    []
  );

  return (
    <Screen>
      <SectionHeader title="Conversas" subtitle="Multiatendimento com fila offline" />

      {pendingCount > 0 && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.warning} />
          <Text style={styles.offlineBannerText}>
            {pendingCount} {pendingCount === 1 ? 'conversa aguardando' : 'conversas aguardando'} sincronização —
            serão enviadas automaticamente ao reconectar.
          </Text>
        </View>
      )}

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationRow conversation={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: `${colors.warning}14`,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
  },
  offlineBannerText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatarWrap: {
    position: 'relative',
  },
  channelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 3,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.body,
    color: colors.textMuted,
    flexShrink: 1,
  },
  nameUnread: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  time: {
    ...typography.caption,
    color: colors.textFaint,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
  },
  messageUnread: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  syncChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncLabel: {
    ...typography.caption,
    fontSize: 10.5,
  },
  attendant: {
    ...typography.caption,
    color: colors.textFaint,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.accentViolet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    ...typography.caption,
    color: '#0A0A18',
    fontWeight: '800',
  },
});
