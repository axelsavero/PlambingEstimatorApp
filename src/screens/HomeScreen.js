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
import SkylineWatermarkBackground from '../components/SkylineWatermarkBackground';

// 3 Kategori Besar Sesuai Konsep Klien
const WORK_CATEGORIES = [
  {
    id: 'pondasi',
    categoryName: 'PEKERJAAN PONDASI',
    subtitle: 'Pondasi Dangkal & Pondasi Tapak Beton Bertulang',
    icon: 'layers',
    themeColor: '#ED7E08',
    bgColor: '#FFF7ED',
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
        color: '#ED7E08',
        bgColor: '#FFF7ED',
        highlight: 'Galian Tanah, Batu Kali, Pasir Urug',
      },
      {
        id: 'footplate',
        screen: 'FootPlateScreen',
        code: '03',
        title: 'Pondasi Tapak (Foot Plate)',
        subtitle: '6 tipe foot plate, penulangan D13/D16, pedestal & cor beton K-300',
        icon: 'grid-outline',
        color: '#C66503',
        bgColor: '#FEF3C7',
        highlight: '6 Tipe FP, Pembesian & Bekisting',
      },
    ],
  },
  {
    id: 'beton',
    categoryName: 'PEKERJAAN BETON',
    subtitle: 'Struktur Beton Bertulang (Sloof, Kolom, & Balok)',
    icon: 'business',
    themeColor: '#ED7E08',
    bgColor: '#FFF7ED',
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
        color: '#ED7E08',
        bgColor: '#FFF7ED',
        highlight: 'Dimensi b x h, Begel, Cor K-275',
      },
      {
        id: 'kolom',
        screen: 'KolomScreen',
        code: '05',
        title: 'Struktur Kolom Beton',
        subtitle: 'Dimensi kolom, pembesian utama & support, sengkang & cor K-275',
        icon: 'business-outline',
        color: '#C66503',
        bgColor: '#FEF3C7',
        highlight: 'Tinggi Kolom, Tulangan Pokok & Begel',
      },
      {
        id: 'balok',
        screen: 'BalokScreen',
        code: '06',
        title: 'Struktur Balok Beton',
        subtitle: 'Penulangan lentur balok, sengkang tumpuan/lapangan & cor K-275',
        icon: 'cube-outline',
        color: '#ED7E08',
        bgColor: '#FFF7ED',
        highlight: 'Bentang Balok, Tulangan Tarik/Tekan',
      },
    ],
  },
  {
    id: 'atap',
    categoryName: 'PEKERJAAN ATAP',
    subtitle: 'Rangka Kuda-Kuda Baja Ringan & Penutup Atap',
    icon: 'triangle',
    themeColor: '#ED7E08',
    bgColor: '#FFF7ED',
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
        color: '#ED7E08',
        bgColor: '#FFF7ED',
        highlight: 'Model Pelana: C75, Reng, Genteng Metal',
      },
      {
        id: 'atap_limas',
        screen: 'AtapLimasScreen',
        code: '11.A',
        title: 'Atap Limas Baja Ringan',
        subtitle: 'Geometri limas trapesium & segitiga, jurai luar, nok & reng',
        icon: 'diamond-outline',
        color: '#C66503',
        bgColor: '#FEF3C7',
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
    <SkylineWatermarkBackground style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Landscape Top Header with Official Logo & Greeting */}
        <View style={styles.topBanner}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/brand/logo_with_text.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View style={styles.brandTextWrap}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingTitle}>Hai, Rekan Konstruksi!</Text>
                <View style={styles.ahspBadge}>
                  <Text style={styles.ahspBadgeText}>AHSP PUPR 2025/2026</Text>
                </View>
              </View>
              <Text style={styles.brandDesc}>
                Aplikasi Estimator Rencana Anggaran Biaya & Perhitungan Volume Konstruksi Otomatis
              </Text>
            </View>
          </View>

          {/* Quick Summary Pill: Rekapitulasi RAB */}
          <TouchableOpacity
            style={styles.summaryPill}
            onPress={() => navigation.navigate('RekapRABScreen')}
            activeOpacity={0.85}
          >
            <View style={styles.summaryPillHeader}>
              <Ionicons name="receipt" size={13} color="#FECA38" />
              <Text style={styles.summaryLabel}>TOTAL ESTIMASI RAB</Text>
            </View>
            <Text style={styles.summaryValue}>{formatRupiah(totalRAB)}</Text>
            <View style={styles.summaryAction}>
              <Text style={styles.summaryActionText}>Buka Rekapitulasi</Text>
              <Ionicons name="arrow-forward" size={11} color="#FECA38" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 2 Big Action Launchers: Panduan Teknis & Estimator */}
        <View style={styles.launchersRow}>
          {/* Launcher 1: Panduan Teknis (Materi & Rumus) */}
          <TouchableOpacity
            style={styles.launcherCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MateriScreen')}
          >
            <View style={[styles.launcherIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="school" size={20} color="#ED7E08" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.launcherTitle}>Panduan Teknis & Rumus</Text>
                <View style={styles.launcherBadge}>
                  <Text style={styles.launcherBadgeText}>9 Topik</Text>
                </View>
              </View>
              <Text style={styles.launcherDesc}>
                Video panduan, konsep perhitungan, notasi teknis & rumus KaTeX
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          {/* Launcher 2: Rekapitulasi & Ekspor Excel */}
          <TouchableOpacity
            style={styles.launcherCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RekapRABScreen')}
          >
            <View style={[styles.launcherIconWrap, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="stats-chart" size={20} color="#ED7E08" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.launcherTitle}>Rekapitulasi RAB Proyek</Text>
                <View style={[styles.launcherBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.launcherBadgeText, { color: '#166534' }]}>Total Proyek</Text>
                </View>
              </View>
              <Text style={styles.launcherDesc}>
                Total akumulasi biaya 7 pekerjaan struktur & bagikan via WhatsApp
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Category Filter Pills */}
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>Kategori Pekerjaan Konstruksi:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Ionicons
                name="apps"
                size={13}
                color={activeFilter === 'all' ? '#FFFFFF' : '#64748B'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
                Semua Kategori (7)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'pondasi' && styles.filterPillActive]}
              onPress={() => setActiveFilter('pondasi')}
            >
              <Ionicons
                name="layers"
                size={13}
                color={activeFilter === 'pondasi' ? '#FFFFFF' : '#ED7E08'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'pondasi' && styles.filterPillTextActive]}>
                1. Pekerjaan Pondasi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'beton' && styles.filterPillActive]}
              onPress={() => setActiveFilter('beton')}
            >
              <Ionicons
                name="business"
                size={13}
                color={activeFilter === 'beton' ? '#FFFFFF' : '#ED7E08'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'beton' && styles.filterPillTextActive]}>
                2. Pekerjaan Beton
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'atap' && styles.filterPillActive]}
              onPress={() => setActiveFilter('atap')}
            >
              <Ionicons
                name="triangle"
                size={13}
                color={activeFilter === 'atap' ? '#FFFFFF' : '#ED7E08'}
              />
              <Text style={[styles.filterPillText, activeFilter === 'atap' && styles.filterPillTextActive]}>
                3. Pekerjaan Atap
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
                  <Ionicons name={category.icon} size={16} color={category.themeColor} />
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
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>Sheet {item.code}</Text>
                    </View>
                    <View style={[styles.itemIconWrap, { backgroundColor: item.bgColor }]}>
                      <Ionicons name={item.icon} size={15} color={item.color} />
                    </View>
                  </View>

                  <Text style={styles.cardItemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardItemSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>

                  <View style={styles.cardBottomRow}>
                    <Text style={styles.cardHighlightText} numberOfLines={1}>
                      {item.highlight}
                    </Text>
                    <View style={styles.cardOpenAction}>
                      <Text style={styles.cardOpenActionText}>Buka Kalkulator</Text>
                      <Ionicons name="arrow-forward-circle" size={15} color={colors.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
    gap: 10,
    paddingBottom: 25,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  brandLogo: {
    width: 130,
    height: 44,
  },
  brandTextWrap: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  ahspBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#F59E0B',
  },
  ahspBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  brandDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  summaryPill: {
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  summaryPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FECA38',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },
  summaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  summaryActionText: {
    fontSize: 8.5,
    color: '#CBD5E1',
    fontWeight: '600',
  },

  // Launchers Row
  launchersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  launcherCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  launcherIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launcherTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  launcherBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  launcherBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  launcherDesc: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },

  // Category Filter
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 5,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Categories Section & Cards
  categorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 8,
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF7ED',
    paddingBottom: 6,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTitleText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  categoryBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  categoryBadgeText: {
    fontSize: 8,
    fontWeight: '800',
  },
  categorySubtitleText: {
    fontSize: 9,
    color: '#64748B',
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gridCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 8,
    justifyContent: 'space-between',
    minHeight: 90,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  codeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  itemIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardItemTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E1E1E',
    marginTop: 4,
  },
  cardItemSubtitle: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
    lineHeight: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#FDE68A',
    paddingTop: 5,
    marginTop: 5,
  },
  cardHighlightText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.primaryDark,
    flex: 1,
  },
  cardOpenAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardOpenActionText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.primary,
  },
});
