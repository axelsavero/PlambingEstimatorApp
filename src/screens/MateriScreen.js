import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { MATERI_CATEGORIES, MATERI_LIST } from '../data/materiData';
import MathEquation from '../components/MathEquation';
import SkylineWatermarkBackground from '../components/SkylineWatermarkBackground';

export default function MateriScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(MATERI_LIST[0]?.id || '');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

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
    <SkylineWatermarkBackground style={styles.container}>
      {/* Top Header Bar: Panduan Teknis */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Image
            source={require('../../assets/brand/logo_icon.png')}
            style={styles.logoBadge}
            resizeMode="contain"
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.topBarTitle}>Panduan Teknis & Rumus</Text>
              <View style={styles.topBarBadge}>
                <Text style={styles.topBarBadgeText}>ESTIMATOR</Text>
              </View>
            </View>
            <Text style={styles.topBarSubtitle}>
              Buku Referensi Teori Perhitungan Volume, Rumus KaTeX, AHSP PUPR & Kurva S
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnHome}
          onPress={() => navigation.navigate('HomeTab')}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={13} color={colors.primaryDark} />
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
              <Ionicons name="search" size={14} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari materi, rumus, langkah..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={15} color="#94A3B8" />
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
                <Ionicons name="document-text-outline" size={32} color="#94A3B8" />
                <Text style={styles.emptyText}>Tidak ada materi yang cocok</Text>
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
                        <Ionicons name="list" size={10} color="#B45309" />
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
                        <Ionicons name="play-circle" size={12} color="#ED7E08" />
                        <Text style={styles.videoBadgeText}>Video Panduan</Text>
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
                          color={isSelected ? colors.primary : '#64748B'}
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
                    <Text style={styles.bannerCatBadgeText}>{activeItem.kategori}</Text>
                  </View>
                  {activeItem.terkaitKalkulator && (
                    <TouchableOpacity
                      style={styles.btnLaunchCalc}
                      onPress={() => handleOpenCalculator(activeItem.terkaitKalkulator)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="calculator" size={13} color="#FFFFFF" />
                      <Text style={styles.btnLaunchCalcText}>Buka Kalkulator Sheet</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.detailTitle}>{activeItem.judul}</Text>
                <Text style={styles.detailSummary}>{activeItem.ringkasan}</Text>
              </View>

              {/* VIDEO PLAYER CARD (Sesuai Mockup Klien 5b03a4c5...) */}
              <View style={styles.videoPlayerCard}>
                <View style={styles.videoCardTop}>
                  <View style={styles.videoCardTopLeft}>
                    <View style={styles.videoIconCircle}>
                      <Ionicons name="videocam" size={14} color="#ED7E08" />
                    </View>
                    <View>
                      <Text style={styles.videoCardTitle}>
                        Video Tutorial: {activeItem.judul}
                      </Text>
                      <Text style={styles.videoCardDuration}>
                        Durasi Panduan Teknis: 05:42 Menit • HD 1080p
                      </Text>
                    </View>
                  </View>

                  <View style={styles.videoReadyBadge}>
                    <Text style={styles.videoReadyBadgeText}>Materi Siap</Text>
                  </View>
                </View>

                {/* Simulated Screen / Canvas */}
                <View style={styles.videoScreen}>
                  <TouchableOpacity
                    style={styles.bigPlayButton}
                    activeOpacity={0.8}
                    onPress={() => setIsPlayingVideo(!isPlayingVideo)}
                  >
                    <Ionicons
                      name={isPlayingVideo ? 'pause' : 'play'}
                      size={28}
                      color="#FFFFFF"
                      style={{ marginLeft: isPlayingVideo ? 0 : 3 }}
                    />
                  </TouchableOpacity>

                  <View style={styles.videoScreenOverlayBottom}>
                    <View style={styles.videoProgressBarWrap}>
                      <View
                        style={[
                          styles.videoProgressBarFill,
                          { width: isPlayingVideo ? '45%' : '20%' },
                        ]}
                      />
                    </View>
                    <View style={styles.videoControlsRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <TouchableOpacity onPress={() => setIsPlayingVideo(!isPlayingVideo)}>
                          <Ionicons
                            name={isPlayingVideo ? 'pause' : 'play'}
                            size={16}
                            color="#FFFFFF"
                          />
                        </TouchableOpacity>
                        <Text style={styles.videoTimerText}>
                          {isPlayingVideo ? '02:34 / 05:42' : '01:08 / 05:42'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="volume-medium" size={15} color="#CBD5E1" />
                        <Ionicons name="scan-outline" size={14} color="#CBD5E1" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Rincian Langkah & Formula KaTeX */}
              <View style={styles.stepsSectionHeader}>
                <Ionicons name="calculator-outline" size={16} color={colors.primary} />
                <Text style={styles.stepsSectionTitle}>
                  Langkah Perhitungan & Notasi Matematis (KaTeX)
                </Text>
              </View>

              {activeItem.steps?.map((stepItem, sIdx) => (
                <View key={sIdx} style={styles.stepCard}>
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
                    <Ionicons name="alert-circle" size={16} color="#B45309" />
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
              <Ionicons name="book-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyDetailText}>
                Pilih salah satu topik di sebelah kiri untuk melihat materi dan rumus
              </Text>
            </View>
          )}
        </View>
      </View>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FED7AA',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
  },
  topBarTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  topBarBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#F59E0B',
  },
  topBarBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
  },
  topBarSubtitle: {
    fontSize: 9.5,
    color: '#64748B',
  },
  btnHome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  btnHomeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  splitRow: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#FED7AA',
    backgroundColor: '#FFFFFF',
  },
  rightColumn: {
    flex: 1.7,
    backgroundColor: '#FFFDF9',
  },
  searchBoxWrap: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 11,
    color: '#1E1E1E',
  },
  categoryScrollWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryScroll: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 5,
  },
  categoryChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  topicListScroll: {
    flex: 1,
  },
  topicListContent: {
    padding: 8,
    gap: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 6,
  },
  topicCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    position: 'relative',
    overflow: 'hidden',
  },
  topicCardActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary,
  },
  topicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  catBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  catBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  stepBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#B45309',
  },
  topicCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 2,
  },
  topicCardTitleActive: {
    color: colors.primaryDark,
  },
  topicCardSummary: {
    fontSize: 9.5,
    color: '#64748B',
    lineHeight: 13,
  },
  topicCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#FDE68A',
  },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  videoBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: colors.primary,
  },
  readMoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readMoreText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  readMoreTextActive: {
    color: colors.primary,
  },
  activeTopicBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
  },

  // RIGHT DETAIL PANE
  detailScroll: {
    flex: 1,
  },
  detailContent: {
    padding: 10,
    gap: 8,
    paddingBottom: 25,
  },
  detailBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bannerCatBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bannerCatBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  btnLaunchCalc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  btnLaunchCalcText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#1E1E1E',
    marginBottom: 3,
  },
  detailSummary: {
    fontSize: 10.5,
    color: '#475569',
    lineHeight: 15,
  },

  // VIDEO PLAYER CARD
  videoPlayerCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  videoCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: '#3D3D3D',
  },
  videoCardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCardTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  videoCardDuration: {
    fontSize: 8.5,
    color: '#94A3B8',
  },
  videoReadyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  videoReadyBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  videoScreen: {
    height: 140,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bigPlayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  videoScreenOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  videoProgressBarWrap: {
    height: 3,
    backgroundColor: '#475569',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  videoProgressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  videoControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoTimerText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Steps & KaTeX
  stepsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  stepsSectionTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 8,
    gap: 4,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepNumberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  stepDescText: {
    fontSize: 9.5,
    color: '#475569',
    lineHeight: 14,
  },
  tipCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 8,
    gap: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tipTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  tipText: {
    fontSize: 9.5,
    color: '#92400E',
    lineHeight: 14,
  },
  emptyDetailWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyDetailText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});
