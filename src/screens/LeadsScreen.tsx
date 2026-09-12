import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { TagPill } from '@/components/Tag';
import { LEADS } from '@/data/mock';
import type { Lead } from '@/types/models';
import { formatBRL, formatRelativeDate } from '@/utils/format';

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Avatar name={lead.name} />
        <View style={styles.identity}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.email} numberOfLines={1}>
            {lead.email}
          </Text>
        </View>
      </View>

      {lead.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {lead.tags.map((tag) => (
            <TagPill key={tag} kind={tag} />
          ))}
        </View>
      )}

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Ticket médio</Text>
          <Text style={styles.metricValue}>{formatBRL(lead.ticketMedio)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Ciclo de compra</Text>
          <Text style={styles.metricValue}>{lead.cicloCompraDias} dias</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Última compra</Text>
          <Text style={styles.metricValue}>{formatRelativeDate(lead.ultimaCompraISO)}</Text>
        </View>
      </View>
    </Card>
  );
}

export function LeadsScreen() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LEADS;
    return LEADS.filter(
      (lead) => lead.name.toLowerCase().includes(q) || lead.email.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Screen>
      <SectionHeader title="Leads" subtitle={`${LEADS.length} leads no funil`} />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={colors.textFaint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por nome ou e-mail"
          placeholderTextColor={colors.textFaint}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LeadCard lead={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum lead encontrado.</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.body,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  identity: {
    flex: 1,
  },
  name: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    fontSize: 15,
  },
  email: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  metric: {
    flex: 1,
    gap: 2,
  },
  metricLabel: {
    ...typography.label,
    color: colors.textFaint,
    textTransform: 'uppercase',
    fontSize: 9,
    letterSpacing: 0.2,
  },
  metricValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    fontSize: 13,
  },
  empty: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
