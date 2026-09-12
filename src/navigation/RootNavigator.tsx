import React from 'react';
import { Platform } from 'react-native';
import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme';
import { HomeScreen } from '@/screens/HomeScreen';
import { LeadsScreen } from '@/screens/LeadsScreen';
import { PipelineScreen } from '@/screens/PipelineScreen';
import { ConversationsScreen } from '@/screens/ConversationsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const linking = {
  prefixes: ['datacrazy-crm://'],
  config: {
    screens: {
      Inicio: '',
      Leads: 'leads',
      Pipelines: 'pipelines',
      Conversas: 'conversas',
      Perfil: 'perfil',
    },
  },
};

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.accentViolet,
    text: colors.textPrimary,
  },
};

const ICONS: Record<keyof RootTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Inicio: { active: 'home', inactive: 'home-outline' },
  Leads: { active: 'people', inactive: 'people-outline' },
  Pipelines: { active: 'git-network', inactive: 'git-network-outline' },
  Conversas: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Perfil: { active: 'person-circle', inactive: 'person-circle-outline' },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accentViolet,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: Platform.OS === 'ios' ? 86 : 64,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          },
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: '600',
          },
          tabBarBadgeStyle: {
            backgroundColor: colors.accentViolet,
            color: colors.background,
            fontSize: 8.5,
            fontWeight: '800',
          },
          tabBarIcon: ({ focused, color, size }) => {
            const icons = ICONS[route.name];
            return <Ionicons name={focused ? icons.active : icons.inactive} size={size - 2} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Início' }} />
        <Tab.Screen name="Leads" component={LeadsScreen} options={{ title: 'Leads' }} />
        <Tab.Screen
          name="Pipelines"
          component={PipelineScreen}
          options={{ title: 'Pipelines', tabBarBadge: 'NOVO' }}
        />
        <Tab.Screen name="Conversas" component={ConversationsScreen} options={{ title: 'Conversas' }} />
        <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
