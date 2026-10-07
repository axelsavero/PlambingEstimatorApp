import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Share,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { formatRupiah, formatNumber, VOLUME_LABELS } from '../utils/constructionCalculations';
import {
  isFieldModified as isFieldModifiedHelper,
  checkModifiedInputs,
} from '../utils/modificationHelper';
import SkylineWatermarkBackground from './SkylineWatermarkBackground';

// Lebar minimum satu kolom input; jumlah kolom menyesuaikan lebar panel
const MIN_FIELD_WIDTH = 140;

const RESULT_TABS = [
  { id: 'rab', label: 'Biaya' },
  { id: 'volume', label: 'Volume' },
  { id: 'prices', label: 'Harga satuan' },
];

// Layout 4 kuadran sesuai konsep klien:
// [Gambar ilustrasi | Logo & total] / [Dimensi & volume | Harga satuan & hasil]
export default function LandscapeCalculatorLayout({
  title,
  subtitle,
  diagramSource,
  diagramTitle = 'Gambar teknis',
  diagrams,
  inputSections = [],
  results,
  defaultInputs,
  currentInputs,
  onResetField,
  onReset,
}) {
  const { height } = useWindowDimensions();
  const compact = height < 480;
  // Tinggi baris atas (gambar & total) mengikuti tinggi layar
  const topHeight = Math.round(Math.min(220, Math.max(120, height * 0.36)));

  const [showImageModal, setShowImageModal] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('rab');
  const [activeDiagramIndex, setActiveDiagramIndex] = useState(0);
  const [dimWidth, setDimWidth] = useState(0);
  const [resultWidth, setResultWidth] = useState(0);

  const diagramList =
    diagrams && diagrams.length > 0
      ? diagrams
      : diagramSource
      ? [{ title: diagramTitle, tabLabel: diagramTitle, source: diagramSource }]
      : [];
  const currentDiagram = diagramList[activeDiagramIndex] || diagramList[0];

  const modifiedInfo = checkModifiedInputs(currentInputs, defaultInputs);
  const isAnyModified = modifiedInfo.isModified;
  const mark = isAnyModified ? ' *' : '';

  // Kuadran 3: dimensi & pilihan; Kuadran 4: harga satuan upah/bahan
  const isPriceSection = (section) => {
    const t = (section.title || '').toLowerCase();
    return ['harga', 'upah', 'bahan', 'material', 'tarif'].some((k) => t.includes(k));
  };
  const dimensionSections = inputSections.filter((s) => !isPriceSection(s));
  const priceSections = inputSections.filter(isPriceSection);

  // Ubah objek results.volumes menjadi baris tabel berlabel
  const volumeRows = Object.entries(results?.volumes || {})
    .filter(([key, value]) => VOLUME_LABELS[key] && Number.isFinite(value))
    .map(([key, value]) => ({ uraian: VOLUME_LABELS[key].label, satuan: VOLUME_LABELS[key].satuan, volume: value }));

  // Field yang nilainya berbeda dari default
  const isModifiedField = (f) =>
    !!f.fieldKey &&
    !!defaultInputs &&
    isFieldModifiedHelper(currentInputs?.[f.fieldKey], defaultInputs[f.fieldKey]);

  // Pasangan toggle dihitung 1 perubahan
  const countModified = (sections) =>
    sections.reduce(
      (sum, section) =>
        sum +
        (section.fields || []).filter(isModifiedField).length +
        (section.toggles?.some((t) => t.isModified) ? 1 : 0),
      0
    );
  const dimModifiedCount = countModified(dimensionSections);
  const priceModifiedCount = countModified(priceSections);

  const modifiedSummary = [
    dimModifiedCount ? `${dimModifiedCount} dimensi` : null,
    priceModifiedCount ? `${priceModifiedCount} harga satuan` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const columnsFor = (w) => Math.max(1, Math.floor(w / MIN_FIELD_WIDTH));
  const dimColumns = columnsFor(dimWidth);
  const priceColumns = columnsFor(resultWidth);

  const handleTabSwitch = (tab) => {
    setActiveResultTab(tab);
  };

  const handleShare = async () => {
    try {
      if (!results) return;
      let msg = `*ESTIMATOR — ${title}*\n`;
      if (isAnyModified) {
        msg += `[Status: ${modifiedInfo.count} Parameter Disesuaikan *]\n`;
      }
      msg += `==============================\n`;
      msg += `TOTAL BIAYA: ${formatRupiah(results.grandTotal)}${mark}\n`;
      msg += `• Total Upah Tenaga: ${formatRupiah(results.totalUpah)}${mark}\n`;
      msg += `• Total Bahan/Material: ${formatRupiah(results.totalBahan)}${mark}\n\n`;

      msg += `*Rincian Tenaga Kerja:*\n`;
      results.tenagaKerja?.forEach((t) => {
        msg += `• ${t.uraian}: ${formatNumber(t.volume, 2)} ${t.satuan} = ${formatRupiah(t.subtotal)}\n`;
      });

      msg += `\n*Rincian Bahan Utama:*\n`;
      results.bahan?.slice(0, 8).forEach((b) => {
        msg += `• ${b.uraian}: ${formatNumber(b.volume, 2)} ${b.satuan} = ${formatRupiah(b.subtotal)}\n`;
      });
      if (results.bahan?.length > 8) {
        msg += `• ... dan ${results.bahan.length - 8} material lainnya.\n`;
      }

      if (isAnyModified) {
        msg += `\n_*) Dihitung berdasarkan nilai input yang disesuaikan._\n`;
      }
      msg += `\n_Dihitung otomatis via Aplikasi Estimator_`;
      await Share.share({ message: msg });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const renderField = (f, idx, columns) => {
    const isModified = isModifiedField(f);

    return (
      <View key={f.fieldKey || idx} style={{ width: `${100 / columns}%`, padding: 4 }}>
        <View style={styles.fieldLabelRow}>
          <Text style={[styles.fieldLabel, isModified && styles.fieldLabelModified]} numberOfLines={1}>
            {f.symbol ? <Text style={styles.fieldSymbol}>{f.symbol}  </Text> : null}
            {f.label}
            {isModified ? ' *' : ''}
          </Text>
          {/* Tombol kembali ke nilai awal, sekaligus menunjukkan nilai awalnya */}
          {isModified && onResetField ? (
            <TouchableOpacity
              style={styles.resetChip}
              onPress={() => onResetField(f.fieldKey)}
              hitSlop={8}
            >
              <Ionicons name="arrow-undo" size={10} color={colors.primaryDark} />
              <Text style={styles.resetChipText} numberOfLines={1}>
                {String(defaultInputs[f.fieldKey])}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[styles.inputBox, compact && styles.inputBoxCompact, isModified && styles.inputBoxModified]}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(f.value ?? '')}
            onChangeText={f.onChange}
            selectTextOnFocus
          />
          {f.unit ? <Text style={styles.unit}>{f.unit}</Text> : null}
        </View>
      </View>
    );
  };

  const renderTable = (heading, total, rows) => (
    <View style={styles.tableBlock}>
      <View style={styles.tableHeading}>
        <Text style={styles.tableHeadingText}>{heading}</Text>
        <Text style={styles.tableHeadingTotal}>{formatRupiah(total)}</Text>
      </View>
      <View style={styles.tr}>
        <Text style={[styles.th, styles.cName]}>Uraian</Text>
        <Text style={[styles.th, styles.cVol]}>Volume</Text>
        <Text style={[styles.th, styles.cPrice]}>Harga</Text>
        <Text style={[styles.th, styles.cSub]}>Jumlah</Text>
      </View>
      {rows?.map((r, i) => (
        <View key={i} style={[styles.tr, styles.trBody]}>
          <Text style={[styles.td, styles.cName]} numberOfLines={1}>{r.uraian}</Text>
          <Text style={[styles.td, styles.cVol]} numberOfLines={1}>
            {formatNumber(r.volume, 2)} <Text style={styles.tdMuted}>{r.satuan}</Text>
          </Text>
          <Text style={[styles.td, styles.cPrice]} numberOfLines={1}>
            {formatNumber(r.harga ?? r.hargaSatuan, 0)}
          </Text>
          <Text style={[styles.td, styles.cSub, styles.tdStrong]} numberOfLines={1}>
            {formatRupiah(r.subtotal)}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SkylineWatermarkBackground style={styles.container}>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, compact && styles.contentCompact]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      {/* ATAS: gambar ilustrasi & ringkasan */}
      <View style={[styles.rowTop, { height: topHeight }, compact && styles.gapCompact]}>
        {/* Kuadran 1: gambar ilustrasi */}
        <TouchableOpacity
          style={[styles.card, styles.q1]}
          onPress={() => setShowImageModal(true)}
          activeOpacity={0.9}
        >
          {currentDiagram?.source ? (
            <Image source={currentDiagram.source} style={styles.diagram} resizeMode="contain" />
          ) : (
            <View style={styles.diagramEmpty}>
              <Ionicons name="image-outline" size={28} color={colors.textMuted} />
            </View>
          )}

          {diagramList.length > 1 ? (
            <View style={styles.diagramTabs}>
              {diagramList.map((d, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.diagramTab, activeDiagramIndex === idx && styles.diagramTabActive]}
                  onPress={() => setActiveDiagramIndex(idx)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.diagramTabText, activeDiagramIndex === idx && styles.diagramTabTextActive]}
                    numberOfLines={1}
                  >
                    Gambar {idx + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <View style={styles.zoomBtn}>
            <Ionicons name="expand-outline" size={14} color={colors.text} />
          </View>
        </TouchableOpacity>

        {/* Kuadran 2: logo, judul & total */}
        <View style={[styles.card, styles.q2]}>
          <View style={styles.q2Head}>
            <Image
              source={require('../../assets/brand/logo_icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              {subtitle && !compact ? (
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
              ) : null}
            </View>
            {isAnyModified && onReset ? (
              <TouchableOpacity style={styles.iconBtn} onPress={onReset} hitSlop={6}>
                <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare} hitSlop={6}>
              <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel} numberOfLines={1}>
              Total estimasi biaya
              {isAnyModified ? (
                <Text style={styles.modMark}>{`  * Diubah: ${modifiedSummary || modifiedInfo.count + ' nilai'}`}</Text>
              ) : null}
            </Text>
            <Text style={[styles.totalValue, compact && styles.totalValueCompact]} numberOfLines={1} adjustsFontSizeToFit>
              {formatRupiah(results?.grandTotal || 0)}{mark}
            </Text>
            <Text style={styles.totalBreakdown} numberOfLines={1}>
              Upah {formatRupiah(results?.totalUpah || 0)}  ·  Bahan {formatRupiah(results?.totalBahan || 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* BAWAH: input dimensi & hasil */}
      <View style={[styles.rowBottom, compact && styles.gapCompact]}>
        {/* Kuadran 3: dimensi & volume */}
        <View
          style={[styles.card, styles.q3]}
          onLayout={(e) => setDimWidth(e.nativeEvent.layout.width - 16)}
        >
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>Dimensi & volume</Text>
            {dimModifiedCount ? (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{dimModifiedCount} diubah</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.panelBody}>
            {dimensionSections.map((section, sIdx) => (
              <View key={sIdx} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {section.title}
                  {countModified([section]) ? (
                    <Text style={styles.sectionModified}>{`  ·  ${countModified([section])} diubah`}</Text>
                  ) : null}
                </Text>

                {section.toggles?.length ? (
                  <View style={styles.toggles}>
                    {section.toggles.map((tog, tIdx) => (
                      <TouchableOpacity
                        key={tIdx}
                        style={[styles.toggle, tog.active && styles.toggleActive]}
                        onPress={tog.onPress}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={tog.active ? 'radio-button-on' : 'radio-button-off'}
                          size={14}
                          color={tog.active ? colors.primary : colors.textMuted}
                        />
                        <Text style={[styles.toggleText, tog.active && styles.toggleTextActive]}>
                          {tog.label}
                          {tog.isModified ? <Text style={styles.modMark}> *</Text> : null}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {section.fields?.length ? (
                  <View style={styles.grid}>
                    {section.fields.map((f, i) => renderField(f, i, dimColumns))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        {/* Kuadran 4: harga satuan upah/bahan & hasil */}
        <View
          style={[styles.card, styles.q4]}
          onLayout={(e) => setResultWidth(e.nativeEvent.layout.width - 16)}
        >
          <View style={styles.segment}>
            {RESULT_TABS.map((tab) => {
              const active = activeResultTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => handleTabSwitch(tab.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.segmentLabelRow}>
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                      {tab.label}
                    </Text>
                    {/* Harga satuan tersembunyi di balik tab: tandai jika ada yang diubah */}
                    {tab.id === 'prices' && priceModifiedCount ? (
                      <View style={styles.tabDot}>
                        <Text style={styles.tabDotText}>{priceModifiedCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.panelBody}>
            {activeResultTab === 'rab' && results ? (
              <>
                {renderTable('Upah tenaga kerja', results.totalUpah, results.tenagaKerja)}
                {renderTable('Bahan / material', results.totalBahan, results.bahan)}
              </>
            ) : null}

            {activeResultTab === 'volume' && results ? (
              <View style={styles.tableBlock}>
                <View style={styles.tr}>
                  <Text style={[styles.th, { flex: 3 }]}>Item pekerjaan</Text>
                  <Text style={[styles.th, { flex: 1.4, textAlign: 'right' }]}>Volume</Text>
                </View>
                {volumeRows.map((v, i) => (
                  <View key={i} style={[styles.tr, styles.trBody]}>
                    <Text style={[styles.td, { flex: 3 }]} numberOfLines={1}>{v.uraian}</Text>
                    <Text style={[styles.td, styles.tdStrong, { flex: 1.4, textAlign: 'right' }]}>
                      {formatNumber(v.volume, 3)} <Text style={styles.tdMuted}>{v.satuan}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {activeResultTab === 'prices'
              ? priceSections.map((section, sIdx) => (
                  <View key={sIdx} style={styles.section}>
                    <Text style={styles.sectionTitle}>
                  {section.title}
                  {countModified([section]) ? (
                    <Text style={styles.sectionModified}>{`  ·  ${countModified([section])} diubah`}</Text>
                  ) : null}
                </Text>
                    <View style={styles.grid}>
                      {section.fields?.map((f, i) => renderField(f, i, priceColumns))}
                    </View>
                  </View>
                ))
              : null}
          </View>
        </View>
      </View>

      {/* Perbesar gambar */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {currentDiagram?.title || diagramTitle}
            </Text>
            <TouchableOpacity onPress={() => setShowImageModal(false)} hitSlop={10}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {currentDiagram?.source ? (
            <Image source={currentDiagram.source} style={styles.modalImage} resizeMode="contain" />
          ) : null}
        </View>
      </Modal>
    </ScrollView>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 10,
    gap: 10,
  },
  contentCompact: {
    padding: 8,
    gap: 8,
  },
  gapCompact: {
    gap: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },

  // Baris atas: tinggi diatur dari tinggi layar (topHeight)
  rowTop: {
    flexDirection: 'row',
    gap: 10,
  },
  q1: {
    flex: 1.4,
  },
  diagram: {
    width: '100%',
    height: '100%',
  },
  diagramEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagramTabs: {
    position: 'absolute',
    left: 6,
    top: 6,
    flexDirection: 'row',
    gap: 4,
  },
  diagramTab: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  diagramTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  diagramTabText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textSecondary,
  },
  diagramTabTextActive: {
    color: '#FFFFFF',
  },
  zoomBtn: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  q2: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  q2Head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textMuted,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalWrap: {
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  totalValue: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    lineHeight: 30,
    color: colors.primary,
  },
  totalValueCompact: {
    fontSize: 19,
    lineHeight: 25,
  },
  totalBreakdown: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  modMark: {
    fontFamily: fonts.medium,
    color: colors.primary,
  },

  // Baris bawah: tinggi mengikuti isi; halaman yang di-scroll, bukan kartu
  rowBottom: {
    flexDirection: 'row',
    gap: 10,
  },
  q3: {
    flex: 1,
  },
  q4: {
    flex: 1.15,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    marginTop: 6,
  },
  countBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.primaryDark,
  },
  panelTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
  },
  panelBody: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  section: {
    marginTop: 6,
  },
  sectionModified: {
    color: colors.primary,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingHorizontal: 4,
    paddingTop: 4,
  },

  // Input
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  fieldLabel: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  fieldLabelModified: {
    fontFamily: fonts.medium,
    color: colors.primaryDark,
  },
  resetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: 80,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  resetChipText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.primaryDark,
  },
  fieldSymbol: {
    fontFamily: fonts.semibold,
    color: colors.primaryDark,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surfaceMuted,
  },
  inputBoxCompact: {
    height: 32,
  },
  inputBoxModified: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryGhost,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
    paddingVertical: 0,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 4,
  },

  toggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 4,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  toggleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGhost,
  },
  toggleText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    fontFamily: fonts.medium,
    color: colors.text,
  },

  // Tab hasil
  segment: {
    flexDirection: 'row',
    margin: 8,
    marginBottom: 2,
    padding: 3,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabDot: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDotText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 14,
    color: '#FFFFFF',
  },
  segmentText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },

  // Tabel
  tableBlock: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  tableHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  tableHeadingText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
  },
  tableHeadingTotal: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.primary,
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 6,
  },
  trBody: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  th: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
  },
  td: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.text,
  },
  tdMuted: {
    fontSize: 10,
    color: colors.textMuted,
  },
  tdStrong: {
    fontFamily: fonts.medium,
  },
  cName: { flex: 2.2 },
  cVol: { flex: 1.3, textAlign: 'right' },
  cPrice: { flex: 1.3, textAlign: 'right' },
  cSub: { flex: 1.7, textAlign: 'right' },

  // Modal gambar
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,15,15,0.92)',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  modalTitle: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#FFFFFF',
  },
  modalImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});
