import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { StatCard } from '@/components/StatCard';
import { BarChart } from '@/components/BarChart';
import { SegmentedBar } from '@/components/SegmentedBar';
import { Avatar } from '@/components/Avatar';
import {
  ATTENDANT_RANKING,
  CURRENT_USER,
  DASHBOARD_METRICS,
  PIPELINE_DISTRIBUTION,
  PRODUCT_RANKING,
  REVENUE_CHART,
} from '@/data/mock';
import { formatBRL } from '@/utils/format';

const STAGE_COLORS = [colors.stageEspera, colors.stagePre, colors.stageCarrinho, colors.stageCheckout];

export function HomeScreen() {
  const firstName = CURRENT_USER.name.split(' ')[0];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title={`Olá, ${firstName}`} subtitle="Aqui está o resumo do seu funil hoje" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsRow}
        >
          {DASHBOARD_METRICS.map((metric) => (
            <StatCard key={metric.id} metric={metric} />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Card>
            <Text style={styles.cardTitle}>Faturamento (últimos 7 meses)</Text>
            <Text style={styles.cardSubtitle}>Em milhares de reais</Text>
            <View style={styles.chartSpace}>
              <BarChart data={REVENUE_CHART} />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Text style={styles.cardTitle}>Distribuição do pipeline</Text>
            <Text style={styles.cardSubtitle}>Negócios ativos por etapa</Text>
            <View style={styles.chartSpace}>
              <SegmentedBar
                segments={PIPELINE_DISTRIBUTION.map((point, index) => ({
                  ...point,
                  color: STAGE_COLORS[index] ?? colors.accentBlue,
                }))}
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Text style={styles.cardTitle}>Ranking de produtos</Text>
            <View style={styles.list}>
              {PRODUCT_RANKING.map((product, index) => (
                <View key={product.id} style={styles.rankRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankBadgeText}>{index + 1}</Text>
                  </View>
                  <View style={styles.rankInfo}>
                    <Text style={styles.rankName}>{product.name}</Text>
                    <Text style={styles.rankMeta}>{product.sales} vendas</Text>
                  </View>
                  <Text style={styles.rankValue}>{formatBRL(product.revenue)}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Card>
            <Text style={styles.cardTitle}>Ranking de atendentes</Text>
            <View style={styles.list}>
              {ATTENDANT_RANKING.map((attendant) => (
                <View key={attendant.id} style={styles.rankRow}>
                  <Avatar name={attendant.name} size={32} color={colors.accentBlue} />
                  <View style={styles.rankInfo}>
                    <Text style={styles.rankName}>{attendant.name}</Text>
                    <Text style={styles.rankMeta}>{attendant.deals} negócios fechados</Text>
                  </View>
                  <Text style={styles.rankValue}>{formatBRL(attendant.revenue)}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  metricsRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  lastSection: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  chartSpace: {
    marginTop: spacing.lg,
  },
  list: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    ...typography.bodyStrong,
    color: colors.accentViolet,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  rankMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  rankValue: {
    ...typography.bodyStrong,
    color: colors.accentViolet,
  },
});
