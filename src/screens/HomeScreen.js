import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { formatRupiah } from '../utils/constructionCalculations';
import { generateCurrentRekapRAB } from '../utils/rabStorage';
import RABProLogo from '../components/RABProLogo';

const MENU_ITEMS = [
  {
    id: 'pondasi',
    screen: 'PondasiScreen',
    code: '02',
    title: 'Pondasi Batu Belah',
    subtitle: 'Galian tanah, aanstamping, pasangan batu belah & urukan',
    icon: 'layers',
    color: '#d97706',
    bgColor: '#fef3c7',
  },
  {
    id: 'footplate',
    screen: 'FootPlateScreen',
    code: '03',
    title: 'Pondasi Tapak (Foot Plate)',
    subtitle: '6 tipe pembesian, bekisting pedestal & cor beton K-300',
    icon: 'grid',
    color: '#0284c7',
    bgColor: '#e0f2fe',
  },
  {
    id: 'sloof',
    screen: 'SloofScreen',
    code: '04',
    title: 'Struktur Sloof Beton',
    subtitle: 'Tulangan utama & support, sengkang tumpuan/lapangan',
    icon: 'remove',
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  {
    id: 'kolom',
    screen: 'KolomScreen',
    code: '05',
    title: 'Struktur Kolom Beton',
    subtitle: 'Dimensi kolom, pembesian utama & support, bekisting kolom',
    icon: 'business',
    color: '#9333ea',
    bgColor: '#f3e8ff',
  },
  {
    id: 'balok',
    screen: 'BalokScreen',
    code: '06',
    title: 'Struktur Balok Beton',
    subtitle: 'Penulangan lentur balok, sengkang, bekisting & cor K-275',
    icon: 'cube',
    color: '#0891b2',
    bgColor: '#cffafe',
  },
  {
    id: 'atap_pelana',
    screen: 'AtapPelanaScreen',
    code: '11',
    title: 'Atap Pelana Baja Ringan',
    subtitle: 'Kuda-kuda profil C75, reng, genteng metal pasir & nok',
    icon: 'triangle',
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  {
    id: 'atap_limas',
    screen: 'AtapLimasScreen',
    code: '11.A',
    title: 'Atap Limas Baja Ringan',
    subtitle: 'Geometri limas trapesium & segitiga, jurai, nok, reng',
    icon: 'diamond',
    color: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    id: 'rekap',
    screen: 'RekapRABScreen',
    code: 'RAB',
    title: 'Rekapitulasi RAB Proyek',
    subtitle: 'Tabel lengkap 19 pekerjaan konstruksi & total anggaran',
    icon: 'receipt',
    color: '#0369a1',
    bgColor: '#e0f2fe',
    isSpecial: true,
  },
];

export default function HomeScreen({ navigation }) {
  const [totalRAB, setTotalRAB] = useState(0);

  const loadSummary = async () => {
    const data = await generateCurrentRekapRAB();
    if (data?.totalProyek) {
      setTotalRAB(data.totalProyek);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation?.addListener ? navigation.addListener('focus', loadSummary) : null;
    loadSummary();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Landscape Top Header */}
        <View style={styles.topBanner}>
          <View style={styles.brandRow}>
            <RABProLogo size={42} showText={false} />
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.brandName}>RABPro</Text>
                <View style={styles.ahspBadge}>
                  <Text style={styles.ahspBadgeText}>AHSP PUPR 2025/2026</Text>
                </View>
                <TouchableOpacity
                  style={styles.infoDisclaimerBtn}
                  onPress={() => navigation.navigate('DisclaimerScreen')}
                >
                  <Ionicons name="information-circle-outline" size={14} color="#64748b" />
                  <Text style={styles.infoDisclaimerText}>Disclaimer</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.brandDesc}>
                Aplikasi Estimator Konstruksi & Perhitungan Rencana Anggaran Biaya Otomatis
              </Text>
            </View>
          </View>

          {/* Quick Summary Pill */}
          <TouchableOpacity
            style={styles.summaryPill}
            onPress={() => navigation.navigate('RekapRABScreen')}
          >
            <Text style={styles.summaryLabel}>TOTAL ESTIMASI RAB</Text>
            <Text style={styles.summaryValue}>{formatRupiah(totalRAB)}</Text>
            <View style={styles.summaryAction}>
              <Text style={styles.summaryActionText}>Lihat Rekap</Text>
              <Ionicons name="arrow-forward" size={12} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <Ionicons name="apps-outline" size={18} color="#0f172a" />
          <Text style={styles.sectionTitleText}>Pilih Modul Kalkulator Pekerjaan</Text>
        </View>

        {/* Grid 4 columns in landscape */}
        <View style={styles.gridContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridCard,
                item.isSpecial && styles.specialCard,
              ]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.codeBadge, { backgroundColor: item.color }]}>
                  <Text style={styles.codeBadgeText}>{item.code}</Text>
                </View>
                <View style={[styles.cardIconWrap, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
              </View>

              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>

              <View style={styles.cardBottomRow}>
                <Text style={[styles.btnOpenText, { color: item.color }]}>
                  Buka Estimator
                </Text>
                <Ionicons name="chevron-forward" size={14} color={item.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  brandLogo: {
    width: 44,
    height: 44,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  ahspBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  ahspBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  infoDisclaimerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginLeft: 6,
  },
  infoDisclaimerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  brandDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  summaryPill: {
    backgroundColor: '#0369a1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bae6fd',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 1,
  },
  summaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  summaryActionText: {
    fontSize: 10,
    color: '#e0f2fe',
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '23.8%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  specialCard: {
    borderColor: '#0284c7',
    borderWidth: 1.5,
    backgroundColor: '#f0f9ff',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  cardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 16,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 13,
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#f1f5f9',
  },
  btnOpenText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
