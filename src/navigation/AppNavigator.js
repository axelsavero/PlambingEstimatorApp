import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { isSessionValid, startSession, clearAppSession } from '../utils/sessionManager';

// Screens
import DisclaimerScreen from '../screens/DisclaimerScreen';
import HomeScreen from '../screens/HomeScreen';
import PondasiScreen from '../screens/PondasiScreen';
import FootPlateScreen from '../screens/FootPlateScreen';
import SloofScreen from '../screens/SloofScreen';
import KolomScreen from '../screens/KolomScreen';
import BalokScreen from '../screens/BalokScreen';
import AtapPelanaScreen from '../screens/AtapPelanaScreen';
import AtapLimasScreen from '../screens/AtapLimasScreen';
import RekapRABScreen from '../screens/RekapRABScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Excel Sheet Tab Bar (Landscape horizontal scrollable)
function ExcelSheetTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.sheetTabBarContainer}>
      {/* Left branding with clean vector blue cube */}
      <TouchableOpacity
        style={styles.sheetTabBarLeft}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('HomeTab')}
      >
        <View style={styles.vectorCubeBadge}>
          <Ionicons name="cube" size={13} color="#38bdf8" />
        </View>
        <Text style={styles.sheetBrandText}>RABPro</Text>
      </TouchableOpacity>

      {/* Horizontal scrolling sheet tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sheetTabScroll}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.tabBarLabel || options.title || route.name;
          const icon = options.tabBarIconName || 'document-text-outline';
          const isRekap = route.name === 'RekapRABScreen';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[
                styles.sheetTabItem,
                isFocused && styles.sheetTabItemActive,
                isRekap && styles.sheetTabRekap,
                isRekap && isFocused && styles.sheetTabRekapActive,
              ]}
            >
              <Ionicons
                name={icon}
                size={13}
                color={
                  isRekap
                    ? isFocused
                      ? '#ffffff'
                      : '#38bdf8'
                    : isFocused
                    ? colors.primaryDark
                    : '#94a3b8'
                }
              />
              <Text
                style={[
                  styles.sheetTabLabel,
                  isFocused && styles.sheetTabLabelActive,
                  isRekap && (isFocused ? styles.sheetTabLabelRekapActive : styles.sheetTabLabelRekap),
                ]}
              >
                {label}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Main Tab Navigator (Tanpa Disclaimer di sub menu nav bar)
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <ExcelSheetTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIconName: 'grid-outline',
        }}
      />
      <Tab.Screen
        name="PondasiScreen"
        component={PondasiScreen}
        options={{
          tabBarLabel: 'Pondasi',
          tabBarIconName: 'layers-outline',
        }}
      />
      <Tab.Screen
        name="FootPlateScreen"
        component={FootPlateScreen}
        options={{
          tabBarLabel: 'Foot Plate',
          tabBarIconName: 'grid-outline',
        }}
      />
      <Tab.Screen
        name="SloofScreen"
        component={SloofScreen}
        options={{
          tabBarLabel: 'Sloof',
          tabBarIconName: 'remove-outline',
        }}
      />
      <Tab.Screen
        name="KolomScreen"
        component={KolomScreen}
        options={{
          tabBarLabel: 'Kolom',
          tabBarIconName: 'business-outline',
        }}
      />
      <Tab.Screen
        name="BalokScreen"
        component={BalokScreen}
        options={{
          tabBarLabel: 'Balok',
          tabBarIconName: 'cube-outline',
        }}
      />
      <Tab.Screen
        name="AtapPelanaScreen"
        component={AtapPelanaScreen}
        options={{
          tabBarLabel: 'Atap Pelana',
          tabBarIconName: 'triangle-outline',
        }}
      />
      <Tab.Screen
        name="AtapLimasScreen"
        component={AtapLimasScreen}
        options={{
          tabBarLabel: 'Atap Limas',
          tabBarIconName: 'diamond-outline',
        }}
      />
      <Tab.Screen
        name="RekapRABScreen"
        component={RekapRABScreen}
        options={{
          tabBarLabel: 'Rekap RAB',
          tabBarIconName: 'receipt-outline',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {

  const [sessionActive, setSessionActive] = useState(isSessionValid());

  const handleStartSession = () => {
    startSession();
    setSessionActive(true);
  };

  const handleClearSession = () => {
    clearAppSession();
    setSessionActive(false);
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!sessionActive ? (
        <Stack.Screen name="DisclaimerIntro">
          {(props) => (
            <DisclaimerScreen
              {...props}
              onContinue={handleStartSession}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabs
                {...props}
                screenProps={{ onClearSession: handleClearSession }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="DisclaimerScreen">
            {(props) => (
              <DisclaimerScreen
                {...props}
                onClearSession={handleClearSession}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  sheetTabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#0284c7',
    height: 40,
    paddingHorizontal: 6,
  },
  sheetTabBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  vectorCubeBadge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: '#0369a1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBrandText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sheetTabScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    gap: 4,
  },
  sheetTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e293b',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 4,
    position: 'relative',
  },
  sheetTabItemActive: {
    backgroundColor: '#ffffff',
  },
  sheetTabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  sheetTabLabelActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -5,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.primary,
  },
  sheetTabRekap: {
    backgroundColor: '#0369a1',
  },
  sheetTabRekapActive: {
    backgroundColor: '#0284c7',
  },
  sheetTabLabelRekap: {
    color: '#e0f2fe',
    fontWeight: '700',
  },
  sheetTabLabelRekapActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
});