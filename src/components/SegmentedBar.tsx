import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { ChartPoint } from '@/types/models';

interface Segment extends ChartPoint {
  color: string;
}

interface SegmentedBarProps {
  segments: Segment[];
}

export function SegmentedBar({ segments }: SegmentedBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <View>
      <View style={styles.track}>
        {segments.map((segment) => (
          <View
            key={segment.label}
            style={{
              flex: segment.value || 0.0001,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: segment.color }]} />
            <Text style={styles.legendLabel}>{segment.label}</Text>
            <Text style={styles.legendValue}>
              {segment.value} · {Math.round((segment.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  legend: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  legendValue: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
