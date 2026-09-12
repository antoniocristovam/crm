import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, padded = true, elevated = false }: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  elevated: {
    borderColor: colors.borderStrong,
    ...shadow.dragging,
  },
  padded: {
    padding: spacing.lg,
  },
});
