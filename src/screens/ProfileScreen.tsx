import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { CURRENT_USER, SETTINGS_ENTRIES } from '@/data/mock';
import type { SettingsEntry } from '@/types/models';

function SettingsRow({ entry, isLast }: { entry: SettingsEntry; isLast: boolean }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const isPushToggle = entry.id === 's3';

  return (
    <View style={[styles.settingsRow, !isLast && styles.settingsRowDivider]}>
      <View style={styles.settingsIconWrap}>
        <Ionicons name={entry.icon as any} size={18} color={colors.accentBlue} />
      </View>
      <View style={styles.settingsTextCol}>
        <View style={styles.settingsLabelRow}>
          <Text style={styles.settingsLabel}>{entry.label}</Text>
          {entry.badge && (
            <View style={styles.readOnlyBadge}>
              <Text style={styles.readOnlyBadgeText}>{entry.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.settingsDescription}>{entry.description}</Text>
      </View>
      {isPushToggle ? (
        <Switch
          value={pushEnabled}
          onValueChange={setPushEnabled}
          trackColor={{ false: colors.border, true: `${colors.accentViolet}88` }}
          thumbColor={pushEnabled ? colors.accentViolet : colors.textFaint}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      )}
    </View>
  );
}

export function ProfileScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Perfil" />

        <View style={styles.section}>
          <Card style={styles.identityCard}>
            <Avatar name={CURRENT_USER.name} size={56} color={CURRENT_USER.avatarColor} />
            <Text style={styles.name}>{CURRENT_USER.name}</Text>
            <Text style={styles.role}>{CURRENT_USER.role}</Text>
            <Text style={styles.email}>{CURRENT_USER.email}</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferências e recursos</Text>
          <Card padded={false}>
            {SETTINGS_ENTRIES.map((entry, index) => (
              <SettingsRow key={entry.id} entry={entry} isLast={index === SETTINGS_ENTRIES.length - 1} />
            ))}
          </Card>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Card style={styles.logoutCard}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>Sair da conta</Text>
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
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  lastSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textFaint,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  identityCard: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xl,
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  role: {
    ...typography.caption,
    color: colors.accentViolet,
    fontWeight: '700',
  },
  email: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  settingsRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: `${colors.accentBlue}1F`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTextCol: {
    flex: 1,
    gap: 2,
  },
  settingsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingsLabel: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  settingsDescription: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  readOnlyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readOnlyBadgeText: {
    ...typography.label,
    color: colors.textFaint,
    fontSize: 9,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.bodyStrong,
    color: colors.danger,
  },
});
