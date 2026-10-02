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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { formatRupiah, formatNumber } from '../utils/constructionCalculations';

export default function LandscapeCalculatorLayout({
  title,
  subtitle,
  iconName = 'calculator-outline',
  diagramSource,
  diagramTitle = 'Panduan Gambar Teknis',
  inputSections = [],
  results,
  onSave,
  onReset,
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('rab'); // 'rab' | 'volume'

  const handleShare = async () => {
    try {
      if (!results) return;
      let msg = `*RABPro Estimator — ${title}*\n`;
      msg += `==============================\n`;
      msg += `TOTAL BIAYA: ${formatRupiah(results.grandTotal)}\n`;
      msg += `• Total Upah Tenaga: ${formatRupiah(results.totalUpah)}\n`;
      msg += `• Total Bahan/Material: ${formatRupiah(results.totalBahan)}\n\n`;

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
          >
            {/* Header info */}
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name={iconName} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pageTitle}>{title}</Text>
                  {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
                </View>
              </View>
            </View>

            {/* Gambar Panduan Teknis Button / Preview */}
            {diagramSource ? (
              <View style={styles.diagramCard}>
                <View style={styles.diagramHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="image-outline" size={16} color={colors.primary} />
                    <Text style={styles.diagramTitle}>{diagramTitle}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnZoom}
                    onPress={() => setShowImageModal(true)}
                  >
                    <Ionicons name="expand-outline" size={14} color="#ffffff" />
                    <Text style={styles.btnZoomText}>Perbesar Gambar</Text>
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
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {/* Render Input Fields */}
                <View style={styles.fieldsGrid}>
                  {sec.fields.map((f, fIdx) => (
                    <View key={`field-${fIdx}`} style={styles.fieldWrapper}>
                      <View style={styles.fieldLabelRow}>
                        <Text style={styles.fieldLabel} numberOfLines={1}>
                          {f.label}
                        </Text>
                        {f.symbol ? (
                          <Text style={styles.fieldSymbol}>({f.symbol})</Text>
                        ) : null}
                      </View>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          keyboardType="numeric"
                          value={String(f.value ?? '')}
                          onChangeText={f.onChange}
                          placeholder="0"
                          placeholderTextColor="#94a3b8"
                          selectTextOnFocus={true}
                        />
                        {f.unit ? <Text style={styles.inputUnit}>{f.unit}</Text> : null}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* KOLOM KANAN: HASIL PERHITUNGAN & RAB */}
        <View style={styles.rightColumn}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Grand Total Header Highlight */}
            <View style={styles.grandTotalCard}>
              <View style={styles.gtTopRow}>
                <View>
                  <Text style={styles.gtLabel}>TOTAL BIAYA ESTIMASI PEKERJAAN</Text>
                  <Text style={styles.gtAmount}>
                    {formatRupiah(results?.grandTotal || 0)}
                  </Text>
                </View>
                <View style={styles.gtBadge}>
                  <Ionicons name="cash-outline" size={24} color="#ffffff" />
                </View>
              </View>

              <View style={styles.gtSubRow}>
                <View style={styles.gtSubItem}>
                  <Text style={styles.gtSubLabel}>Upah Tenaga Kerja</Text>
                  <Text style={styles.gtSubValue}>
                    {formatRupiah(results?.totalUpah || 0)}
                  </Text>
                </View>
                <View style={styles.gtDivider} />
                <View style={styles.gtSubItem}>
                  <Text style={styles.gtSubLabel}>Bahan & Material</Text>
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
                onPress={() => setActiveResultTab('rab')}
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
                  Rincian RAB (Upah & Bahan)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resTabBtn,
                  activeResultTab === 'volume' && styles.resTabBtnActive,
                ]}
                onPress={() => setActiveResultTab('volume')}
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
                  Ringkasan Volume Fisik
                </Text>
              </TouchableOpacity>
            </View>

            {activeResultTab === 'rab' ? (
              <View>
                {/* Tenaga Kerja Table */}
                <View style={styles.tableCard}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>A. TENAGA KERJA</Text>
                    <Text style={styles.tableSubTotalText}>
                      Subtotal: {formatRupiah(results?.totalUpah || 0)}
                    </Text>
                  </View>
                  <View style={styles.tableColHeaderRow}>
                    <Text style={[styles.colHeader, { flex: 2.2 }]}>Uraian Tenaga</Text>
                    <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>Vol</Text>
                    <Text style={[styles.colHeader, { flex: 0.8, textAlign: 'center' }]}>Sat</Text>
                    <Text style={[styles.colHeader, { flex: 1.4, textAlign: 'right' }]}>Harga (Rp)</Text>
                    <Text style={[styles.colHeader, { flex: 1.6, textAlign: 'right' }]}>Jumlah (Rp)</Text>
                  </View>
                  {results?.tenagaKerja?.map((t, idx) => (
                    <View
                      key={`tk-${idx}`}
                      style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                    >
                      <Text style={[styles.cellText, { flex: 2.2, fontWeight: '600' }]}>
                        {t.uraian}
                      </Text>
                      <Text style={[styles.cellText, { flex: 1, textAlign: 'right' }]}>
                        {formatNumber(t.volume, 2)}
                      </Text>
                      <Text style={[styles.cellTextMuted, { flex: 0.8, textAlign: 'center' }]}>
                        {t.satuan}
                      </Text>
                      <Text style={[styles.cellText, { flex: 1.4, textAlign: 'right' }]}>
                        {formatNumber(t.harga, 0)}
                      </Text>
                      <Text style={[styles.cellTextBold, { flex: 1.6, textAlign: 'right' }]}>
                        {formatRupiah(t.subtotal)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Bahan Table */}
                <View style={[styles.tableCard, { marginTop: 12 }]}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>B. BAHAN & MATERIAL</Text>
                    <Text style={styles.tableSubTotalText}>
                      Subtotal: {formatRupiah(results?.totalBahan || 0)}
                    </Text>
                  </View>
                  <View style={styles.tableColHeaderRow}>
                    <Text style={[styles.colHeader, { flex: 2.2 }]}>Uraian Bahan</Text>
                    <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>Vol</Text>
                    <Text style={[styles.colHeader, { flex: 0.8, textAlign: 'center' }]}>Sat</Text>
                    <Text style={[styles.colHeader, { flex: 1.4, textAlign: 'right' }]}>Harga (Rp)</Text>
                    <Text style={[styles.colHeader, { flex: 1.6, textAlign: 'right' }]}>Jumlah (Rp)</Text>
                  </View>
                  {results?.bahan?.map((b, idx) => (
                    <View
                      key={`bh-${idx}`}
                      style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                    >
                      <Text style={[styles.cellText, { flex: 2.2, fontWeight: '600' }]}>
                        {b.uraian}
                      </Text>
                      <Text style={[styles.cellText, { flex: 1, textAlign: 'right' }]}>
                        {formatNumber(b.volume, 2)}
                      </Text>
                      <Text style={[styles.cellTextMuted, { flex: 0.8, textAlign: 'center' }]}>
                        {b.satuan}
                      </Text>
                      <Text style={[styles.cellText, { flex: 1.4, textAlign: 'right' }]}>
                        {formatNumber(b.harga, 0)}
                      </Text>
                      <Text style={[styles.cellTextBold, { flex: 1.6, textAlign: 'right' }]}>
                        {formatRupiah(b.subtotal)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              /* Volume List */
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>HASIL KALKULASI VOLUME STRUKTUR</Text>
                </View>
                <View style={{ padding: 8 }}>
                  {results?.volumes &&
                    Object.entries(results.volumes).map(([k, v], idx) => {
                      if (typeof v === 'number' && !isNaN(v)) {
                        return (
                          <View
                            key={`vol-${idx}`}
                            style={[styles.volRow, idx % 2 === 1 && styles.tableRowAlt]}
                          >
                            <Text style={styles.volLabel}>{k}</Text>
                            <Text style={styles.volValue}>{formatNumber(v, 3)}</Text>
                          </View>
                        );
                      }
                      return null;
                    })}
                </View>
              </View>
            )}

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
                <TouchableOpacity style={styles.btnReset} onPress={onReset}>
                  <Ionicons name="refresh" size={16} color="#475569" />
                  <Text style={styles.btnResetText}>Reset Excel</Text>
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
    marginBottom: 10,
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
  diagramCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  diagramHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  diagramTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  btnZoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  btnZoomText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  diagramThumbnail: {
    width: '100%',
    height: 140,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardHeaderSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 8,
  },
  togglesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  toggleBtnActive: {
    backgroundColor: '#e0f2fe',
    borderColor: colors.primary,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fieldWrapper: {
    width: '48%',
    marginBottom: 4,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  fieldSymbol: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 6,
    height: 32,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    padding: 0,
  },
  inputUnit: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginLeft: 4,
  },
  grandTotalCard: {
    backgroundColor: '#0369a1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  gtTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gtLabel: {
    color: '#bae6fd',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gtAmount: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  gtBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gtSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  gtSubItem: {
    flex: 1,
  },
  gtSubLabel: {
    fontSize: 9,
    color: '#93c5fd',
    fontWeight: '600',
  },
  gtSubValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 1,
  },
  gtDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  resultTabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    padding: 2,
    marginBottom: 8,
    gap: 4,
  },
  resTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 5,
    borderRadius: 5,
  },
  resTabBtnActive: {
    backgroundColor: '#ffffff',
  },
  resTabText: {
    fontSize: 11,
    fontWeight: '600',
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e293b',
  },
  tableSubTotalText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  tableColHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  colHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  tableRowAlt: {
    backgroundColor: '#fbfcfd',
  },
  cellText: {
    fontSize: 10,
    color: '#1e293b',
  },
  cellTextMuted: {
    fontSize: 10,
    color: '#64748b',
  },
  cellTextBold: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f172a',
  },
  volRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  volLabel: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  volValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
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
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    borderRadius: 6,
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
