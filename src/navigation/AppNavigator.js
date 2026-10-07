import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
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
import MateriScreen from '../screens/MateriScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Definisi Kategori Submenu Navigasi Kalkulator
const NAV_CATEGORIES = [
  {
    id: 'pondasi',
    label: 'Pondasi',
    icon: 'layers-outline',
    activeIcon: 'layers',
    screens: [
      { name: 'PondasiScreen', label: 'Pondasi Batu Belah', code: '02', icon: 'layers-outline', desc: 'Galian, aanstamping, batu kali & urukan' },
      { name: 'FootPlateScreen', label: 'Foot Plate (Tapak)', code: '03', icon: 'grid-outline', desc: 'Pondasi telapak 6 tipe, pedestal & cor' },
    ],
  },
  {
    id: 'beton',
    label: 'Beton',
    icon: 'business-outline',
    activeIcon: 'business',
    screens: [
      { name: 'SloofScreen', label: 'Sloof Beton', code: '04', icon: 'remove-outline', desc: 'Tulangan pokok, sengkang & cor K-275' },
      { name: 'KolomScreen', label: 'Kolom Beton', code: '05', icon: 'business-outline', desc: 'Dimensi kolom, pembesian & bekisting' },
      { name: 'BalokScreen', label: 'Balok Beton', code: '06', icon: 'cube-outline', desc: 'Bentang balok, tulangan lentur & cor' },
    ],
  },
  {
    id: 'atap',
    label: 'Atap',
    icon: 'triangle-outline',
    activeIcon: 'triangle',
    screens: [
      { name: 'AtapPelanaScreen', label: 'Atap Pelana C75', code: '11', icon: 'triangle-outline', desc: 'Kuda-kuda C75, reng, genteng metal pasir' },
      { name: 'AtapLimasScreen', label: 'Atap Limas', code: '11.A', icon: 'diamond-outline', desc: 'Geometri limas trapesium, jurai & nok' },
    ],
  },
];

// Tab bar ringkas dengan submenu kalkulator per kategori
function MainTabBar({ state, navigation }) {
  const currentRouteName = state.routes[state.index]?.name;
  const [activeMenuCategory, setActiveMenuCategory] = useState(null);
  const insets = useSafeAreaInsets();

  const findActiveScreen = (category) =>
    category.screens.find((s) => s.name === currentRouteName);

  const handleSelectScreen = (screenName) => {
    setActiveMenuCategory(null);
    navigation.navigate(screenName);
  };

  const isHome = currentRouteName === 'HomeTab';
  const isMateri = currentRouteName === 'MateriScreen';

  const renderTab = ({ key, label, icon, active, onPress, chevron }) => (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tabItem, active && styles.tabItemActive]}
    >
      <Ionicons name={icon} size={15} color={active ? colors.primary : colors.textSecondary} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
      {chevron ? (
        <Ionicons name="chevron-down" size={12} color={active ? colors.primary : colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.tabBar, { height: 48 + insets.bottom, paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.brand}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Image
            source={require('../../assets/brand/logo_icon.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>ESTIMATOR</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {renderTab({
            key: 'home',
            label: 'Beranda',
            icon: isHome ? 'home' : 'home-outline',
            active: isHome,
            onPress: () => navigation.navigate('HomeTab'),
          })}
          {renderTab({
            key: 'materi',
            label: 'Panduan Teknis',
            icon: isMateri ? 'book' : 'book-outline',
            active: isMateri,
            onPress: () => navigation.navigate('MateriScreen'),
          })}

          <View style={styles.tabDivider} />

          {NAV_CATEGORIES.map((category) => {
            const activeScreen = findActiveScreen(category);
            return renderTab({
              key: category.id,
              label: activeScreen ? activeScreen.label : category.label,
              icon: activeScreen ? category.activeIcon : category.icon,
              active: !!activeScreen,
              onPress: () => setActiveMenuCategory(category),
              chevron: true,
            });
          })}
        </ScrollView>
      </View>

      {/* Submenu kalkulator */}
      <Modal
        visible={!!activeMenuCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveMenuCategory(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveMenuCategory(null)}>
          <View style={styles.submenu}>
            <Text style={styles.submenuTitle}>{activeMenuCategory?.label}</Text>
            {activeMenuCategory?.screens.map((item) => {
              const isSelected = currentRouteName === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.submenuItem, isSelected && styles.submenuItemActive]}
                  activeOpacity={0.7}
                  onPress={() => handleSelectScreen(item.name)}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.submenuItemTitle, isSelected && styles.submenuItemTitleActive]}>
                      {item.label}
                    </Text>
                    <Text style={styles.submenuItemDesc} numberOfLines={1}>
                      {item.desc}
                    </Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={16} color={colors.primary} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MainTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="PondasiScreen" component={PondasiScreen} />
      <Tab.Screen name="FootPlateScreen" component={FootPlateScreen} />
      <Tab.Screen name="SloofScreen" component={SloofScreen} />
      <Tab.Screen name="KolomScreen" component={KolomScreen} />
      <Tab.Screen name="BalokScreen" component={BalokScreen} />
      <Tab.Screen name="AtapPelanaScreen" component={AtapPelanaScreen} />
      <Tab.Screen name="AtapLimasScreen" component={AtapLimasScreen} />
      <Tab.Screen name="MateriScreen" component={MateriScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [sessionActive, setSessionActive] = useState(isSessionValid());

  const handleStartSession = () => {
    startSession();
    setSessionActive(true);
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
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
    marginRight: 4,
    borderRightWidth: 1,
    borderRightColor: colors.hairline,
  },
  brandLogo: {
    width: 22,
    height: 22,
  },
  brandText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.primary,
  },
  tabScroll: {
    alignItems: 'center',
    gap: 2,
    paddingLeft: 4,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  tabDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.hairline,
    marginHorizontal: 6,
  },

  // Submenu kalkulator
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submenu: {
    width: 320,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  submenuTitle: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
  },
  submenuItemActive: {
    backgroundColor: colors.primaryLight,
  },
  submenuItemTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  submenuItemTitleActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  submenuItemDesc: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
