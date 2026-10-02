import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { formatRupiah } from '../utils/constructionCalculations';
import { generateCurrentRekapRAB } from '../utils/rabStorage';
import RABProLogo from '../components/RABProLogo';

// 3 Kategori Besar Sesuai Konsep PPTX Slide 3
const WORK_CATEGORIES = [
  {
    id: 'pondasi',
    categoryName: 'PEKERJAAN PONDASI',
    subtitle: 'Pondasi Dangkal & Pondasi Tapak Beton Bertulang',
    icon: 'layers',
    themeColor: '#d97706',
    bgColor: '#fef3c7',
    badgeText: '2 Sub-Pekerjaan',
    cardWidthPercent: '49%',
    items: [
      {
        id: 'pondasi_belah',
        screen: 'PondasiScreen',
        code: '02',
        title: 'Pondasi Batu Belah',
        subtitle: 'Galian tanah, aanstamping, pasangan batu belah & urukan kembali',
        icon: 'layers-outline',
        color: '#d97706',
        bgColor: '#fef3c7',
        highlight: 'Galian Tanah, Batu Kali, Pasir Urug',
      },
      {
        id: 'footplate',
        screen: 'FootPlateScreen',
        code: '03',
        title: 'Pondasi Tapak (Foot Plate)',
        subtitle: '6 tipe foot plate, penulangan D13/D16, pedestal & cor beton K-300',
        icon: 'grid-outline',
        color: '#b45309',
        bgColor: '#ffedd5',
        highlight: '6 Tipe FP, Pembesian & Bekisting',
      },
    ],
  },
  {
    id: 'beton',
    categoryName: 'PEKERJAAN BETON',
    subtitle: 'Struktur Beton Bertulang (Sloof, Kolom, & Balok)',
    icon: 'business',
    themeColor: '#2563eb',
    bgColor: '#dbeafe',
    badgeText: '3 Sub-Pekerjaan',
    cardWidthPercent: '32.2%',
    items: [
      {
        id: 'sloof',
        screen: 'SloofScreen',
        code: '04',
        title: 'Struktur Sloof Beton',
        subtitle: 'Tulangan utama & support, sengkang tumpuan/lapangan & cor K-275',
        icon: 'remove-outline',
        color: '#16a34a',
        bgColor: '#dcfce7',
        highlight: 'Dimensi b x h, Begel, Cor K-275',
      },
      {
        id: 'kolom',
        screen: 'KolomScreen',
        code: '05',
        title: 'Struktur Kolom Beton',
        subtitle: 'Dimensi kolom, pembesian utama & support, sengkang & cor K-275',
        icon: 'business-outline',
        color: '#9333ea',
        bgColor: '#f3e8ff',
        highlight: 'Tinggi Kolom, Tulangan Pokok & Begel',
      },
      {
        id: 'balok',
        screen: 'BalokScreen',
        code: '06',
        title: 'Struktur Balok Beton',
        subtitle: 'Penulangan lentur balok, sengkang tumpuan/lapangan & cor K-275',
        icon: 'cube-outline',
        color: '#0891b2',
        bgColor: '#cffafe',
        highlight: 'Bentang Balok, Tulangan Tarik/Tekan',
      },
    ],
  },
  {
    id: 'atap',
    categoryName: 'PEKERJAAN ATAP',
    subtitle: 'Rangka Kuda-Kuda Baja Ringan & Penutup Atap',
    icon: 'triangle',
    themeColor: '#dc2626',
    bgColor: '#fee2e2',
    badgeText: '2 Sub-Pekerjaan',
    cardWidthPercent: '49%',
    items: [
      {
        id: 'atap_pelana',
        screen: 'AtapPelanaScreen',
        code: '11',
        title: 'Atap Pelana Baja Ringan',
        subtitle: 'Kuda-kuda C75, reng, genteng metal pasir & rabung nok',
        icon: 'triangle-outline',
        color: '#dc2626',
        bgColor: '#fee2e2',
        highlight: 'Model Pelana: C75, Reng, Genteng Metal',
      },
      {
        id: 'atap_limas',
        screen: 'AtapLimasScreen',
        code: '11.A',
        title: 'Atap Limas Baja Ringan',
        subtitle: 'Geometri limas trapesium & segitiga, jurai luar, nok & reng',
        icon: 'diamond-outline',
        color: '#ea580c',
        bgColor: '#ffedd5',
        highlight: 'Model Limas: Jurai, Nok, Reng, Genteng',
      },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const [totalRAB, setTotalRAB] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pondasi' | 'beton' | 'atap'

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

  const filteredCategories = activeFilter === 'all'
    ? WORK_CATEGORIES
    : WORK_CATEGORIES.filter(cat => cat.id === activeFilter);

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
              <Text style={styles.summaryActionText}>Buka Rekapitulasi</Text>
              <Ionicons name="arrow-forward" size={12} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Navigation Filter Tabs */}
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>Kategori Pekerjaan (PPTX):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Ionicons
                name="apps"
                size={13}
                color={activeFilter === 'all' ? '#ffffff' : '#64748b'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
                Semua Kategori (7)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'pondasi' && styles.filterPillActivePondasi]}
              onPress={() => setActiveFilter('pondasi')}
            >
              <Ionicons
                name="layers"
                size={13}
                color={activeFilter === 'pondasi' ? '#ffffff' : '#d97706'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'pondasi' && styles.filterPillTextActive]}>
                1. Pekerjaan Pondasi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'beton' && styles.filterPillActiveBeton]}
              onPress={() => setActiveFilter('beton')}
            >
              <Ionicons
                name="business"
                size={13}
                color={activeFilter === 'beton' ? '#ffffff' : '#2563eb'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'beton' && styles.filterPillTextActive]}>
                2. Pekerjaan Beton
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'atap' && styles.filterPillActiveAtap]}
              onPress={() => setActiveFilter('atap')}
            >
              <Ionicons
                name="triangle"
                size={13}
                color={activeFilter === 'atap' ? '#ffffff' : '#dc2626'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'atap' && styles.filterPillTextActive]}>
                3. Pekerjaan Atap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, styles.filterPillRekap]}
              onPress={() => navigation.navigate('RekapRABScreen')}
            >
              <Ionicons name="receipt" size={13} color="#0369a1" />
              <Text style={styles.filterPillTextRekap}>
                Rekapitulasi RAB
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 3 Categories Sections */}
        {filteredCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={styles.categoryHeaderLeft}>
                <View style={[styles.categoryIconWrap, { backgroundColor: category.bgColor }]}>
                  <Ionicons name={category.icon} size={18} color={category.themeColor} />
                </View>
                <View>
                  <View style={styles.categoryTitleRow}>
                    <Text style={styles.categoryTitleText}>{category.categoryName}</Text>
                    <View style={[styles.categoryBadge, { backgroundColor: category.bgColor }]}>
                      <Text style={[styles.categoryBadgeText, { color: category.themeColor }]}>
                        {category.badgeText}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.categorySubtitleText}>{category.subtitle}</Text>
                </View>
              </View>
            </View>

            {/* Cards Grid for this category */}
            <View style={styles.cardsRow}>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.gridCard,
                    { width: category.cardWidthPercent },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.cardTopRow}>
                    <View style={[styles.codeBadge, { backgroundColor: item.color }]}>
                      <Text style={styles.codeBadgeText}>{item.code}</Text>
                    </View>
                    <View style={[styles.cardIconWrap, { backgroundColor: item.bgColor }]}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>

                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightText} numberOfLines={1}>
                      {item.highlight}
                    </Text>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <Text style={[styles.btnOpenText, { color: item.color }]}>
                      Buka Kalkulator
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color={item.color} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Master Rekapitulasi RAB Proyek Banner */}
        <View style={styles.rekapSection}>
          <TouchableOpacity
            style={styles.rekapCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RekapRABScreen')}
          >
            <View style={styles.rekapLeft}>
              <View style={styles.rekapIconWrap}>
                <Ionicons name="receipt" size={24} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rekapTitleRow}>
                  <Text style={styles.rekapTitle}>REKAPITULASI RENCANA ANGGARAN BIAYA (RAB)</Text>
                  <View style={styles.rekapCodeBadge}>
                    <Text style={styles.rekapCodeBadgeText}>BOM 19 PEKERJAAN</Text>
                  </View>
                </View>
                <Text style={styles.rekapDesc}>
                  Ringkasan seluruh divisi pekerjaan: pondasi, struktur beton, rangka atap, dinding, plesteran, lantai, hingga sanitair & kelistrikan.
                </Text>
              </View>
            </View>

            <View style={styles.rekapRight}>
              <Text style={styles.rekapTotalLabel}>ESTIMASI TOTAL ANGGARAN</Text>
              <Text style={styles.rekapTotalAmount}>{formatRupiah(totalRAB)}</Text>
              <View style={styles.rekapBtn}>
                <Text style={styles.rekapBtnText}>Buka Rekap RAB Lengkap</Text>
                <Ionicons name="arrow-forward" size={14} color="#0284c7" />
              </View>
            </View>
          </TouchableOpacity>
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
    padding: 14,
    paddingBottom: 36,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  brandDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  summaryPill: {
    backgroundColor: '#0369a1',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bae6fd',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 17,
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filterPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterPillActivePondasi: {
    backgroundColor: '#d97706',
    borderColor: '#d97706',
  },
  filterPillActiveBeton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterPillActiveAtap: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  filterPillRekap: {
    backgroundColor: '#e0f2fe',
    borderColor: '#bae6fd',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  filterPillTextRekap: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369a1',
  },
  categorySection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  categorySubtitleText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  gridCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-between',
    minHeight: 132,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 13,
    marginBottom: 6,
  },
  highlightBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
  },
  btnOpenText: {
    fontSize: 10,
    fontWeight: '800',
  },
  rekapSection: {
    marginTop: 4,
  },
  rekapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  rekapLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 16,
  },
  rekapIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rekapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  rekapTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  rekapCodeBadge: {
    backgroundColor: '#0369a1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rekapCodeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bae6fd',
  },
  rekapDesc: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 14,
  },
  rekapRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rekapTotalLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  rekapTotalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38bdf8',
    marginVertical: 2,
  },
  rekapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 4,
  },
  rekapBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
  },
});
