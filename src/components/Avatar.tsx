import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';
import { initials } from '@/utils/format';

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = colors.accentBlue, size = 40 }: AvatarProps) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${color}26`,
          borderColor: `${color}55`,
        },
      ]}
    >
      <Text style={[styles.initials, { color, fontSize: size * 0.36 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  initials: {
    ...typography.bodyStrong,
  },
});
