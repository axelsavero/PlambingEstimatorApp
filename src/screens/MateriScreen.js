import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { MATERI, getTopikList } from '../data/materiData';
import MathEquation from '../components/MathEquation';
import SkylineWatermarkBackground from '../components/SkylineWatermarkBackground';

export default function MateriScreen({ navigation, route }) {
  const [materiId, setMateriId] = useState(route?.params?.materiId || MATERI[0].id);
  const [topikId, setTopikId] = useState(null);
  const [query, setQuery] = useState('');
  const detailRef = useRef(null);

  // Dibuka dari Beranda dengan materi tertentu
  useEffect(() => {
    if (route?.params?.materiId) {
      setMateriId(route.params.materiId);
    }
  }, [route?.params?.materiId]);

  const materi = MATERI.find((m) => m.id === materiId) || MATERI[0];
  const topikList = useMemo(() => getTopikList(materi), [materi]);

  // Reset pilihan & pencarian saat ganti materi
  useEffect(() => {
    setTopikId(topikList[0]?.id || null);
    setQuery('');
  }, [materiId]);

  useEffect(() => {
    detailRef.current?.scrollTo({ y: 0, animated: false });
  }, [topikId]);

  const topikIndex = Math.max(0, topikList.findIndex((t) => t.id === topikId));
  const topik = topikList[topikIndex];
  const prevTopik = topikList[topikIndex - 1];
  const nextTopik = topikList[topikIndex + 1];

  const q = query.trim().toLowerCase();
  const matches = (t) =>
    !q ||
    t.judul.toLowerCase().includes(q) ||
    (t.grup || '').toLowerCase().includes(q) ||
    t.langkah.some((l) => l.toLowerCase().includes(q));

  const showBagianHeader = materi.bagian.length > 1;

  return (
    <SkylineWatermarkBackground style={styles.container}>
      {/* Header: judul + tab 4 materi */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeTab')}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panduan Teknis</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {MATERI.map((m) => {
            const active = m.id === materiId;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setMateriId(m.id)}
                style={[styles.tab, active && styles.tabActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {m.singkat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.body}>
        {/* Sidebar: daftar topik */}
        <View style={styles.sidebar}>
          <View style={styles.search}>
            <Ionicons name="search" size={14} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari topik"
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView contentContainerStyle={styles.sidebarList}>
            {materi.bagian.map((bagian) => {
              const items = bagian.topik.filter(matches);
              if (!items.length) return null;
              return (
                <View key={bagian.id} style={styles.bagian}>
                  {showBagianHeader ? (
                    <Text style={styles.bagianTitle}>{bagian.judul}</Text>
                  ) : null}
                  {items.map((t, i) => {
                    const active = t.id === topik?.id;
                    const showGrup = t.grup && t.grup !== items[i - 1]?.grup;
                    return (
                      <View key={t.id}>
                        {showGrup ? <Text style={styles.grupTitle}>{t.grup}</Text> : null}
                        <TouchableOpacity
                          onPress={() => setTopikId(t.id)}
                          style={[styles.topikItem, active && styles.topikItemActive]}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[styles.topikText, active && styles.topikTextActive]}
                            numberOfLines={1}
                          >
                            {t.judul}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              );
            })}
            {topikList.every((t) => !matches(t)) ? (
              <Text style={styles.empty}>Tidak ada topik yang cocok.</Text>
            ) : null}
          </ScrollView>
        </View>

        {/* Detail topik */}
        {topik ? (
          <ScrollView
            ref={detailRef}
            style={styles.detail}
            contentContainerStyle={styles.detailContent}
          >
            <Text style={styles.breadcrumb} numberOfLines={1}>
              {[materi.judul, showBagianHeader ? topik.bagianJudul : null, topik.grup]
                .filter(Boolean)
                .join('  ›  ')}
            </Text>

            <View style={styles.titleRow}>
              <Text style={styles.title}>{topik.judul}</Text>
              {topik.kalkulator ? (
                <TouchableOpacity
                  style={styles.calcBtn}
                  onPress={() => navigation.navigate(topik.kalkulator.route)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calculator-outline" size={14} color={colors.primary} />
                  <Text style={styles.calcBtnText}>Buka kalkulator</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Langkah */}
            <View style={styles.steps}>
              {topik.langkah.map((langkah, i) => (
                <View key={i} style={styles.step}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{langkah}</Text>
                </View>
              ))}
            </View>

            {/* Rumus */}
            {topik.rumus?.length ? (
              <>
                <Text style={styles.sectionLabel}>Rumus</Text>
                <View style={styles.rumusGrid}>
                  {topik.rumus.map((r, i) => (
                    <View key={`${topik.id}-${i}`} style={styles.rumusCell}>
                      <MathEquation label={r.label} latex={r.latex} teks={r.teks} />
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            {topik.catatan ? (
              <View style={styles.note}>
                <Ionicons name="information-circle-outline" size={15} color={colors.primaryDark} />
                <Text style={styles.noteText}>{topik.catatan}</Text>
              </View>
            ) : null}

            <View style={styles.videoRow}>
              <Ionicons name="play-circle-outline" size={15} color={colors.textMuted} />
              <Text style={styles.videoText}>Video pembahasan segera hadir</Text>
            </View>

            {/* Sebelumnya / berikutnya */}
            <View style={styles.pager}>
              {prevTopik ? (
                <TouchableOpacity
                  style={styles.pagerBtn}
                  onPress={() => setTopikId(prevTopik.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
                  <View style={styles.pagerTextWrap}>
                    <Text style={styles.pagerHint}>Sebelumnya</Text>
                    <Text style={styles.pagerTitle} numberOfLines={1}>{prevTopik.judul}</Text>
                  </View>
                </TouchableOpacity>
              ) : <View style={styles.pagerSpacer} />}

              {nextTopik ? (
                <TouchableOpacity
                  style={[styles.pagerBtn, styles.pagerBtnNext]}
                  onPress={() => setTopikId(nextTopik.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.pagerTextWrap, { alignItems: 'flex-end' }]}>
                    <Text style={styles.pagerHint}>Berikutnya</Text>
                    <Text style={styles.pagerTitle} numberOfLines={1}>{nextTopik.judul}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : <View style={styles.pagerSpacer} />}
            </View>
          </ScrollView>
        ) : null}
      </View>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  tabs: {
    gap: 4,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },

  body: {
    flex: 1,
    flexDirection: 'row',
  },

  // Sidebar
  sidebar: {
    width: 240,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRightWidth: 1,
    borderRightColor: colors.hairline,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    margin: 12,
    marginBottom: 4,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.text,
    paddingVertical: 0,
  },
  sidebarList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  bagian: {
    marginTop: 8,
  },
  bagianTitle: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 2,
  },
  grupTitle: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primaryDark,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 2,
  },
  topikItem: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
  },
  topikItemActive: {
    backgroundColor: colors.primaryLight,
  },
  topikText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  topikTextActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    padding: 8,
  },

  // Detail
  detail: {
    flex: 1,
  },
  detailContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  breadcrumb: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.text,
  },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.quadrantBorder,
  },
  calcBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },

  steps: {
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    gap: 10,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 21,
    color: colors.text,
  },

  sectionLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginTop: 20,
    marginBottom: 8,
  },
  rumusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rumusCell: {
    flexGrow: 1,
    flexBasis: 260,
  },

  note: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryGhost,
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  videoText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },

  pager: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  pagerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  pagerBtnNext: {
    justifyContent: 'flex-end',
  },
  pagerSpacer: {
    flex: 1,
  },
  pagerTextWrap: {
    flex: 1,
  },
  pagerHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
  },
  pagerTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
  },
});
