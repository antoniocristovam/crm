import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { ChartPoint } from '@/types/models';

interface BarChartProps {
  data: ChartPoint[];
  height?: number;
  barColor?: string;
  suffix?: string;
}

export function BarChart({ data, height = 120, barColor = colors.accentViolet, suffix = '' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.wrap, { height: height + 24 }]}>
      {data.map((point, index) => {
        const barHeight = Math.max((point.value / max) * height, 4);
        const isLast = index === data.length - 1;
        return (
          <View key={point.label} style={styles.column}>
            <Text style={styles.value}>{Math.round(point.value)}{suffix}</Text>
            <View
              style={[
                styles.bar,
                {
                  height: barHeight,
                  backgroundColor: isLast ? barColor : `${barColor}55`,
                },
              ]}
            />
            <Text style={styles.label}>{point.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '58%',
    borderRadius: radius.sm,
  },
  value: {
    ...typography.caption,
    color: colors.textFaint,
    marginBottom: 4,
    fontSize: 9.5,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 10,
  },
});
