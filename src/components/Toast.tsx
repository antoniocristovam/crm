import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme';

interface ToastProps {
  visible: boolean;
  message: string;
  tone?: 'danger' | 'success';
  onHide: () => void;
  durationMs?: number;
}

export function Toast({ visible, message, tone = 'danger', onHide, durationMs = 2600 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onHide]);

  if (!visible) return null;

  const color = tone === 'danger' ? colors.danger : colors.success;

  return (
    <Animated.View
      entering={FadeInDown.duration(180)}
      exiting={FadeOutDown.duration(160)}
      style={[styles.toast, { borderColor: `${color}55` }]}
    >
      <Ionicons name={tone === 'danger' ? 'alert-circle' : 'checkmark-circle'} size={16} color={color} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...typography.body,
  },
  text: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    flex: 1,
  },
});
