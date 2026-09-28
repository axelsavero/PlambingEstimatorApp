import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getCalculations } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [recentCount, setRecentCount] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCalculations().then((data) => setRecentCount(data.length));
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="construct" size={26} color="#ffffff" />
            </View>
            <View style={styles.badgeOffline}>
              <Ionicons name="cloud-offline-outline" size={14} color="#10b981" />
              <Text style={styles.badgeOfflineText}>100% Offline</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>ESTIMATOR PRO</Text>
          <Text style={styles.heroSubtitle}>
            Panduan Teknis & Kalkulator Cepat Konstruksi & Plambing
          </Text>
          <Text style={styles.heroStandard}>Acuan Standar SNI & AHSP PUPR</Text>
        </View>

        {/* 2 Tombol Menu Utama (Sesuai Wireframe PDF) */}
        <View style={styles.mainNavSection}>
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.secondary }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MateriTab')}
          >
            <View style={styles.mainBtnIconWrap}>
              <Ionicons name="book" size={28} color="#ffffff" />
            </View>
            <View style={styles.mainBtnTextWrap}>
              <Text style={styles.mainBtnTitle}>PANDUAN TEKNIS</Text>
              <Text style={styles.mainBtnDesc}>
                Volume Pekerjaan, AHSP, RAB, & Kurva S
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('KalkulatorTab')}
          >
            <View style={styles.mainBtnIconWrap}>
              <Ionicons name="calculator" size={28} color="#ffffff" />
            </View>
            <View style={styles.mainBtnTextWrap}>
              <Text style={styles.mainBtnTitle}>ESTIMATOR OTOMATIS</Text>
              <Text style={styles.mainBtnDesc}>
                Kalkulator Cepat Siap Hitung di Lapangan
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Status Riwayat Singkat */}
        <TouchableOpacity
          style={styles.historyBanner}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('RiwayatTab')}
        >
          <View style={styles.historyLeft}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={styles.historyText}>
              Riwayat Tersimpan: <Text style={styles.historyCount}>{recentCount} perhitungan</Text>
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>

        {/* Menu Cepat Pintasan */}
        <Text style={styles.sectionHeader}>Kalkulator Pintas (Paling Sering Digunakan)</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('KalkulatorTab', { screen: 'SlopeCalc' })}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="trending-down" size={24} color="#0284c7" />
            </View>
            <Text style={styles.quickCardTitle}>Kemiringan Pipa</Text>
            <Text style={styles.quickCardSub}>Slope 1% - 2% SNI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('KalkulatorTab', { screen: 'SepticTankCalc' })}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="cube-outline" size={24} color="#d97706" />
            </View>
            <Text style={styles.quickCardTitle}>Tangki Septik</Text>
            <Text style={styles.quickCardSub}>Dimensi & Resapan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('KalkulatorTab', { screen: 'FixtureUnitCalc' })}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="water-outline" size={24} color="#16a34a" />
            </View>
            <Text style={styles.quickCardTitle}>UBAP & Pipa</Text>
            <Text style={styles.quickCardSub}>Diameter Pipa SNI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => navigation.navigate('KalkulatorTab', { screen: 'MaterialEst' })}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="cash-outline" size={24} color="#9333ea" />
            </View>
            <Text style={styles.quickCardTitle}>Estimasi RAB</Text>
            <Text style={styles.quickCardSub}>Batang Pipa & Biaya</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={22} color="#0284c7" />
          <Text style={styles.infoText}>
            Seluruh formula matematika didesain agar dapat bekerja secara langsung tanpa sambungan internet (offline-first).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOffline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeOfflineText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 20,
  },
  heroStandard: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '600',
    marginTop: 8,
  },
  mainNavSection: {
    gap: 12,
    marginBottom: 16,
  },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  mainBtnIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  mainBtnTextWrap: {
    flex: 1,
  },
  mainBtnTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  mainBtnDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  historyBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyText: {
    fontSize: 13,
    color: colors.text,
  },
  historyCount: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  quickCardSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#e0f2fe',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#0369a1',
    lineHeight: 18,
  },
});
