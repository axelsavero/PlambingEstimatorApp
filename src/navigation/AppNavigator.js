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
import MateriScreen from '../screens/MateriScreen';
import RekapRABScreen from '../screens/RekapRABScreen';

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

// Custom Excel Sheet Tab Bar dengan Submenu Navigasi
function ExcelSheetTabBar({ state, navigation }) {
  const currentRouteName = state.routes[state.index]?.name;
  const [activeMenuCategory, setActiveMenuCategory] = useState(null);

  // Cari apakah rute saat ini berada dalam salah satu kategori submenu
  const getCurrentCategoryActive = (category) => {
    return category.screens.some((s) => s.name === currentRouteName);
  };

  const getActiveSubmenuLabel = (category) => {
    const found = category.screens.find((s) => s.name === currentRouteName);
    return found ? found.label : null;
  };

  const handleOpenCategory = (cat) => {
    setActiveMenuCategory(cat);
  };

  const handleSelectScreen = (screenName) => {
    setActiveMenuCategory(null);
    navigation.navigate(screenName);
  };

  const isHome = currentRouteName === 'HomeTab';
  const isMateri = currentRouteName === 'MateriScreen';
  const isRekap = currentRouteName === 'RekapRABScreen';

  return (
    <>
      <View style={styles.sheetTabBarContainer}>
        {/* Left branding with Estimator Logo */}
        <TouchableOpacity
          style={styles.sheetTabBarLeft}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Image
            source={require('../../assets/brand/logo_icon.png')}
            style={styles.brandLogoIcon}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.sheetBrandText}>ESTIMATOR</Text>
            <Text style={styles.sheetBrandSub}>RAB KONSTRUKSI</Text>
          </View>
        </TouchableOpacity>

        {/* Horizontal Navigation Items */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sheetTabScroll}
        >
          {/* 1. Beranda Tab */}
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeTab')}
            activeOpacity={0.8}
            style={[styles.sheetTabItem, isHome && styles.sheetTabItemActive]}
          >
            <Ionicons
              name={isHome ? 'home' : 'home-outline'}
              size={13}
              color={isHome ? colors.primaryDark : '#94A3B8'}
            />
            <Text style={[styles.sheetTabLabel, isHome && styles.sheetTabLabelActive]}>
              Beranda
            </Text>
            {isHome && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          {/* 2. Submenu Kategori: Pondasi, Beton, Atap */}
          {NAV_CATEGORIES.map((category) => {
            const isCatActive = getCurrentCategoryActive(category);
            const activeSubLabel = getActiveSubmenuLabel(category);

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleOpenCategory(category)}
                activeOpacity={0.8}
                style={[
                  styles.sheetTabItem,
                  styles.sheetTabCategory,
                  isCatActive && styles.sheetTabCategoryActive,
                ]}
              >
                <Ionicons
                  name={isCatActive ? category.activeIcon : category.icon}
                  size={13}
                  color={isCatActive ? colors.primary : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.sheetTabLabel,
                    isCatActive && styles.sheetTabCategoryLabelActive,
                  ]}
                >
                  {category.label}
                  {isCatActive && activeSubLabel ? ` : ${activeSubLabel}` : ''}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={11}
                  color={isCatActive ? colors.primary : '#94A3B8'}
                />
                {isCatActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}

          {/* 3. Panduan Teknis (Materi & Rumus) */}
          <TouchableOpacity
            onPress={() => navigation.navigate('MateriScreen')}
            activeOpacity={0.8}
            style={[
              styles.sheetTabItem,
              styles.sheetTabMateri,
              isMateri && styles.sheetTabMateriActive,
            ]}
          >
            <Ionicons
              name={isMateri ? 'book' : 'book-outline'}
              size={13}
              color={isMateri ? '#FFFFFF' : '#FECA38'}
            />
            <Text
              style={[
                styles.sheetTabLabel,
                styles.sheetTabLabelMateri,
                isMateri && styles.sheetTabLabelMateriActive,
              ]}
            >
              Panduan Teknis
            </Text>
            {isMateri && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          {/* 4. Rekapitulasi RAB Proyek */}
          <TouchableOpacity
            onPress={() => navigation.navigate('RekapRABScreen')}
            activeOpacity={0.8}
            style={[
              styles.sheetTabItem,
              styles.sheetTabRekap,
              isRekap && styles.sheetTabRekapActive,
            ]}
          >
            <Ionicons
              name={isRekap ? 'receipt' : 'receipt-outline'}
              size={13}
              color={isRekap ? '#FFFFFF' : '#FECA38'}
            />
            <Text
              style={[
                styles.sheetTabLabel,
                styles.sheetTabLabelRekap,
                isRekap && styles.sheetTabLabelRekapActive,
              ]}
            >
              Rekapitulasi RAB
            </Text>
            {isRekap && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Modal Dropdown Submenu */}
      <Modal
        visible={!!activeMenuCategory}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveMenuCategory(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setActiveMenuCategory(null)}
        >
          <View style={styles.submenuContainer}>
            <View style={styles.submenuHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons
                  name={activeMenuCategory?.activeIcon || 'grid'}
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.submenuHeaderTitle}>
                  Pilih Sub-Pekerjaan {activeMenuCategory?.label}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveMenuCategory(null)}
                style={styles.submenuCloseBtn}
              >
                <Ionicons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.submenuItemsList}>
              {activeMenuCategory?.screens.map((item) => {
                const isSelected = currentRouteName === item.name;
                return (
                  <TouchableOpacity
                    key={item.name}
                    style={[
                      styles.submenuItemCard,
                      isSelected && styles.submenuItemCardActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleSelectScreen(item.name)}
                  >
                    <View
                      style={[
                        styles.submenuCodeBadge,
                        isSelected && styles.submenuCodeBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.submenuCodeText,
                          isSelected && styles.submenuCodeTextActive,
                        ]}
                      >
                        {item.code}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.submenuItemTitle,
                          isSelected && styles.submenuItemTitleActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text style={styles.submenuItemDesc} numberOfLines={1}>
                        {item.desc}
                      </Text>
                    </View>

                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={colors.primary}
                      />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={15}
                        color="#CBD5E1"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
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
      tabBar={(props) => <ExcelSheetTabBar {...props} />}
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
      <Tab.Screen name="RekapRABScreen" component={RekapRABScreen} />
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
  sheetTabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Dark Charcoal header/tab bar sesuai style guide klien
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    height: 42,
    paddingHorizontal: 8,
    zIndex: 50,
  },
  sheetTabBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  brandLogoIcon: {
    width: 22,
    height: 22,
  },
  sheetBrandText: {
    color: '#FECA38', // Emas Estimator
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sheetBrandSub: {
    color: '#94A3B8',
    fontSize: 7.5,
    fontWeight: '600',
    letterSpacing: -0.2,
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
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 5,
    position: 'relative',
  },
  sheetTabItemActive: {
    backgroundColor: '#FFFFFF',
  },
  sheetTabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  sheetTabLabelActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    right: 8,
    height: 2.5,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  // Category Submenu Button Styles
  sheetTabCategory: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  sheetTabCategoryActive: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary,
  },
  sheetTabCategoryLabelActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  // Panduan Teknis & Rekap
  sheetTabMateri: {
    backgroundColor: '#2D2010',
    borderWidth: 1,
    borderColor: '#5B3908',
  },
  sheetTabMateriActive: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  sheetTabLabelMateri: {
    color: '#FECA38',
    fontWeight: '700',
  },
  sheetTabLabelMateriActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  sheetTabRekap: {
    backgroundColor: '#352309',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sheetTabRekapActive: {
    backgroundColor: colors.primary,
  },
  sheetTabLabelRekap: {
    color: '#FECA38',
    fontWeight: '700',
  },
  sheetTabLabelRekapActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  // Modal Submenu Popover
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submenuContainer: {
    width: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  submenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  submenuHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  submenuCloseBtn: {
    padding: 4,
  },
  submenuItemsList: {
    gap: 6,
  },
  submenuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 7,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submenuItemCardActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary,
  },
  submenuCodeBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submenuCodeBadgeActive: {
    backgroundColor: colors.primary,
  },
  submenuCodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  submenuCodeTextActive: {
    color: '#FFFFFF',
  },
  submenuItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  submenuItemTitleActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  submenuItemDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});