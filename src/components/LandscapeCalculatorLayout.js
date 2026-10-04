import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { formatRupiah, formatNumber } from '../utils/constructionCalculations';
import {
  isFieldModified as isFieldModifiedHelper,
  checkModifiedInputs,
} from '../utils/modificationHelper';
import SkylineWatermarkBackground from './SkylineWatermarkBackground';

export default function LandscapeCalculatorLayout({
  title,
  subtitle,
  iconName = 'calculator-outline',
  diagramSource,
  diagramTitle = 'Panduan Gambar Teknis',
  diagrams,
  inputSections = [],
  results,
  defaultInputs,
  currentInputs,
  onResetField,
  onSave,
  onReset,
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('rab'); // 'rab' | 'volume' | 'prices'
  const [activeDiagramIndex, setActiveDiagramIndex] = useState(0);
  const rightScrollRef = useRef(null);

  // Normalize diagrams list
  const diagramList =
    diagrams && diagrams.length > 0
      ? diagrams
      : diagramSource
      ? [{ title: diagramTitle, tabLabel: diagramTitle, source: diagramSource }]
      : [];

  const hasDiagrams = diagramList.length > 0;
  const currentDiagram = diagramList[activeDiagramIndex] || diagramList[0];

  // Periksa modifikasi parameter terhadap default Excel
  const modifiedInfo = checkModifiedInputs(currentInputs, defaultInputs);
  const isAnyModified = modifiedInfo.isModified;

  // Pisahkan inputSections menjadi:
  // 1. Dimensi & Geometri & Toggles -> Kuadran 3 (Kiri Bawah)
  // 2. Harga Satuan Upah & Bahan -> Kuadran 4 (Kanan Bawah)
  const isPriceSection = (section) => {
    const t = (section.title || '').toLowerCase();
    return (
      t.includes('harga') ||
      t.includes('upah') ||
      t.includes('bahan') ||
      t.includes('material') ||
      t.includes('tarif')
    );
  };

  const dimensionSections = inputSections.filter((s) => !isPriceSection(s));
  const priceSections = inputSections.filter((s) => isPriceSection(s));

  const handleTabSwitch = (tab) => {
    setActiveResultTab(tab);
    if (rightScrollRef.current) {
      rightScrollRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  const handleShare = async () => {
    try {
      if (!results) return;
      let msg = `*ESTIMATOR — ${title}*\n`;
      if (isAnyModified) {
        msg += `[Status: ${modifiedInfo.count} Parameter Disesuaikan *]\n`;
      }
      msg += `==============================\n`;
      msg += `TOTAL BIAYA: ${formatRupiah(results.grandTotal)}${
        isAnyModified ? ' *' : ''
      }\n`;
      msg += `• Total Upah Tenaga: ${formatRupiah(results.totalUpah)}${
        isAnyModified ? ' *' : ''
      }\n`;
      msg += `• Total Bahan/Material: ${formatRupiah(results.totalBahan)}${
        isAnyModified ? ' *' : ''
      }\n\n`;

      msg += `*Rincian Tenaga Kerja:*\n`;
      results.tenagaKerja?.forEach((t) => {
        msg += `• ${t.uraian}: ${formatNumber(t.volume, 2)} ${t.satuan} = ${formatRupiah(
          t.subtotal
        )}\n`;
      });

      msg += `\n*Rincian Bahan Utama:*\n`;
      results.bahan?.slice(0, 8).forEach((b) => {
        msg += `• ${b.uraian}: ${formatNumber(b.volume, 2)} ${b.satuan} = ${formatRupiah(
          b.subtotal
        )}\n`;
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

  return (
    <SkylineWatermarkBackground style={styles.container}>
      {/* 4-QUADRANT LAYOUT (SESUAI GAMBAR 3) */}
      <View style={styles.quadrantsContainer}>
        {/* ROW 1: TOP ROW (KUADRAN 1 & KUADRAN 2) */}
        <View style={styles.rowTop}>
          {/* ======================================================== */}
          {/* KUADRAN 1: GAMBAR ILUSTRASI JENIS PEKERJAAN (KIRI-ATAS) */}
          {/* ======================================================== */}
          <View style={styles.quadrant1Card}>
            <View style={styles.quadrantHeaderRow}>
              <View style={styles.quadrantTitleWrap}>
                <Ionicons name="image" size={15} color={colors.primary} />
                <Text style={styles.quadrantTitleText}>
                  GAMBAR ILUSTRASI PEKERJAAN
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnZoom}
                onPress={() => setShowImageModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="expand" size={12} color="#FFFFFF" />
                <Text style={styles.btnZoomText}>Perbesar</Text>
              </TouchableOpacity>
            </View>

            {/* Switcher Tab jika ada lebih dari 1 gambar */}
            {diagramList.length > 1 && (
              <View style={styles.diagramTabsRow}>
                {diagramList.map((d, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.diagramTabBtn,
                      activeDiagramIndex === idx && styles.diagramTabBtnActive,
                    ]}
                    onPress={() => setActiveDiagramIndex(idx)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="layers-outline"
                      size={11}
                      color={
                        activeDiagramIndex === idx ? '#FFFFFF' : '#64748B'
                      }
                    />
                    <Text
                      style={[
                        styles.diagramTabBtnText,
                        activeDiagramIndex === idx &&
                          styles.diagramTabBtnTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {d.tabLabel || d.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Area Tampilan Gambar Ilustrasi */}
            <TouchableOpacity
              style={styles.diagramImageContainer}
              onPress={() => setShowImageModal(true)}
              activeOpacity={0.9}
            >
              {hasDiagrams && currentDiagram.source ? (
                <Image
                  source={currentDiagram.source}
                  style={styles.diagramImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.diagramPlaceholder}>
                  <Ionicons name="image-outline" size={36} color="#CBD5E1" />
                  <Text style={styles.diagramPlaceholderText}>
                    Gambar ilustrasi teknis
                  </Text>
                </View>
              )}
              <View style={styles.diagramCaptionBar}>
                <Text style={styles.diagramCaptionText} numberOfLines={1}>
                  {currentDiagram?.title || diagramTitle}
                </Text>
                <Text style={styles.tapToZoomHint}>Ketuk untuk zoom</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ======================================================== */}
          {/* KUADRAN 2: LOGO ESTIMATOR & HEADER AKSI (KANAN-ATAS) */}
          {/* ======================================================== */}
          <View style={styles.quadrant2Card}>
            {/* Header dengan Logo Estimator Resmi & Judul */}
            <View style={styles.q2TopRow}>
              <View style={styles.q2BrandWrap}>
                <Image
                  source={require('../../assets/brand/logo_with_text.png')}
                  style={styles.q2LogoImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.q2TitleWrap}>
                <View style={styles.q2TitleBadgeRow}>
                  <Text style={styles.q2PageTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  {isAnyModified && (
                    <View style={styles.q2ModifiedBadge}>
                      <Text style={styles.q2ModifiedBadgeText}>* Kustom</Text>
                    </View>
                  )}
                </View>
                {subtitle ? (
                  <Text style={styles.q2PageSubtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Kartu Highlight Grand Total Biaya */}
            <View style={styles.q2TotalCard}>
              <View style={styles.q2TotalCardLeft}>
                <Text style={styles.q2TotalLabel}>TOTAL ESTIMASI BIAYA</Text>
                <View style={styles.q2TotalValueRow}>
                  <Text style={styles.q2TotalValue}>
                    {results ? formatRupiah(results.grandTotal) : 'Rp 0'}
                  </Text>
                  {isAnyModified && <Text style={styles.q2AsteriskMark}>*</Text>}
                </View>
                <View style={styles.q2MiniBreakdownRow}>
                  <Text style={styles.q2MiniBreakdownText}>
                    Upah: {results ? formatRupiah(results.totalUpah) : 'Rp 0'}
                  </Text>
                  <Text style={styles.q2MiniDot}>•</Text>
                  <Text style={styles.q2MiniBreakdownText}>
                    Bahan: {results ? formatRupiah(results.totalBahan) : 'Rp 0'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons: Simpan & Bagikan */}
              <View style={styles.q2ActionButtons}>
                <TouchableOpacity
                  style={styles.btnSimpan}
                  onPress={onSave}
                  activeOpacity={0.8}
                >
                  <Ionicons name="save" size={13} color="#FFFFFF" />
                  <Text style={styles.btnSimpanText}>Simpan RAB</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnShare}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-whatsapp" size={13} color="#FFFFFF" />
                  <Text style={styles.btnShareText}>Bagikan WA</Text>
                </TouchableOpacity>

                {isAnyModified && onReset && (
                  <TouchableOpacity
                    style={styles.btnResetStandar}
                    onPress={onReset}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={12} color={colors.primaryDark} />
                    <Text style={styles.btnResetStandarText}>Reset</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* ROW 2: BOTTOM ROW (KUADRAN 3 & KUADRAN 4) */}
        <View style={styles.rowBottom}>
          {/* ======================================================== */}
          {/* KUADRAN 3: KOLOM DIMENSI DAN VOLUME (KIRI-BAWAH) */}
          {/* ======================================================== */}
          <View style={styles.quadrant3Card}>
            <View style={styles.quadrantHeaderRow}>
              <View style={styles.quadrantTitleWrap}>
                <Ionicons name="resize-outline" size={15} color={colors.primary} />
                <Text style={styles.quadrantTitleText}>
                  KOLOM DIMENSI & VOLUME
                </Text>
              </View>

              {isAnyModified && (
                <View style={styles.q3ModCountBadge}>
                  <Text style={styles.q3ModCountText}>
                    {modifiedInfo.count} nilai diubah (*)
                  </Text>
                </View>
              )}
            </View>

            <ScrollView
              style={styles.q3ScrollArea}
              contentContainerStyle={styles.q3ScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {dimensionSections.map((section, sIdx) => (
                <View key={sIdx} style={styles.dimSectionBox}>
                  <View style={styles.dimSectionHeader}>
                    <Ionicons
                      name={section.icon || 'options-outline'}
                      size={13}
                      color={colors.primary}
                    />
                    <Text style={styles.dimSectionTitle}>{section.title}</Text>
                  </View>

                  {section.subtitle && (
                    <Text style={styles.dimSectionSubtitle}>
                      {section.subtitle}
                    </Text>
                  )}

                  {/* Toggle Pilihan (e.g. Mortar 1:3 vs 1:4) */}
                  {section.toggles && section.toggles.length > 0 && (
                    <View style={styles.toggleGroupContainer}>
                      {section.toggles.map((tog, tIdx) => (
                        <TouchableOpacity
                          key={tIdx}
                          style={[
                            styles.toggleOptionBtn,
                            tog.active && styles.toggleOptionBtnActive,
                            tog.isModified && styles.toggleOptionModified,
                          ]}
                          onPress={tog.onPress}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name={tog.active ? 'radio-button-on' : 'radio-button-off'}
                            size={14}
                            color={tog.active ? colors.primary : '#94A3B8'}
                          />
                          <Text
                            style={[
                              styles.toggleOptionText,
                              tog.active && styles.toggleOptionTextActive,
                            ]}
                          >
                            {tog.label}
                            {tog.isModified ? ' *' : ''}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Input Fields Dimensi */}
                  {section.fields && section.fields.length > 0 && (
                    <View style={styles.fieldsGrid}>
                      {section.fields.map((f, fIdx) => {
                        const isModified =
                          f.fieldKey &&
                          defaultInputs &&
                          isFieldModifiedHelper(
                            f.fieldKey,
                            currentInputs?.[f.fieldKey],
                            defaultInputs?.[f.fieldKey]
                          );

                        return (
                          <View
                            key={fIdx}
                            style={[
                              styles.fieldCard,
                              isModified && styles.fieldCardModified,
                            ]}
                          >
                            <View style={styles.fieldLabelRow}>
                              {f.symbol && (
                                <View style={styles.symbolPill}>
                                  <Text style={styles.symbolPillText}>
                                    {f.symbol}
                                  </Text>
                                </View>
                              )}
                              <Text
                                style={[
                                  styles.fieldLabelText,
                                  isModified && styles.fieldLabelTextModified,
                                ]}
                                numberOfLines={1}
                              >
                                {f.label}
                                {isModified && ' *'}
                              </Text>

                              {isModified && onResetField && f.fieldKey && (
                                <TouchableOpacity
                                  style={styles.fieldResetBtn}
                                  onPress={() => onResetField(f.fieldKey)}
                                  activeOpacity={0.7}
                                >
                                  <Ionicons
                                    name="refresh-outline"
                                    size={11}
                                    color="#B45309"
                                  />
                                </TouchableOpacity>
                              )}
                            </View>

                            <View style={styles.fieldInputContainer}>
                              <TextInput
                                style={[
                                  styles.dimTextInput,
                                  isModified && styles.dimTextInputModified,
                                ]}
                                keyboardType="numeric"
                                value={String(f.value ?? '')}
                                onChangeText={f.onChange}
                                selectTextOnFocus={true}
                              />
                              <Text style={styles.dimUnitText}>{f.unit}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ======================================================== */}
          {/* KUADRAN 4: HARGA SATUAN UPAH/BAHAN & HASIL (KANAN-BAWAH) */}
          {/* ======================================================== */}
          <View style={styles.quadrant4Card}>
            {/* Header dengan Tab Switcher: Input Harga vs Tabel RAB vs Rekap Volume */}
            <View style={styles.q4HeaderBar}>
              <View style={styles.q4TabsRow}>
                <TouchableOpacity
                  style={[
                    styles.q4TabItem,
                    activeResultTab === 'rab' && styles.q4TabItemActive,
                  ]}
                  onPress={() => handleTabSwitch('rab')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="receipt"
                    size={12}
                    color={activeResultTab === 'rab' ? '#FFFFFF' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.q4TabLabel,
                      activeResultTab === 'rab' && styles.q4TabLabelActive,
                    ]}
                  >
                    Tabel RAB (Biaya)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.q4TabItem,
                    activeResultTab === 'volume' && styles.q4TabItemActive,
                  ]}
                  onPress={() => handleTabSwitch('volume')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="stats-chart"
                    size={12}
                    color={activeResultTab === 'volume' ? '#FFFFFF' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.q4TabLabel,
                      activeResultTab === 'volume' && styles.q4TabLabelActive,
                    ]}
                  >
                    Rekap Volume Fisik
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.q4TabItem,
                    activeResultTab === 'prices' && styles.q4TabItemActive,
                  ]}
                  onPress={() => handleTabSwitch('prices')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="pricetags"
                    size={12}
                    color={activeResultTab === 'prices' ? '#FFFFFF' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.q4TabLabel,
                      activeResultTab === 'prices' && styles.q4TabLabelActive,
                    ]}
                  >
                    Harga Satuan ({priceSections.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Area Kuadran 4 */}
            <ScrollView
              ref={rightScrollRef}
              style={styles.q4ScrollArea}
              contentContainerStyle={styles.q4ScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {/* TAB 1: TABEL BIAYA RAB (UPAH & BAHAN) */}
              {activeResultTab === 'rab' && results && (
                <View style={styles.tabContentWrap}>
                  {/* Sub-Tabel Tenaga Kerja */}
                  <View style={styles.ahspTableCard}>
                    <View style={styles.ahspTableCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="people" size={13} color={colors.primary} />
                        <Text style={styles.ahspTableCardTitle}>
                          A. Rincian Upah Tenaga Kerja
                        </Text>
                      </View>
                      <Text style={styles.ahspTableCardTotal}>
                        {formatRupiah(results.totalUpah)}
                      </Text>
                    </View>

                    <View style={styles.tableHeaderRow}>
                      <Text style={[styles.thCell, { flex: 2.5 }]}>Uraian Tenaga</Text>
                      <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Vol</Text>
                      <Text style={[styles.thCell, { flex: 0.8, textAlign: 'center' }]}>Sat</Text>
                      <Text style={[styles.thCell, { flex: 1.5, textAlign: 'right' }]}>Harga</Text>
                      <Text style={[styles.thCell, { flex: 1.7, textAlign: 'right' }]}>Subtotal</Text>
                    </View>

                    {results.tenagaKerja?.map((t, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.tableRow,
                          idx % 2 === 1 && styles.tableRowAlt,
                        ]}
                      >
                        <Text style={[styles.tdCell, { flex: 2.5 }]} numberOfLines={1}>
                          {t.uraian}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 1, textAlign: 'right' }]}>
                          {formatNumber(t.volume, 2)}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 0.8, textAlign: 'center', color: '#64748B' }]}>
                          {t.satuan}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 1.5, textAlign: 'right' }]}>
                          {formatNumber(t.hargaSatuan, 0)}
                        </Text>
                        <Text
                          style={[
                            styles.tdCell,
                            { flex: 1.7, textAlign: 'right', fontWeight: '700', color: colors.primaryDark },
                          ]}
                        >
                          {formatRupiah(t.subtotal)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Sub-Tabel Bahan Material */}
                  <View style={styles.ahspTableCard}>
                    <View style={styles.ahspTableCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="cube" size={13} color={colors.primary} />
                        <Text style={styles.ahspTableCardTitle}>
                          B. Rincian Bahan / Material
                        </Text>
                      </View>
                      <Text style={styles.ahspTableCardTotal}>
                        {formatRupiah(results.totalBahan)}
                      </Text>
                    </View>

                    <View style={styles.tableHeaderRow}>
                      <Text style={[styles.thCell, { flex: 2.5 }]}>Uraian Bahan</Text>
                      <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Vol</Text>
                      <Text style={[styles.thCell, { flex: 0.8, textAlign: 'center' }]}>Sat</Text>
                      <Text style={[styles.thCell, { flex: 1.5, textAlign: 'right' }]}>Harga</Text>
                      <Text style={[styles.thCell, { flex: 1.7, textAlign: 'right' }]}>Subtotal</Text>
                    </View>

                    {results.bahan?.map((b, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.tableRow,
                          idx % 2 === 1 && styles.tableRowAlt,
                        ]}
                      >
                        <Text style={[styles.tdCell, { flex: 2.5 }]} numberOfLines={1}>
                          {b.uraian}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 1, textAlign: 'right' }]}>
                          {formatNumber(b.volume, 2)}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 0.8, textAlign: 'center', color: '#64748B' }]}>
                          {b.satuan}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 1.5, textAlign: 'right' }]}>
                          {formatNumber(b.hargaSatuan, 0)}
                        </Text>
                        <Text
                          style={[
                            styles.tdCell,
                            { flex: 1.7, textAlign: 'right', fontWeight: '700', color: colors.primaryDark },
                          ]}
                        >
                          {formatRupiah(b.subtotal)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 2: REKAP VOLUME FISIK */}
              {activeResultTab === 'volume' && results && (
                <View style={styles.tabContentWrap}>
                  <View style={styles.ahspTableCard}>
                    <View style={styles.ahspTableCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="stats-chart" size={13} color={colors.primary} />
                        <Text style={styles.ahspTableCardTitle}>
                          Rekapitulasi Volume Fisik Pekerjaan
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tableHeaderRow}>
                      <Text style={[styles.thCell, { flex: 3.5 }]}>Item Pekerjaan Fisik</Text>
                      <Text style={[styles.thCell, { flex: 1.5, textAlign: 'right' }]}>Volume</Text>
                      <Text style={[styles.thCell, { flex: 1, textAlign: 'center' }]}>Satuan</Text>
                    </View>

                    {results.volumePekerjaan?.map((v, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.tableRow,
                          idx % 2 === 1 && styles.tableRowAlt,
                        ]}
                      >
                        <Text style={[styles.tdCell, { flex: 3.5 }]} numberOfLines={1}>
                          {v.uraian}
                        </Text>
                        <Text
                          style={[
                            styles.tdCell,
                            { flex: 1.5, textAlign: 'right', fontWeight: '700', color: colors.primaryDark },
                          ]}
                        >
                          {formatNumber(v.volume, 3)}
                        </Text>
                        <Text style={[styles.tdCell, { flex: 1, textAlign: 'center', color: '#64748B' }]}>
                          {v.satuan}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 3: INPUT HARGA SATUAN UPAH & BAHAN */}
              {activeResultTab === 'prices' && (
                <View style={styles.tabContentWrap}>
                  {priceSections.map((section, sIdx) => (
                    <View key={sIdx} style={styles.dimSectionBox}>
                      <View style={styles.dimSectionHeader}>
                        <Ionicons
                          name={section.icon || 'pricetags-outline'}
                          size={13}
                          color={colors.primary}
                        />
                        <Text style={styles.dimSectionTitle}>{section.title}</Text>
                      </View>

                      <View style={styles.fieldsGrid}>
                        {section.fields?.map((f, fIdx) => {
                          const isModified =
                            f.fieldKey &&
                            defaultInputs &&
                            isFieldModifiedHelper(
                              f.fieldKey,
                              currentInputs?.[f.fieldKey],
                              defaultInputs?.[f.fieldKey]
                            );

                          return (
                            <View
                              key={fIdx}
                              style={[
                                styles.fieldCard,
                                isModified && styles.fieldCardModified,
                              ]}
                            >
                              <View style={styles.fieldLabelRow}>
                                <Text
                                  style={[
                                    styles.fieldLabelText,
                                    isModified && styles.fieldLabelTextModified,
                                  ]}
                                  numberOfLines={1}
                                >
                                  {f.label}
                                  {isModified && ' *'}
                                </Text>

                                {isModified && onResetField && f.fieldKey && (
                                  <TouchableOpacity
                                    style={styles.fieldResetBtn}
                                    onPress={() => onResetField(f.fieldKey)}
                                    activeOpacity={0.7}
                                  >
                                    <Ionicons
                                      name="refresh-outline"
                                      size={11}
                                      color="#B45309"
                                    />
                                  </TouchableOpacity>
                                )}
                              </View>

                              <View style={styles.fieldInputContainer}>
                                <TextInput
                                  style={[
                                    styles.dimTextInput,
                                    isModified && styles.dimTextInputModified,
                                  ]}
                                  keyboardType="numeric"
                                  value={String(f.value ?? '')}
                                  onChangeText={f.onChange}
                                  selectTextOnFocus={true}
                                />
                                <Text style={styles.dimUnitText}>{f.unit}</Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Bottom Bar Kuadran 4: Ringkasan Grand Total Tetap Terlihat */}
            <View style={styles.q4BottomBar}>
              <View style={styles.q4BottomRow}>
                <View>
                  <Text style={styles.q4BottomLabel}>TOTAL UPAH</Text>
                  <Text style={styles.q4BottomSubVal}>
                    {results ? formatRupiah(results.totalUpah) : 'Rp 0'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.q4BottomLabel}>TOTAL BAHAN</Text>
                  <Text style={styles.q4BottomSubVal}>
                    {results ? formatRupiah(results.totalBahan) : 'Rp 0'}
                  </Text>
                </View>
                <View style={styles.q4BottomTotalWrap}>
                  <Text style={styles.q4BottomGrandLabel}>GRAND TOTAL RAB</Text>
                  <Text style={styles.q4BottomGrandVal}>
                    {results ? formatRupiah(results.grandTotal) : 'Rp 0'}
                    {isAnyModified && ' *'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* MODAL ZOOM GAMBAR ILUSTRASI */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {currentDiagram?.title || diagramTitle}
              </Text>
              <TouchableOpacity
                onPress={() => setShowImageModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageWrap}>
              {currentDiagram?.source && (
                <Image
                  source={currentDiagram.source}
                  style={styles.modalFullImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quadrantsContainer: {
    flex: 1,
    padding: 6,
    gap: 6,
  },
  rowTop: {
    flexDirection: 'row',
    height: '38%',
    gap: 6,
  },
  rowBottom: {
    flexDirection: 'row',
    height: '62%',
    gap: 6,
  },

  // KUADRAN 1: GAMBAR ILUSTRASI
  quadrant1Card: {
    flex: 0.46,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  quadrantHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
  },
  quadrantTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quadrantTitleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E1E1E',
    letterSpacing: 0.3,
  },
  btnZoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  btnZoomText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  diagramTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  diagramTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#EDF2F7',
  },
  diagramTabBtnActive: {
    backgroundColor: colors.primary,
  },
  diagramTabBtnText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  diagramTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  diagramImageContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  diagramImage: {
    width: '100%',
    height: '100%',
  },
  diagramPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagramPlaceholderText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  diagramCaptionBar: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 30, 30, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  diagramCaptionText: {
    fontSize: 8.5,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  tapToZoomHint: {
    fontSize: 8,
    color: '#FECA38',
    fontWeight: '700',
  },

  // KUADRAN 2: LOGO ESTIMATOR & HEADER AKSI
  quadrant2Card: {
    flex: 0.54,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    padding: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  q2TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  q2BrandWrap: {
    width: 110,
    height: 38,
    justifyContent: 'center',
  },
  q2LogoImage: {
    width: '100%',
    height: '100%',
  },
  q2TitleWrap: {
    flex: 1,
  },
  q2TitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  q2PageTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  q2PageSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  q2ModifiedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  q2ModifiedBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  q2TotalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  q2TotalCardLeft: {
    flex: 1,
  },
  q2TotalLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#C66503',
    letterSpacing: 0.4,
  },
  q2TotalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  q2TotalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  q2AsteriskMark: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
  },
  q2MiniBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  q2MiniBreakdownText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  q2MiniDot: {
    fontSize: 9,
    color: '#CBD5E1',
  },
  q2ActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  btnSimpan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 5,
  },
  btnSimpanText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 5,
  },
  btnShareText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnResetStandar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 5,
  },
  btnResetStandarText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  // KUADRAN 3: KOLOM DIMENSI & VOLUME
  quadrant3Card: {
    flex: 0.46,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  q3ModCountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  q3ModCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  q3ScrollArea: {
    flex: 1,
  },
  q3ScrollContent: {
    padding: 6,
    gap: 8,
  },
  dimSectionBox: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 6,
    padding: 6,
  },
  dimSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  dimSectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  dimSectionSubtitle: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 5,
  },
  toggleGroupContainer: {
    gap: 4,
    marginBottom: 4,
  },
  toggleOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toggleOptionBtnActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary,
  },
  toggleOptionModified: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  toggleOptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  toggleOptionTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  fieldCard: {
    width: '48.8%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    padding: 5,
  },
  fieldCardModified: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderLeftWidth: 3,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  symbolPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  symbolPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  fieldLabelText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  fieldLabelTextModified: {
    color: '#92400E',
    fontWeight: '700',
  },
  fieldResetBtn: {
    padding: 2,
  },
  fieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 6,
    height: 28,
  },
  dimTextInput: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    padding: 0,
  },
  dimTextInputModified: {
    color: '#B45309',
  },
  dimUnitText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 3,
  },

  // KUADRAN 4: HARGA SATUAN & HASIL
  quadrant4Card: {
    flex: 0.54,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'space-between',
  },
  q4HeaderBar: {
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  q4TabsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  q4TabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  q4TabItemActive: {
    backgroundColor: colors.primary,
  },
  q4TabLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  q4TabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  q4ScrollArea: {
    flex: 1,
  },
  q4ScrollContent: {
    padding: 6,
    gap: 6,
  },
  tabContentWrap: {
    gap: 6,
  },
  ahspTableCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  ahspTableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  ahspTableCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  ahspTableCardTotal: {
    fontSize: 10.5,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  thCell: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  tableRowAlt: {
    backgroundColor: '#FFFDF9',
  },
  tdCell: {
    fontSize: 9.5,
    color: '#1E1E1E',
  },
  q4BottomBar: {
    backgroundColor: '#FFF7ED',
    borderTopWidth: 1.5,
    borderTopColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  q4BottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  q4BottomLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
  },
  q4BottomSubVal: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  q4BottomTotalWrap: {
    alignItems: 'flex-end',
  },
  q4BottomGrandLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  q4BottomGrandVal: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary,
  },

  // MODAL ZOOM
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '90%',
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalImageWrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalFullImage: {
    width: '100%',
    height: '100%',
  },
});
