import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { formatRupiah } from '../utils/constructionCalculations';
import {
  generateCurrentRekapRAB,
  saveRoofChoice,
  resetAllToDefault,
} from '../utils/rabStorage';
import RABProLogo from '../components/RABProLogo';

export default function RekapRABScreen({ navigation }) {
  const [rekapData, setRekapData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await generateCurrentRekapRAB();
    setRekapData(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation?.addListener ? navigation.addListener('focus', loadData) : null;
    loadData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  const handleSelectRoof = async (type) => {
    await saveRoofChoice(type);
    await loadData();
  };

  const handleNavigateToSheet = (item) => {
    if (!item.isCalculated || !navigation) return;
    switch (item.type) {
      case 'pondasi':
        navigation.navigate('PondasiScreen');
        break;
      case 'footplate':
        navigation.navigate('FootPlateScreen');
        break;
      case 'sloof':
        navigation.navigate('SloofScreen');
        break;
      case 'kolom':
        navigation.navigate('KolomScreen');
        break;
      case 'balok':
        navigation.navigate('BalokScreen');
        break;
      case 'atap_pelana':
        navigation.navigate('AtapPelanaScreen');
        break;
      case 'atap_limas':
        navigation.navigate('AtapLimasScreen');
        break;
      default:
        break;
    }
  };

  const handleShare = async () => {
    if (!rekapData) return;
    let msg = `*REKAP RENCANA ANGGARAN BIAYA (RAB)*\n`;
    msg += `Aplikasi RABPro\n`;
    if (rekapData.isAnySheetModified) {
      msg += `[Status: Memuat Nilai Kustom/Disesuaikan *]\n`;
    }
    msg += `====================================\n\n`;

    rekapData.table.forEach((row) => {
      const activeMark = row.isRoofChoice
        ? row.isActiveRoof
          ? ' [AKTIF]'
          : ' [TIDAK AKTIF]'
        : '';
      const customMark = row.isModified ? ' *' : '';
      msg += `${row.no}. ${row.uraian}${activeMark}${customMark}\n`;
      msg += `   Jumlah: ${formatRupiah(row.jumlah)}\n`;
    });

    msg += `\n====================================\n`;
    msg += `*TOTAL ESTIMASI PROYEK: ${formatRupiah(rekapData.totalProyek)}${rekapData.isAnySheetModified ? ' *' : ''}*\n`;
    if (rekapData.isAnySheetModified) {
      msg += `_*) Tanda bintang (*) menandakan modul dengan parameter yang telah disesuaikan._\n`;
    }
    msg += `_Dihasilkan oleh Aplikasi Estimator RABPro_`;

    try {
      await Share.share({ message: msg });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset Rekap RAB',
      'Kembalikan seluruh modul perhitungan (Pondasi, Foot Plate, Sloof, Kolom, Balok, Atap) ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset Seluruhnya',
          style: 'destructive',
          onPress: async () => {
            await resetAllToDefault();
            await loadData();
            Alert.alert('Sukses', 'Seluruh parameter proyek telah dikembalikan ke standar awal Excel.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Top Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <RABProLogo size={36} showText={false} />
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.headerMainTitle}>REKAP</Text>
                {rekapData?.isAnySheetModified ? (
                  <View style={styles.kustomActiveBadge}>
                    <Text style={styles.kustomActiveBadgeText}>* Kustom Aktif</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.headerSubTitle}>
                RENCANA ANGGARAN BIAYA (RAB)
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.btnShare} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={16} color="#ffffff" />
              <Text style={styles.btnActionText}>Bagikan Rekap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnReset,
                rekapData?.isAnySheetModified && styles.btnResetModified,
              ]}
              onPress={handleReset}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={rekapData?.isAnySheetModified ? '#b45309' : '#475569'}
              />
              <Text
                style={[
                  styles.btnResetText,
                  rekapData?.isAnySheetModified && styles.btnResetTextModified,
                ]}
              >
                Reset Standar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notice Banner jika ada nilai yang disesuaikan */}
        {rekapData?.isAnySheetModified ? (
          <View style={styles.rekapModifiedBanner}>
            <Ionicons name="information-circle" size={16} color="#b45309" />
            <Text style={styles.rekapModifiedBannerText}>
              Beberapa modul pekerjaan memiliki parameter yang disesuaikan (*). Nilai pada kolom jumlah dan total biaya proyek dihitung berdasarkan input kustom.
            </Text>
          </View>
        ) : null}

        {/* Roof Selector Banner */}
        <View style={styles.roofChoiceCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="home-outline" size={18} color="#0284c7" />
            <Text style={styles.roofChoiceTitle}>
              Pilihan Konstruksi Atap Proyek:
            </Text>
          </View>
          <View style={styles.roofToggleRow}>
            <TouchableOpacity
              style={[
                styles.roofToggleBtn,
                rekapData?.roofChoice === 'pelana' && styles.roofToggleBtnActive,
              ]}
              onPress={() => handleSelectRoof('pelana')}
            >
              <Ionicons
                name={
                  rekapData?.roofChoice === 'pelana'
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={16}
                color={
                  rekapData?.roofChoice === 'pelana' ? '#16a34a' : '#64748b'
                }
              />
              <Text
                style={[
                  styles.roofToggleText,
                  rekapData?.roofChoice === 'pelana' && styles.roofToggleTextActive,
                ]}
              >
                11. Atap Pelana Baja Ringan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roofToggleBtn,
                rekapData?.roofChoice === 'limas' && styles.roofToggleBtnActive,
              ]}
              onPress={() => handleSelectRoof('limas')}
            >
              <Ionicons
                name={
                  rekapData?.roofChoice === 'limas'
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={16}
                color={
                  rekapData?.roofChoice === 'limas' ? '#16a34a' : '#64748b'
                }
              />
              <Text
                style={[
                  styles.roofToggleText,
                  rekapData?.roofChoice === 'limas' && styles.roofToggleTextActive,
                ]}
              >
                11.A. Atap Limas Baja Ringan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Master Rekap Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeadRow}>
            <Text style={[styles.thCell, { width: 50, textAlign: 'center' }]}>No</Text>
            <Text style={[styles.thCell, { flex: 1 }]}>Uraian Pekerjaan</Text>
            <Text style={[styles.thCell, { width: 190, textAlign: 'right' }]}>
              Jumlah (Rp) {rekapData?.isAnySheetModified ? '*' : ''}
            </Text>
            <Text style={[styles.thCell, { width: 95, textAlign: 'center' }]}>Status</Text>
          </View>

          <View style={styles.subThRow}>
            <Text style={[styles.subThCell, { width: 50, textAlign: 'center' }]}>A</Text>
            <Text style={[styles.subThCell, { flex: 1 }]}>B</Text>
            <Text style={[styles.subThCell, { width: 190, textAlign: 'right' }]}>C</Text>
            <Text style={[styles.subThCell, { width: 95, textAlign: 'center' }]}>-</Text>
          </View>

          {rekapData?.table.map((row, idx) => {
            const isClickable = row.isCalculated;
            const isRoofRow = row.isRoofChoice;
            const isRoofActive = row.isActiveRoof;
            const isRowModified = row.isModified;

            return (
              <TouchableOpacity
                key={`rekap-${idx}`}
                activeOpacity={isClickable ? 0.7 : 1}
                onPress={() => isClickable && handleNavigateToSheet(row)}
                style={[
                  styles.tableDataRow,
                  idx % 2 === 1 && styles.tableRowAlt,
                  isClickable && styles.clickableRow,
                  isRoofRow && !isRoofActive && styles.inactiveRoofRow,
                  isRowModified && styles.modifiedRow,
                ]}
              >
                <Text
                  style={[
                    styles.tdNo,
                    { width: 50, textAlign: 'center' },
                    isRoofRow && !isRoofActive && styles.textDisabled,
                  ]}
                >
                  {row.no}
                </Text>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {isRoofRow ? (
                    <Ionicons
                      name={isRoofActive ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={isRoofActive ? '#16a34a' : '#ef4444'}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.tdUraian,
                      isClickable && styles.clickableText,
                      isRoofRow && !isRoofActive && styles.textDisabled,
                      isRowModified && styles.textModified,
                    ]}
                  >
                    {row.uraian}
                  </Text>
                  {isRowModified ? (
                    <Text style={styles.asteriskMark}>*</Text>
                  ) : null}
                  {isClickable ? (
                    <Ionicons name="create-outline" size={13} color={colors.primary} />
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.tdJumlah,
                    { width: 190, textAlign: 'right' },
                    isRoofRow && !isRoofActive && styles.textDisabled,
                    isRowModified && styles.amountModified,
                  ]}
                >
                  {row.jumlah > 0 ? `${formatRupiah(row.jumlah)}${isRowModified ? ' *' : ''}` : '-'}
                </Text>

                <View style={{ width: 95, alignItems: 'center' }}>
                  {isRowModified ? (
                    <View style={styles.badgeKustom}>
                      <Text style={styles.badgeKustomText}>* Kustom</Text>
                    </View>
                  ) : isClickable ? (
                    <View style={styles.badgeKalkulator}>
                      <Text style={styles.badgeKalkulatorText}>Kalkulator</Text>
                    </View>
                  ) : (
                    <Text style={styles.badgeStandarText}>Standar</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Grand Total Footer Row */}
          <View style={[styles.tableFooterRow, rekapData?.isAnySheetModified && styles.tableFooterRowModified]}>
            <Text style={[styles.tfLabel, { width: 50 + 10 }]}></Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.tfLabel}>
                JUMLAH TOTAL PROYEK (Rp) {rekapData?.isAnySheetModified ? '*' : ''}
              </Text>
              {rekapData?.isAnySheetModified ? (
                <View style={styles.footerKustomBadge}>
                  <Text style={styles.footerKustomBadgeText}>* Kustom</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tfAmount, { width: 190, textAlign: 'right' }, rekapData?.isAnySheetModified && styles.tfAmountModified]}>
              {formatRupiah(rekapData?.totalProyek || 0)}
            </Text>
            <View style={{ width: 95 }} />
          </View>
        </View>

        {rekapData?.isAnySheetModified ? (
          <View style={styles.rekapLegend}>
            <Ionicons name="information-circle-outline" size={13} color="#b45309" />
            <Text style={styles.rekapLegendText}>
              *) Tanda bintang (*) menandakan pekerjaan atau jumlah biaya yang terpengaruh oleh parameter yang telah diedit/disesuaikan dari nilai standar Excel.
            </Text>
          </View>
        ) : null}
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
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284c7',
  },
  kustomActiveBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  kustomActiveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  rekapModifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 9,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  rekapModifiedBannerText: {
    fontSize: 10.5,
    color: '#92400e',
    flex: 1,
    lineHeight: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnResetModified: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  btnActionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  btnResetText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  btnResetTextModified: {
    color: '#b45309',
    fontWeight: '800',
  },
  roofChoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roofChoiceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  roofToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roofToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  roofToggleBtnActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  roofToggleText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  roofToggleTextActive: {
    color: '#15803d',
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  tableHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  thCell: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subThRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  subThCell: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '700',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  clickableRow: {
    backgroundColor: '#f0f9ff',
  },
  modifiedRow: {
    backgroundColor: '#fffdf5',
  },
  inactiveRoofRow: {
    opacity: 0.5,
  },
  tdNo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tdUraian: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  textModified: {
    color: '#92400e',
    fontWeight: '800',
  },
  asteriskMark: {
    color: '#d97706',
    fontWeight: '900',
    fontSize: 13,
  },
  clickableText: {
    color: '#0369a1',
    fontWeight: '700',
  },
  tdJumlah: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  amountModified: {
    color: '#b45309',
    fontWeight: '800',
  },
  textDisabled: {
    color: '#94a3b8',
  },
  badgeKalkulator: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  badgeKalkulatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  badgeKustom: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  badgeKustomText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  badgeStandarText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tableFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0369a1',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tableFooterRowModified: {
    backgroundColor: '#0f172a',
    borderTopWidth: 2,
    borderTopColor: '#f59e0b',
  },
  tfLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  footerKustomBadge: {
    backgroundColor: '#b45309',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  footerKustomBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  tfAmount: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  tfAmountModified: {
    color: '#fbbf24',
  },
  rekapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 6,
  },
  rekapLegendText: {
    fontSize: 9.5,
    color: '#b45309',
    fontStyle: 'italic',
    flex: 1,
  },
});
