import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, stageMeta, typography } from '@/theme';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { TagPill } from '@/components/Tag';
import { Toast } from '@/components/Toast';
import { INITIAL_DEALS } from '@/data/mock';
import { updateDealStage } from '@/api/deals';
import type { Deal, StageId } from '@/types/models';
import { formatBRL } from '@/utils/format';

type StageMetaItem = (typeof stageMeta)[number];
type ColumnRect = { id: StageId; x: number; width: number };
type ToastState = { visible: boolean; message: string; tone: 'danger' | 'success' };

const COLUMN_GAP = spacing.md;

export function PipelineScreen() {
  const { width } = useWindowDimensions();
  const columnWidth = width * 0.78;

  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [draggingDeal, setDraggingDeal] = useState<Deal | null>(null);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', tone: 'danger' });

  // Shared values (UI thread) que orquestram o arraste sem round-trip para o JS thread.
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startPageX = useSharedValue(0);
  const startPageY = useSharedValue(0);
  const ghostWidth = useSharedValue(columnWidth - spacing.lg * 2);
  const activeDealId = useSharedValue<string | null>(null);
  const hoveredStageId = useSharedValue<string | null>(null);
  const columnRects = useSharedValue<ColumnRect[]>([]);
  const dragLayerOrigin = useSharedValue({ x: 0, y: 0 });

  const boardRef = useRef<View>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Deal[]> = {};
    for (const stage of stageMeta) map[stage.id] = [];
    for (const deal of deals) {
      map[deal.stageId]?.push(deal);
    }
    return map;
  }, [deals]);

  const registerColumnRect = useCallback(
    (id: StageId, rect: { x: number; width: number }) => {
      const next = columnRects.value.filter((entry) => entry.id !== id);
      next.push({ id, ...rect });
      columnRects.value = next;
    },
    [columnRects]
  );

  const handleDragStart = useCallback((deal: Deal) => {
    setDraggingDeal(deal);
  }, []);

  // Ponto único de mudança de etapa: atualização otimista + rollback em erro.
  const handleDrop = useCallback(async (dealId: string, fromStage: StageId, toStage: StageId | null) => {
    setDraggingDeal(null);

    if (!toStage || toStage === fromStage) return;

    setDeals((prev) => prev.map((deal) => (deal.id === dealId ? { ...deal, stageId: toStage } : deal)));

    try {
      // Chamada real de API
      await updateDealStage(dealId, toStage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setDeals((prev) => prev.map((deal) => (deal.id === dealId ? { ...deal, stageId: fromStage } : deal)));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setToast({
        visible: true,
        message: 'Não foi possível mover o negócio. Tente novamente.',
        tone: 'danger',
      });
    }
  }, []);

  return (
    <Screen edges={['top']}>
      <SectionHeader
        title="Pipelines"
        subtitle={`${deals.length} negócios ativos · segure e arraste para mudar de etapa`}
      />

      <View
        ref={boardRef}
        style={styles.board}
        onLayout={() => {
          boardRef.current?.measureInWindow((x, y) => {
            dragLayerOrigin.value = { x, y };
          });
        }}
      >
        <ScrollView
          horizontal
          scrollEnabled={!draggingDeal}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={columnWidth + COLUMN_GAP}
          snapToAlignment="start"
          contentContainerStyle={styles.columnsRow}
        >
          {stageMeta.map((stage) => (
            <Column
              key={stage.id}
              stage={stage}
              width={columnWidth}
              deals={grouped[stage.id] ?? []}
              scrollEnabled={!draggingDeal}
              hoveredStageId={hoveredStageId}
              onLayoutRect={(rect) => registerColumnRect(stage.id, rect)}
            >
              {(grouped[stage.id] ?? []).map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  translateX={translateX}
                  translateY={translateY}
                  startPageX={startPageX}
                  startPageY={startPageY}
                  ghostWidth={ghostWidth}
                  activeDealId={activeDealId}
                  hoveredStageId={hoveredStageId}
                  columnRects={columnRects}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDrop}
                />
              ))}
            </Column>
          ))}
        </ScrollView>

        <DragLayer
          deal={draggingDeal}
          translateX={translateX}
          translateY={translateY}
          startPageX={startPageX}
          startPageY={startPageY}
          ghostWidth={ghostWidth}
          activeDealId={activeDealId}
          dragLayerOrigin={dragLayerOrigin}
        />
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        tone={toast.tone}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Coluna
// ---------------------------------------------------------------------------

interface ColumnProps {
  stage: StageMetaItem;
  width: number;
  deals: Deal[];
  scrollEnabled: boolean;
  hoveredStageId: SharedValue<string | null>;
  onLayoutRect: (rect: { x: number; width: number }) => void;
  children: React.ReactNode;
}

function Column({ stage, width, deals, scrollEnabled, hoveredStageId, onLayoutRect, children }: ColumnProps) {
  const viewRef = useRef<Animated.View>(null);
  const total = deals.reduce((sum, deal) => sum + deal.value, 0);

  const highlightStyle = useAnimatedStyle(() => {
    const isHovered = hoveredStageId.value === stage.id;
    return {
      borderColor: isHovered ? stage.color : colors.border,
      backgroundColor: isHovered ? `${stage.color}14` : colors.surfaceAlt,
    };
  });

  return (
    <Animated.View
      ref={viewRef}
      style={[styles.column, { width }, highlightStyle]}
      onLayout={() => {
        viewRef.current?.measureInWindow((x: number, _y: number, w: number) => onLayoutRect({ x, width: w }));
      }}
    >
      <View style={styles.columnHeader}>
        <View style={styles.columnTitleRow}>
          <View style={[styles.dot, { backgroundColor: stage.color }]} />
          <Text style={styles.columnTitle} numberOfLines={1}>
            {stage.name}
          </Text>
        </View>
        <View style={styles.columnCountBadge}>
          <Text style={styles.columnCount}>{deals.length}</Text>
        </View>
      </View>
      <Text style={styles.columnTotal}>{formatBRL(total)}</Text>

      <ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.columnBody}
      >
        {children}
        {deals.length === 0 && (
          <View style={styles.emptyColumn}>
            <Text style={styles.emptyColumnText}>Arraste um negócio para cá</Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Card arrastável
// ---------------------------------------------------------------------------

interface DealCardProps {
  deal: Deal;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  startPageX: SharedValue<number>;
  startPageY: SharedValue<number>;
  ghostWidth: SharedValue<number>;
  activeDealId: SharedValue<string | null>;
  hoveredStageId: SharedValue<string | null>;
  columnRects: SharedValue<ColumnRect[]>;
  onDragStart: (deal: Deal) => void;
  onDragEnd: (dealId: string, fromStage: StageId, toStage: StageId | null) => void;
}

function DealCard({
  deal,
  translateX,
  translateY,
  startPageX,
  startPageY,
  ghostWidth,
  activeDealId,
  hoveredStageId,
  columnRects,
  onDragStart,
  onDragEnd,
}: DealCardProps) {
  const animatedRef = useAnimatedRef<Animated.View>();

  const pan = Gesture.Pan()
    .activateAfterLongPress(150)
    .onStart(() => {
      const measured = measure(animatedRef);
      if (measured) {
        startPageX.value = measured.pageX;
        startPageY.value = measured.pageY;
        ghostWidth.value = measured.width;
      }
      translateX.value = 0;
      translateY.value = 0;
      activeDealId.value = deal.id;
      runOnJS(onDragStart)(deal);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Coluna de destino detectada por posição absoluta do dedo (absoluteX)
      // contra os retângulos de cada coluna, medidos via onLayout — tudo
      // resolvido aqui dentro do worklet, sem tocar o JS thread por frame.
      const pointerX = event.absoluteX;
      const rects = columnRects.value;
      let matched: string | null = null;
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        if (pointerX >= rect.x && pointerX <= rect.x + rect.width) {
          matched = rect.id;
          break;
        }
      }
      hoveredStageId.value = matched;
    })
    .onEnd(() => {
      const destination = hoveredStageId.value as StageId | null;
      hoveredStageId.value = null;
      runOnJS(onDragEnd)(deal.id, deal.stageId, destination);
    })
    .onFinalize(() => {
      activeDealId.value = null;
      translateX.value = 0;
      translateY.value = 0;
    });

  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: activeDealId.value === deal.id ? 0 : 1,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View ref={animatedRef} style={visibilityStyle}>
        <DealCardBody deal={deal} />
      </Animated.View>
    </GestureDetector>
  );
}

function DealCardBody({ deal, elevated }: { deal: Deal; elevated?: boolean }) {
  return (
    <Card style={styles.dealCard} elevated={elevated}>
      <Text style={styles.dealName} numberOfLines={1}>
        {deal.name}
      </Text>

      {deal.tags.length > 0 && (
        <View style={styles.dealTagsRow}>
          {deal.tags.map((tag) => (
            <TagPill key={tag} kind={tag} />
          ))}
        </View>
      )}

      <View style={styles.dealFooterRow}>
        <View style={styles.dealAttendantRow}>
          <Avatar name={deal.attendant} size={22} />
          <Text style={styles.dealAttendant} numberOfLines={1}>
            {deal.attendant}
          </Text>
        </View>
        <Text style={styles.dealValue}>{formatBRL(deal.value)}</Text>
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Card "fantasma" que segue o dedo durante o arraste
// ---------------------------------------------------------------------------

interface DragLayerProps {
  deal: Deal | null;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  startPageX: SharedValue<number>;
  startPageY: SharedValue<number>;
  ghostWidth: SharedValue<number>;
  activeDealId: SharedValue<string | null>;
  dragLayerOrigin: SharedValue<{ x: number; y: number }>;
}

function DragLayer({
  deal,
  translateX,
  translateY,
  startPageX,
  startPageY,
  ghostWidth,
  activeDealId,
  dragLayerOrigin,
}: DragLayerProps) {
  const style = useAnimatedStyle(() => {
    if (activeDealId.value === null) {
      return { opacity: 0 };
    }
    return {
      opacity: 1,
      width: ghostWidth.value,
      transform: [
        { translateX: startPageX.value - dragLayerOrigin.value.x + translateX.value },
        { translateY: startPageY.value - dragLayerOrigin.value.y + translateY.value },
        { scale: 1.03 },
      ],
    };
  });

  if (!deal) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.dragLayer, style]}>
      <DealCardBody deal={deal} elevated />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  board: {
    flex: 1,
  },
  columnsRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: COLUMN_GAP,
  },
  column: {
    borderWidth: 1,
    borderRadius: 18,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  columnTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    fontSize: 13.5,
    flexShrink: 1,
  },
  columnCountBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  columnTotal: {
    ...typography.caption,
    color: colors.accentViolet,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  columnBody: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  emptyColumn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyColumnText: {
    ...typography.caption,
    color: colors.textFaint,
  },
  dealCard: {
    gap: spacing.sm,
  },
  dealName: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    fontSize: 13.5,
  },
  dealTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  dealFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  dealAttendantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  dealAttendant: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
    flexShrink: 1,
  },
  dealValue: {
    ...typography.bodyStrong,
    color: colors.accentViolet,
    fontSize: 13,
  },
  dragLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
