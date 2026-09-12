import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '@/theme';
import { TAG_LABELS, TAG_STYLES } from '@/data/mock';
import type { TagKind } from '@/types/models';

interface TagPillProps {
  kind: TagKind;
}

export function TagPill({ kind }: TagPillProps) {
  const style = TAG_STYLES[kind];
  return (
    <View style={[styles.pill, { backgroundColor: style.bg }]}>
      <Text style={[styles.label, { color: style.fg }]} numberOfLines={1}>
        {TAG_LABELS[kind]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    fontSize: 10.5,
  },
});
