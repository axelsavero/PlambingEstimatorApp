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
import SkylineWatermarkBackground from '../components/SkylineWatermarkBackground';

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
    msg += `Aplikasi ESTIMATOR\n`;
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
    msg += `_Dihasilkan oleh Aplikasi Estimator RAB Konstruksi_`;

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
    <SkylineWatermarkBackground style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Top Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/brand/logo_with_text.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.headerMainTitle}>REKAPITULASI RAB</Text>
                {rekapData?.isAnySheetModified ? (
                  <View style={styles.kustomActiveBadge}>
                    <Text style={styles.kustomActiveBadgeText}>* Kustom Aktif</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.headerSubTitle}>
                Akumulasi Total Biaya 7 Modul Struktur Konstruksi
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.btnShare} onPress={handleShare} activeOpacity={0.8}>
              <Ionicons name="logo-whatsapp" size={15} color="#FFFFFF" />
              <Text style={styles.btnActionText}>Bagikan WA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnReset,
                rekapData?.isAnySheetModified && styles.btnResetModified,
              ]}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Ionicons
                name="refresh"
                size={14}
                color={rekapData?.isAnySheetModified ? '#B45309' : '#475569'}
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
            <Ionicons name="information-circle" size={16} color="#B45309" />
            <Text style={styles.rekapModifiedBannerText}>
              Beberapa modul pekerjaan memiliki parameter yang disesuaikan (*). Nilai pada kolom jumlah dan total biaya proyek dihitung berdasarkan input kustom.
            </Text>
          </View>
        ) : null}

        {/* Roof Selector Banner */}
        <View style={styles.roofChoiceCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="home" size={16} color={colors.primary} />
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
                  rekapData?.roofChoice === 'pelana' ? colors.primary : '#64748B'
                }
              />
              <Text
                style={[
                  styles.roofToggleText,
                  rekapData?.roofChoice === 'pelana' && styles.roofToggleTextActive,
                ]}
              >
                11. Atap Pelana C75
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
                  rekapData?.roofChoice === 'limas' ? colors.primary : '#64748B'
                }
              />
              <Text
                style={[
                  styles.roofToggleText,
                  rekapData?.roofChoice === 'limas' && styles.roofToggleTextActive,
                ]}
              >
                11.A. Atap Limas
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
                      size={15}
                      color={isRoofActive ? colors.primary : '#EF4444'}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.tdUraian,
                      isClickable && styles.clickableText,
                      isRoofRow && !isRoofActive && styles.textDisabled,
                      isRowModified && styles.tdUraianModified,
                    ]}
                    numberOfLines={1}
                  >
                    {row.uraian}
                    {isRowModified ? ' *' : ''}
                  </Text>
                  {isRowModified ? (
                    <View style={styles.inlineAsteriskBadge}>
                      <Text style={styles.inlineAsteriskBadgeText}>* Disesuaikan</Text>
                    </View>
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.tdJumlah,
                    { width: 190, textAlign: 'right' },
                    isRoofRow && !isRoofActive && styles.textDisabled,
                    isRowModified && styles.tdJumlahModified,
                  ]}
                >
                  {formatRupiah(row.jumlah)}
                  {isRowModified ? ' *' : ''}
                </Text>

                <View style={{ width: 95, alignItems: 'center' }}>
                  {isClickable ? (
                    <View style={[styles.badgeHitung, isRowModified && styles.badgeHitungModified]}>
                      <Text style={[styles.badgeHitungText, isRowModified && styles.badgeHitungTextModified]}>
                        {isRowModified ? 'Kustom *' : 'Otomatis'}
                      </Text>
                    </View>
                  ) : isRoofRow && !isRoofActive ? (
                    <View style={styles.badgeNonAktif}>
                      <Text style={styles.badgeNonAktifText}>Non-Aktif</Text>
                    </View>
                  ) : (
                    <Text style={styles.textStrip}>-</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Grand Total Row */}
          <View style={styles.grandTotalRow}>
            <Text style={[styles.grandTotalLabel, { flex: 1 }]}>
              TOTAL ESTIMASI BIAYA PROYEK
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={styles.grandTotalValue}>
                {rekapData ? formatRupiah(rekapData.totalProyek) : 'Rp 0'}
              </Text>
              {rekapData?.isAnySheetModified ? (
                <Text style={styles.grandTotalAsterisk}>*</Text>
              ) : null}
            </View>
          </View>
        </View>
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
    gap: 8,
    paddingBottom: 25,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 120,
    height: 38,
  },
  headerMainTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E1E1E',
  },
  kustomActiveBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  kustomActiveBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  headerSubTitle: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnResetModified: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  btnResetText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  btnResetTextModified: {
    color: '#B45309',
  },
  rekapModifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rekapModifiedBannerText: {
    fontSize: 10,
    color: '#92400E',
    flex: 1,
  },
  roofChoiceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  roofChoiceTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  roofToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roofToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 5,
  },
  roofToggleBtnActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary,
  },
  roofToggleText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  roofToggleTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    overflow: 'hidden',
  },
  tableHeadRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  thCell: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FECA38',
  },
  subThRow: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subThCell: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowAlt: {
    backgroundColor: '#FFFDF9',
  },
  clickableRow: {
    backgroundColor: '#FFFFFF',
  },
  inactiveRoofRow: {
    opacity: 0.45,
    backgroundColor: '#F8FAFC',
  },
  modifiedRow: {
    backgroundColor: '#FFFBEB',
  },
  tdNo: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tdUraian: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  clickableText: {
    color: colors.primaryDark,
  },
  tdUraianModified: {
    color: '#92400E',
  },
  inlineAsteriskBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  inlineAsteriskBadgeText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#B45309',
  },
  tdJumlah: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  tdJumlahModified: {
    color: '#B45309',
  },
  textDisabled: {
    color: '#94A3B8',
  },
  badgeHitung: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  badgeHitungModified: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  badgeHitungText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  badgeHitungTextModified: {
    color: '#B45309',
  },
  badgeNonAktif: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  badgeNonAktifText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#DC2626',
  },
  textStrip: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FECA38',
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  grandTotalAsterisk: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FECA38',
  },
});
