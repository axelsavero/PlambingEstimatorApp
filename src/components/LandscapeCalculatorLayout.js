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

export default function LandscapeCalculatorLayout({
  title,
  subtitle,
  iconName = 'calculator-outline',
  diagramSource,
  diagramTitle = 'Panduan Gambar Teknis',
  inputSections = [],
  results,
  defaultInputs,
  currentInputs,
  onResetField,
  onSave,
  onReset,
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('rab'); // 'rab' | 'volume'
  const rightScrollRef = useRef(null);

  // Periksa modifikasi parameter terhadap default Excel
  const modifiedInfo = checkModifiedInputs(currentInputs, defaultInputs);
  const isAnyModified = modifiedInfo.isModified;

  const handleTabSwitch = (tab) => {
    setActiveResultTab(tab);
    if (rightScrollRef.current) {
      rightScrollRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  const handleShare = async () => {
    try {
      if (!results) return;
      let msg = `*RABPro Estimator — ${title}*\n`;
      if (isAnyModified) {
        msg += `[Status: ${modifiedInfo.count} Parameter Kustom/Disesuaikan *]\n`;
      }
      msg += `==============================\n`;
      msg += `TOTAL BIAYA: ${formatRupiah(results.grandTotal)}${isAnyModified ? ' *' : ''}\n`;
      msg += `• Total Upah Tenaga: ${formatRupiah(results.totalUpah)}${isAnyModified ? ' *' : ''}\n`;
      msg += `• Total Bahan/Material: ${formatRupiah(results.totalBahan)}${isAnyModified ? ' *' : ''}\n\n`;

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
      msg += `\n_Dihitung otomatis via Aplikasi RABPro_`;
      await Share.share({ message: msg });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* 2-Column Split View for Landscape Mode */}
      <View style={styles.splitRow}>
        {/* KOLOM KIRI: INPUT & FORMULA */}
        <View style={styles.leftColumn}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            removeClippedSubviews={false}
          >
            {/* Header info */}
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name={iconName} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.pageTitle}>{title}</Text>
                    {isAnyModified ? (
                      <View style={styles.headerModifiedBadge}>
                        <Text style={styles.headerModifiedBadgeText}>* Disesuaikan</Text>
                      </View>
                    ) : null}
                  </View>
                  {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
                </View>
              </View>
            </View>

            {/* Banner Modifikasi Input (Jika ada nilai yang diubah) */}
            {isAnyModified ? (
              <View style={styles.inputModifiedBanner}>
                <View style={styles.inputModifiedBannerLeft}>
                  <Ionicons name="information-circle" size={16} color="#b45309" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputModifiedBannerTitle}>
                      {modifiedInfo.count} Parameter Diubah dari Standar Excel (*)
                    </Text>
                    <Text style={styles.inputModifiedBannerSubtitle}>
                      Kolom volume, upah & bahan di sisi kanan otomatis dihitung ulang.
                    </Text>
                  </View>
                </View>
                {onReset ? (
                  <TouchableOpacity
                    style={styles.btnBannerReset}
                    onPress={onReset}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={12} color="#b45309" />
                    <Text style={styles.btnBannerResetText}>Reset Standar</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            {/* Gambar Panduan Teknis Button / Preview */}
            {diagramSource ? (
              <View style={styles.diagramCard}>
                <View style={styles.diagramHeaderRow}>
                  <View style={styles.diagramTitleWrap}>
                    <Ionicons name="image-outline" size={16} color={colors.primary} />
                    <Text
                      style={styles.diagramTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {diagramTitle}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnZoom}
                    onPress={() => setShowImageModal(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="expand-outline" size={13} color="#ffffff" />
                    <Text style={styles.btnZoomText}>Perbesar</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setShowImageModal(true)}
                >
                  <Image
                    source={diagramSource}
                    style={styles.diagramThumbnail}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Dynamic Input Sections */}
            {inputSections.map((sec, idx) => (
              <View key={`sec-${idx}`} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name={sec.icon || 'options-outline'} size={16} color={colors.primary} />
                  <Text style={styles.cardHeaderTitle}>{sec.title}</Text>
                </View>

                {sec.subtitle ? (
                  <Text style={styles.cardHeaderSubtitle}>{sec.subtitle}</Text>
                ) : null}

                {/* Render toggles if any */}
                {sec.toggles ? (
                  <View style={styles.togglesRow}>
                    {sec.toggles.map((tog, tIdx) => (
                      <TouchableOpacity
                        key={`tog-${tIdx}`}
                        style={[styles.toggleBtn, tog.active && styles.toggleBtnActive]}
                        onPress={tog.onPress}
                      >
                        <Ionicons
                          name={tog.active ? 'radio-button-on' : 'radio-button-off'}
                          size={14}
                          color={tog.active ? colors.primary : colors.textMuted}
                        />
                        <Text style={[styles.toggleText, tog.active && styles.toggleTextActive]}>
                          {tog.label}
                        </Text>
                        {tog.isModified ? (
                          <Text style={styles.modifiedAsterisk}>*</Text>
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {/* Render Input Fields with Edit Detection */}
                <View style={styles.fieldsGrid}>
                  {sec.fields.map((f, fIdx) => {
                    const defaultValue = f.defaultValue !== undefined
                      ? f.defaultValue
                      : (defaultInputs && f.fieldKey ? defaultInputs[f.fieldKey] : undefined);
                    const isFieldModified = f.isModified !== undefined
                      ? f.isModified
                      : (defaultValue !== undefined && isFieldModifiedHelper(f.value, defaultValue));

                    return (
                      <View
                        key={`field-${fIdx}`}
                        style={[
                          styles.fieldWrapper,
                          isFieldModified && styles.fieldWrapperModified,
                        ]}
                      >
                        <View style={styles.fieldLabelRow}>
                          <View style={styles.fieldLabelLeft}>
                            <Text
                              style={[
                                styles.fieldLabel,
                                isFieldModified && styles.fieldLabelModified,
                              ]}
                              numberOfLines={1}
                            >
                              {f.label}
                            </Text>
                            {isFieldModified ? (
                              <Text style={styles.modifiedAsterisk}>*</Text>
                            ) : null}
                            {f.symbol ? (
                              <Text style={styles.fieldSymbol}>({f.symbol})</Text>
                            ) : null}
                          </View>

                          {isFieldModified ? (
                            <View style={styles.modifiedBadge}>
                              <Text style={styles.modifiedBadgeText}>* Diubah</Text>
                            </View>
                          ) : null}
                        </View>

                        <View
                          style={[
                            styles.inputContainer,
                            isFieldModified && styles.inputContainerModified,
                          ]}
                        >
                          <TextInput
                            style={[
                              styles.input,
                              isFieldModified && styles.inputModified,
                            ]}
                            keyboardType="numeric"
                            value={String(f.value ?? '')}
                            onChangeText={f.onChange}
                            placeholder="0"
                            placeholderTextColor="#94a3b8"
                            selectTextOnFocus={true}
                          />
                          {f.unit ? (
                            <Text
                              style={[
                                styles.inputUnit,
                                isFieldModified && styles.inputUnitModified,
                              ]}
                            >
                              {f.unit}
                            </Text>
                          ) : null}

                          {/* Inline single field reset */}
                          {isFieldModified && (f.onReset || (onResetField && f.fieldKey)) ? (
                            <TouchableOpacity
                              style={styles.fieldResetBtn}
                              onPress={() => {
                                if (f.onReset) {
                                  f.onReset();
                                } else if (onResetField && f.fieldKey) {
                                  onResetField(f.fieldKey);
                                }
                              }}
                              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                              title="Kembalikan ke standar"
                            >
                              <Ionicons name="refresh" size={13} color="#b45309" />
                            </TouchableOpacity>
                          ) : null}
                        </View>

                        {/* Standar Excel Hint */}
                        {isFieldModified && defaultValue !== undefined ? (
                          <Text style={styles.defaultHintText}>
                            Standar: {defaultValue} {f.unit || ''}
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* KOLOM KANAN: HASIL PERHITUNGAN & RAB */}
        <View style={styles.rightColumn}>
          <ScrollView
            ref={rightScrollRef}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            removeClippedSubviews={false}
          >
            {/* Banner Keterangan Kolom Terpengaruh (Jika ada parameter yang diubah) */}
            {isAnyModified ? (
              <View style={styles.affectedNoticeBanner}>
                <Ionicons name="alert-circle" size={15} color="#b45309" />
                <Text style={styles.affectedNoticeText}>
                  <Text style={{ fontWeight: '800' }}>Hasil Disesuaikan (*): </Text>
                  Kolom bertanda (*) otomatis dihitung ulang berdasarkan {modifiedInfo.count} parameter input yang Anda ubah.
                </Text>
              </View>
            ) : null}

            {/* Grand Total Header Highlight */}
            <View style={[styles.grandTotalCard, isAnyModified && styles.grandTotalCardModified]}>
              <View style={styles.gtTopRow}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.gtLabel}>
                      TOTAL BIAYA ESTIMASI PEKERJAAN {isAnyModified ? '*' : ''}
                    </Text>
                    {isAnyModified ? (
                      <View style={styles.gtCustomBadge}>
                        <Text style={styles.gtCustomBadgeText}>* Kustom</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.gtAmount, isAnyModified && styles.gtAmountModified]}>
                    {formatRupiah(results?.grandTotal || 0)}
                  </Text>
                </View>
                <View style={[styles.gtBadge, isAnyModified && styles.gtBadgeModified]}>
                  <Ionicons
                    name={isAnyModified ? 'sparkles' : 'cash-outline'}
                    size={24}
                    color="#ffffff"
                  />
                </View>
              </View>

              <View style={styles.gtSubRow}>
                <View style={styles.gtSubItem}>
                  <Text style={styles.gtSubLabel}>
                    Upah Tenaga Kerja {isAnyModified ? '*' : ''}
                  </Text>
                  <Text style={styles.gtSubValue}>
                    {formatRupiah(results?.totalUpah || 0)}
                  </Text>
                </View>
                <View style={styles.gtDivider} />
                <View style={styles.gtSubItem}>
                  <Text style={styles.gtSubLabel}>
                    Bahan & Material {isAnyModified ? '*' : ''}
                  </Text>
                  <Text style={styles.gtSubValue}>
                    {formatRupiah(results?.totalBahan || 0)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sub-tabs for Result View: RAB Rincian vs Volume Geometri */}
            <View style={styles.resultTabRow}>
              <TouchableOpacity
                style={[
                  styles.resTabBtn,
                  activeResultTab === 'rab' && styles.resTabBtnActive,
                ]}
                onPress={() => handleTabSwitch('rab')}
              >
                <Ionicons
                  name="receipt-outline"
                  size={14}
                  color={activeResultTab === 'rab' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.resTabText,
                    activeResultTab === 'rab' && styles.resTabTextActive,
                  ]}
                >
                  Rincian RAB (Upah & Bahan) {isAnyModified ? '*' : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resTabBtn,
                  activeResultTab === 'volume' && styles.resTabBtnActive,
                ]}
                onPress={() => handleTabSwitch('volume')}
              >
                <Ionicons
                  name="cube-outline"
                  size={14}
                  color={activeResultTab === 'volume' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.resTabText,
                    activeResultTab === 'volume' && styles.resTabTextActive,
                  ]}
                >
                  Ringkasan Volume Fisik {isAnyModified ? '*' : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB 1: Rincian RAB (Upah & Bahan) */}
            <View style={{ display: activeResultTab === 'rab' ? 'flex' : 'none' }}>
              {/* Tenaga Kerja Table */}
              <View style={[styles.tableCard, isAnyModified && styles.tableCardAffected]}>
                <View style={styles.tableHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.tableHeaderText}>
                      A. TENAGA KERJA {isAnyModified ? '*' : ''}
                    </Text>
                    {isAnyModified ? (
                      <View style={styles.affectedPill}>
                        <Text style={styles.affectedPillText}>* Terpengaruh</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.tableSubTotalText}>
                    Subtotal: {formatRupiah(results?.totalUpah || 0)} {isAnyModified ? '*' : ''}
                  </Text>
                </View>
                <View style={styles.tableColHeaderRow}>
                  <Text style={[styles.colHeader, { flex: 2.2 }]}>Uraian Tenaga</Text>
                  <Text
                    style={[
                      styles.colHeader,
                      { flex: 1, textAlign: 'right' },
                      isAnyModified && styles.colHeaderAffected,
                    ]}
                  >
                    Vol {isAnyModified ? '*' : ''}
                  </Text>
                  <Text style={[styles.colHeader, { flex: 0.8, textAlign: 'center' }]}>Sat</Text>
                  <Text
                    style={[
                      styles.colHeader,
                      { flex: 1.4, textAlign: 'right' },
                      isAnyModified && styles.colHeaderAffected,
                    ]}
                  >
                    Harga (Rp) {isAnyModified ? '*' : ''}
                  </Text>
                  <Text
                    style={[
                      styles.colHeader,
                      { flex: 1.6, textAlign: 'right' },
                      isAnyModified && styles.colHeaderAffected,
                    ]}
                  >
                    Jumlah (Rp) {isAnyModified ? '*' : ''}
                  </Text>
                </View>
                {results?.tenagaKerja?.map((t, idx) => (
                  <View
                    key={`tk-${idx}`}
                    style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                  >
                    <Text style={[styles.cellText, { flex: 2.2, fontWeight: '600' }]}>
                      {t.uraian}
                    </Text>
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 1, textAlign: 'right' },
                        isAnyModified && styles.cellTextAffected,
                      ]}
                    >
                      {formatNumber(t.volume, 2)}
                    </Text>
                    <Text style={[styles.cellTextMuted, { flex: 0.8, textAlign: 'center' }]}>
                      {t.satuan}
                    </Text>
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 1.4, textAlign: 'right' },
                        isAnyModified && styles.cellTextAffected,
                      ]}
                    >
                      {formatNumber(t.harga, 0)}
                    </Text>
                    <Text
                      style={[
                        styles.cellTextBold,
                        { flex: 1.6, textAlign: 'right' },
                        isAnyModified && styles.cellTextBoldAffected,
                      ]}
                    >
                      {formatRupiah(t.subtotal)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Bahan Table */}
              <View style={[styles.tableCard, { marginTop: 12 }, isAnyModified && styles.tableCardAffected]}>
                <View style={styles.tableHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.tableHeaderText}>
                      B. BAHAN & MATERIAL {isAnyModified ? '*' : ''}
                    </Text>
                    {isAnyModified ? (
                      <View style={styles.affectedPill}>
                        <Text style={styles.affectedPillText}>* Terpengaruh</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.tableSubTotalText}>
                    Subtotal: {formatRupiah(results?.totalBahan || 0)} {isAnyModified ? '*' : ''}
                  </Text>
                </View>
                <View style={styles.tableColHeaderRow}>
                  <Text style={[styles.colHeader, { flex: 2.2 }]}>Uraian Bahan</Text>
                  <Text
                    style={[
                      styles.colHeader,
                      { flex: 1, textAlign: 'right' },
                      isAnyModified && styles.colHeaderAffected,
                    ]}
                  >
                    Vol {isAnyModified ? '*' : ''}
                  </Text>
                  <Text style={[styles.colHeader, { flex: 0.8, textAlign: 'center' }]}>Sat</Text>
                  <Text
                    style={[
                      styles.colHeader,
                      { flex: 1.4, textAlign: 'right' },
                      isAnyModified && styles.colHeaderAffected,
                    ]}
                  >
                    Harga (Rp) {isAnyModified ? '*' : ''}
                  </Text>
                  <Text
                    style={[
                      styles.colHeader,
                      { flex: 1.6, textAlign: 'right' },
                      isAnyModified && styles.colHeaderAffected,
                    ]}
                  >
                    Jumlah (Rp) {isAnyModified ? '*' : ''}
                  </Text>
                </View>
                {results?.bahan?.map((b, idx) => (
                  <View
                    key={`bh-${idx}`}
                    style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                  >
                    <Text style={[styles.cellText, { flex: 2.2, fontWeight: '600' }]}>
                      {b.uraian}
                    </Text>
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 1, textAlign: 'right' },
                        isAnyModified && styles.cellTextAffected,
                      ]}
                    >
                      {formatNumber(b.volume, 2)}
                    </Text>
                    <Text style={[styles.cellTextMuted, { flex: 0.8, textAlign: 'center' }]}>
                      {b.satuan}
                    </Text>
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 1.4, textAlign: 'right' },
                        isAnyModified && styles.cellTextAffected,
                      ]}
                    >
                      {formatNumber(b.harga, 0)}
                    </Text>
                    <Text
                      style={[
                        styles.cellTextBold,
                        { flex: 1.6, textAlign: 'right' },
                        isAnyModified && styles.cellTextBoldAffected,
                      ]}
                    >
                      {formatRupiah(b.subtotal)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* TAB 2: Ringkasan Volume Fisik */}
            <View style={{ display: activeResultTab === 'volume' ? 'flex' : 'none' }}>
              <View style={[styles.tableCard, isAnyModified && styles.tableCardAffected]}>
                <View style={styles.tableHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.tableHeaderText}>
                      HASIL KALKULASI VOLUME STRUKTUR {isAnyModified ? '*' : ''}
                    </Text>
                    {isAnyModified ? (
                      <View style={styles.affectedPill}>
                        <Text style={styles.affectedPillText}>* Terpengaruh</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={{ padding: 8 }}>
                  {results?.volumes &&
                    Object.entries(results.volumes).map(([k, v], idx) => {
                      if (typeof v === 'number' && !isNaN(v)) {
                        return (
                          <View
                            key={`vol-${idx}`}
                            style={[
                              styles.volRow,
                              idx % 2 === 1 && styles.tableRowAlt,
                              isAnyModified && styles.volRowAffected,
                            ]}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Text style={styles.volLabel}>{k}</Text>
                              {isAnyModified ? (
                                <Text style={styles.modifiedAsterisk}>*</Text>
                              ) : null}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text
                                style={[
                                  styles.volValue,
                                  isAnyModified && styles.volValueAffected,
                                ]}
                              >
                                {formatNumber(v, 3)}
                              </Text>
                              {isAnyModified ? (
                                <View style={styles.volAffectedBadge}>
                                  <Text style={styles.volAffectedBadgeText}>* Dihitung</Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        );
                      }
                      return null;
                    })}
                </View>
              </View>
            </View>

            {/* Catatan Kaki / Legend Pengaruh Modifikasi */}
            {isAnyModified ? (
              <View style={styles.affectedLegend}>
                <Ionicons name="information-circle-outline" size={13} color="#b45309" />
                <Text style={styles.affectedLegendText}>
                  Tanda bintang (*) dan kolom ber-highlight menandakan nilai yang terpengaruh secara otomatis oleh penyesuaian parameter input Anda.
                </Text>
              </View>
            ) : null}

            {/* Action Buttons: Simpan & Bagikan */}
            <View style={styles.actionRow}>
              {onSave ? (
                <TouchableOpacity style={styles.btnSave} onPress={onSave}>
                  <Ionicons name="bookmark" size={16} color="#ffffff" />
                  <Text style={styles.btnActionText}>Simpan ke Rekap RAB</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity style={styles.btnShare} onPress={handleShare}>
                <Ionicons name="logo-whatsapp" size={16} color="#ffffff" />
                <Text style={styles.btnActionText}>Bagikan Hasil</Text>
              </TouchableOpacity>

              {onReset ? (
                <TouchableOpacity
                  style={[
                    styles.btnReset,
                    isAnyModified && styles.btnResetModified,
                  ]}
                  onPress={onReset}
                >
                  <Ionicons
                    name="refresh"
                    size={16}
                    color={isAnyModified ? '#b45309' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.btnResetText,
                      isAnyModified && styles.btnResetTextModified,
                    ]}
                  >
                    {isAnyModified
                      ? `Reset Default (${modifiedInfo.count})`
                      : 'Reset Default'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Modal View Full Image Diagram */}
      {diagramSource ? (
        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{diagramTitle}</Text>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowImageModal(false)}
                >
                  <Ionicons name="close" size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <Image
                source={diagramSource}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  splitRow: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1.15,
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  rightColumn: {
    flex: 1.35,
    backgroundColor: '#ffffff',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  headerModifiedBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  headerModifiedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  inputModifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 8,
  },
  inputModifiedBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  inputModifiedBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
  },
  inputModifiedBannerSubtitle: {
    fontSize: 9.5,
    color: '#b45309',
    marginTop: 1,
  },
  btnBannerReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  btnBannerResetText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  diagramCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  diagramHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  diagramTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  diagramTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  btnZoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexShrink: 0,
  },
  btnZoomText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  diagramThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardHeaderSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 6,
  },
  togglesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleBtnActive: {
    backgroundColor: '#e0f2fe',
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fieldWrapper: {
    width: '48.5%',
    marginBottom: 4,
  },
  fieldWrapperModified: {
    backgroundColor: '#fffdf5',
    padding: 2,
    borderRadius: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  fieldLabelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  fieldLabelModified: {
    color: '#b45309',
    fontWeight: '800',
  },
  modifiedAsterisk: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: '900',
  },
  fieldSymbol: {
    fontSize: 9.5,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  modifiedBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  modifiedBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#b45309',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 5,
    paddingHorizontal: 7,
    height: 32,
  },
  inputContainerModified: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    padding: 0,
  },
  inputModified: {
    color: '#92400e',
    fontWeight: '800',
  },
  inputUnit: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 4,
  },
  inputUnitModified: {
    color: '#b45309',
    fontWeight: '700',
  },
  fieldResetBtn: {
    padding: 3,
    marginLeft: 3,
  },
  defaultHintText: {
    fontSize: 8.5,
    color: '#b45309',
    marginTop: 2,
    fontWeight: '600',
  },
  affectedNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    borderRadius: 6,
    padding: 7,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  affectedNoticeText: {
    fontSize: 10,
    color: '#92400e',
    flex: 1,
    lineHeight: 13,
  },
  grandTotalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  grandTotalCardModified: {
    borderColor: '#f59e0b',
    backgroundColor: '#111827',
  },
  gtTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gtLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  gtCustomBadge: {
    backgroundColor: '#b45309',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  gtCustomBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  gtAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38bdf8',
    marginTop: 1,
  },
  gtAmountModified: {
    color: '#fbbf24',
  },
  gtBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gtBadgeModified: {
    backgroundColor: '#d97706',
  },
  gtSubRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 6,
  },
  gtSubItem: {
    flex: 1,
    alignItems: 'center',
  },
  gtSubLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '700',
  },
  gtSubValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 1,
  },
  gtDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultTabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  resTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resTabBtnActive: {
    backgroundColor: '#e0f2fe',
    borderColor: colors.primary,
  },
  resTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  resTabTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  tableCardAffected: {
    borderColor: '#fed7aa',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  tableSubTotalText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
  },
  affectedPill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  affectedPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#b45309',
  },
  tableColHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  colHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  colHeaderAffected: {
    color: '#b45309',
    fontWeight: '900',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#fafbfc',
  },
  cellText: {
    fontSize: 10,
    color: '#334155',
  },
  cellTextAffected: {
    color: '#b45309',
    fontWeight: '700',
  },
  cellTextMuted: {
    fontSize: 9.5,
    color: '#64748b',
  },
  cellTextBold: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f172a',
  },
  cellTextBoldAffected: {
    color: '#b45309',
    fontWeight: '800',
  },
  volRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  volRowAffected: {
    backgroundColor: '#fffdf5',
  },
  volLabel: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  volAsterisk: {
    color: '#d97706',
    fontWeight: '900',
    fontSize: 12,
  },
  volValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  volValueAffected: {
    color: '#b45309',
    fontWeight: '800',
  },
  volAffectedBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  volAffectedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#b45309',
  },
  affectedLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  affectedLegendText: {
    fontSize: 9,
    color: '#b45309',
    fontStyle: 'italic',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnSave: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnShare: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnReset: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnResetModified: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  btnActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnResetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  btnResetTextModified: {
    color: '#b45309',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '95%',
    height: '92%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
});
