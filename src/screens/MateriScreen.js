import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { MATERI_CATEGORIES, MATERI_LIST } from '../data/materiData';
import MathEquation from '../components/MathEquation';

export default function MateriScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(MATERI_LIST[0]?.id || '');

  // Filter list by category and search
  const filteredList = MATERI_LIST.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.judul.toLowerCase().includes(query) ||
      item.ringkasan.toLowerCase().includes(query) ||
      item.steps?.some(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.desc.toLowerCase().includes(query) ||
          s.rumus.toLowerCase().includes(query)
      );
    return matchesCategory && matchesSearch;
  });

  // Currently selected item for detail panel
  const activeItem =
    MATERI_LIST.find((item) => item.id === selectedItemId) ||
    filteredList[0] ||
    MATERI_LIST[0];

  const handleOpenCalculator = (route) => {
    if (!route || !navigation) return;
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar / Breadcrumb */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="school" size={16} color="#0284c7" />
          </View>
          <View>
            <Text style={styles.topBarTitle}>Materi & Rumus Estimasi RABPro</Text>
            <Text style={styles.topBarSubtitle}>
              Buku Referensi Teori Perhitungan Volume, Rumus Geometri, AHSP & Time Schedule
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnHome}
          onPress={() => navigation.navigate('HomeTab')}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={14} color="#0284c7" />
          <Text style={styles.btnHomeText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>

      {/* Main Split Body (Landscape Left Sidebar & Right Detail Pane) */}
      <View style={styles.splitRow}>
        {/* LEFT COLUMN: Search, Categories & Master Topic List */}
        <View style={styles.leftColumn}>
          {/* Search Box */}
          <View style={styles.searchBoxWrap}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={15} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari materi, rumus, langkah..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Category Chips Scroll */}
          <View style={styles.categoryScrollWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {MATERI_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isActive && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Topics List */}
          <ScrollView
            style={styles.topicListScroll}
            contentContainerStyle={styles.topicListContent}
            showsVerticalScrollIndicator={true}
          >
            {filteredList.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="document-text-outline" size={36} color="#94a3b8" />
                <Text style={styles.emptyText}>Tidak ada materi yang sesuai</Text>
              </View>
            ) : (
              filteredList.map((item) => {
                const isSelected = activeItem?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.topicCard,
                      isSelected && styles.topicCardActive,
                    ]}
                    onPress={() => setSelectedItemId(item.id)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.topicCardHeader}>
                      <View style={styles.catBadge}>
                        <Text style={styles.catBadgeText}>{item.kategori}</Text>
                      </View>
                      <View style={styles.stepBadge}>
                        <Ionicons name="list" size={10} color="#b45309" />
                        <Text style={styles.stepBadgeText}>
                          {item.steps?.length || 0} Langkah
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.topicCardTitle,
                        isSelected && styles.topicCardTitleActive,
                      ]}
                      numberOfLines={2}
                    >
                      {item.judul}
                    </Text>

                    <Text style={styles.topicCardSummary} numberOfLines={2}>
                      {item.ringkasan}
                    </Text>

                    <View style={styles.topicCardFooter}>
                      <View style={styles.videoBadge}>
                        <Ionicons name="videocam-outline" size={11} color="#6366f1" />
                        <Text style={styles.videoBadgeText}>Video Materi</Text>
                      </View>
                      <View style={styles.readMoreWrap}>
                        <Text
                          style={[
                            styles.readMoreText,
                            isSelected && styles.readMoreTextActive,
                          ]}
                        >
                          Pelajari
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={13}
                          color={isSelected ? colors.primaryDark : '#64748b'}
                        />
                      </View>
                    </View>

                    {isSelected ? <View style={styles.activeTopicBar} /> : null}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* RIGHT COLUMN: Detail Content View */}
        <View style={styles.rightColumn}>
          {activeItem ? (
            <ScrollView
              style={styles.detailScroll}
              contentContainerStyle={styles.detailContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Header Topic Banner */}
              <View style={styles.detailBanner}>
                <View style={styles.bannerTopRow}>
                  <View style={styles.bannerCatBadge}>
                    <Text style={styles.bannerCatBadgeText}>
                      {activeItem.kategori}
                    </Text>
                  </View>
                  <View style={styles.stepCountBadge}>
                    <Ionicons name="sparkles" size={12} color="#0284c7" />
                    <Text style={styles.stepCountBadgeText}>
                      {activeItem.steps?.length || 0} Tahapan Perhitungan
                    </Text>
                  </View>
                </View>

                <Text style={styles.detailTitle}>{activeItem.judul}</Text>
                <Text style={styles.detailSummary}>{activeItem.ringkasan}</Text>

                {activeItem.calcRoute ? (
                  <TouchableOpacity
                    style={styles.btnLaunchCalc}
                    onPress={() => handleOpenCalculator(activeItem.calcRoute)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calculator" size={16} color="#ffffff" />
                    <Text style={styles.btnLaunchCalcText}>
                      {activeItem.calcTitle || 'Buka Kalkulator Terkait'}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Video Tutorial Placeholder Card */}
              <View style={styles.videoCard}>
                <View style={styles.videoCardHeader}>
                  <View style={styles.videoHeaderLeft}>
                    <Ionicons name="play-circle" size={18} color="#38bdf8" />
                    <Text style={styles.videoHeaderTitle}>
                      Video Pembahasan & Tutorial
                    </Text>
                  </View>
                  <View style={styles.videoStatusPill}>
                    <Text style={styles.videoStatusPillText}>
                      Menunggu Materi Klien
                    </Text>
                  </View>
                </View>

                <View style={styles.videoPlaceholderFrame}>
                  <View style={styles.playButtonCircle}>
                    <Ionicons name="play" size={28} color="#0284c7" style={{ marginLeft: 3 }} />
                  </View>
                  <Text style={styles.videoPlaceholderTitle}>
                    {activeItem.videoPlaceholder}
                  </Text>
                  <Text style={styles.videoPlaceholderSub}>
                    Area pemutar video materi pembelajaran. Video resmi dari Klien akan otomatis disematkan pada komponen ini setelah diserahkan.
                  </Text>
                  <View style={styles.videoSpecRow}>
                    <View style={styles.videoSpecItem}>
                      <Ionicons name="time-outline" size={13} color="#94a3b8" />
                      <Text style={styles.videoSpecText}>Durasi ~10 - 15 Menit</Text>
                    </View>
                    <View style={styles.videoSpecItem}>
                      <Ionicons name="videocam" size={13} color="#94a3b8" />
                      <Text style={styles.videoSpecText}>Format MP4 / Web Stream</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Step-by-Step Walkthrough with KaTeX Formulas */}
              <View style={styles.sectionStepsHeader}>
                <Ionicons name="layers-outline" size={18} color={colors.primary} />
                <Text style={styles.sectionStepsTitle}>
                  Langkah-Langkah & Persamaan Matematis
                </Text>
              </View>

              {activeItem.steps?.map((stepItem) => (
                <View key={`step-${stepItem.step}`} style={styles.stepCard}>
                  <View style={styles.stepCardHeader}>
                    <View style={styles.stepNumberCircle}>
                      <Text style={styles.stepNumberText}>{stepItem.step}</Text>
                    </View>
                    <Text style={styles.stepTitleText}>{stepItem.title}</Text>
                  </View>

                  <Text style={styles.stepDescText}>{stepItem.desc}</Text>

                  {/* Render Equation Component: Persamaan vs Teks Rumus */}
                  <MathEquation
                    title={`Tahap ${stepItem.step}: ${stepItem.title}`}
                    persamaan={stepItem.persamaan}
                    latex={stepItem.latex}
                    readable={stepItem.rumus}
                  />
                </View>
              ))}

              {/* Tips & Catatan Pengawas */}
              {activeItem.tips ? (
                <View style={styles.tipCard}>
                  <View style={styles.tipHeader}>
                    <Ionicons name="alert-circle" size={18} color="#b45309" />
                    <Text style={styles.tipTitle}>
                      Catatan Praktis & Standar Lapangan
                    </Text>
                  </View>
                  <Text style={styles.tipText}>{activeItem.tips}</Text>
                </View>
              ) : null}
            </ScrollView>
          ) : (
            <View style={styles.emptyDetailWrap}>
              <Ionicons name="book-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyDetailText}>
                Pilih salah satu materi di sebelah kiri untuk melihat rincian rumus
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  topBarSubtitle: {
    fontSize: 10.5,
    color: '#64748b',
  },
  btnHome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  btnHomeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
  },
  splitRow: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  rightColumn: {
    flex: 1.6,
    backgroundColor: '#ffffff',
  },
  searchBoxWrap: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 36,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 12,
    color: '#0f172a',
  },
  categoryScrollWrap: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoryScroll: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0284c7',
  },
  categoryChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#0369a1',
    fontWeight: '800',
  },
  topicListScroll: {
    flex: 1,
  },
  topicListContent: {
    padding: 10,
    gap: 8,
    paddingBottom: 30,
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  topicCardActive: {
    borderColor: '#0284c7',
    backgroundColor: '#f0f9ff',
  },
  activeTopicBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#0284c7',
  },
  topicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  catBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0369a1',
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stepBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#b45309',
  },
  topicCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 16,
  },
  topicCardTitleActive: {
    color: '#0369a1',
    fontWeight: '800',
  },
  topicCardSummary: {
    fontSize: 10.5,
    color: '#64748b',
    lineHeight: 14,
    marginBottom: 8,
  },
  topicCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
  },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4f46e5',
  },
  readMoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readMoreText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748b',
  },
  readMoreTextActive: {
    color: '#0284c7',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  detailScroll: {
    flex: 1,
  },
  detailContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  detailBanner: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerCatBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bannerCatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369a1',
  },
  stepCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepCountBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284c7',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 6,
  },
  detailSummary: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  btnLaunchCalc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  btnLaunchCalcText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  videoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  videoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
  },
  videoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#f8fafc',
  },
  videoStatusPill: {
    backgroundColor: '#334155',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  videoStatusPillText: {
    fontSize: 9.5,
    color: '#38bdf8',
    fontWeight: '600',
  },
  videoPlaceholderFrame: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090d16',
  },
  playButtonCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38bdf8',
    marginBottom: 10,
  },
  videoPlaceholderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  videoPlaceholderSub: {
    fontSize: 10.5,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 480,
    lineHeight: 15,
    marginBottom: 12,
  },
  videoSpecRow: {
    flexDirection: 'row',
    gap: 16,
  },
  videoSpecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoSpecText: {
    fontSize: 10,
    color: '#64748b',
  },
  sectionStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  sectionStepsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stepNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  stepTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  stepDescText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 17,
    marginBottom: 4,
  },
  tipCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#92400e',
  },
  tipText: {
    fontSize: 11,
    color: '#78350f',
    lineHeight: 16,
  },
  emptyDetailWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyDetailText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
