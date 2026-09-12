import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme';
import type { DashboardMetric } from '@/types/models';
import { Card } from './Card';

interface StatCardProps {
  metric: DashboardMetric;
}

export function StatCard({ metric }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={metric.icon as any} size={16} color={colors.accentViolet} />
      </View>
      <Text style={styles.value}>{metric.value}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {metric.label}
      </Text>
      <View style={styles.deltaRow}>
        <Ionicons
          name={metric.deltaPositive ? 'arrow-up' : 'arrow-down'}
          size={11}
          color={metric.deltaPositive ? colors.success : colors.danger}
        />
        <Text style={[styles.delta, { color: metric.deltaPositive ? colors.success : colors.danger }]}>
          {metric.delta}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 156,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: `${colors.accentViolet}1F`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  delta: {
    ...typography.caption,
  },
});
