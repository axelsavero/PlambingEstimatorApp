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
    msg += `====================================\n\n`;

    rekapData.table.forEach((row) => {
      const activeMark = row.isRoofChoice
        ? row.isActiveRoof
          ? ' [AKTIF]'
          : ' [TIDAK AKTIF]'
        : '';
      msg += `${row.no}. ${row.uraian}${activeMark}\n`;
      msg += `   Jumlah: ${formatRupiah(row.jumlah)}\n`;
    });

    msg += `\n====================================\n`;
    msg += `*TOTAL ESTIMASI PROYEK: ${formatRupiah(rekapData.totalProyek)}*\n`;
    msg += `_Dihasilkan oleh Aplikasi Estimator RABPro_`;

    try {
      await Share.share({ message: msg });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset Proyek',
      'Kembalikan seluruh data dan perhitungan proyek ke baseline standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset Baseline',
          style: 'destructive',
          onPress: async () => {
            await resetAllToDefault();
            await loadData();
            Alert.alert('Berhasil', 'Seluruh data telah di-reset ke baseline standar.');
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
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerMainTitle}>REKAP</Text>
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

            <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
              <Ionicons name="refresh" size={16} color="#475569" />
              <Text style={styles.btnResetText}>Reset Standar</Text>
            </TouchableOpacity>
          </View>
        </View>

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
            <Text style={[styles.thCell, { width: 180, textAlign: 'right' }]}>
              Jumlah (Rp)
            </Text>
            <Text style={[styles.thCell, { width: 90, textAlign: 'center' }]}>Status</Text>
          </View>

          <View style={styles.subThRow}>
            <Text style={[styles.subThCell, { width: 50, textAlign: 'center' }]}>A</Text>
            <Text style={[styles.subThCell, { flex: 1 }]}>B</Text>
            <Text style={[styles.subThCell, { width: 180, textAlign: 'right' }]}>C</Text>
            <Text style={[styles.subThCell, { width: 90, textAlign: 'center' }]}>-</Text>
          </View>

          {rekapData?.table.map((row, idx) => {
            const isClickable = row.isCalculated;
            const isRoofRow = row.isRoofChoice;
            const isRoofActive = row.isActiveRoof;

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
                    ]}
                  >
                    {row.uraian}
                  </Text>
                  {isClickable ? (
                    <Ionicons name="create-outline" size={13} color={colors.primary} />
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.tdJumlah,
                    { width: 180, textAlign: 'right' },
                    isRoofRow && !isRoofActive && styles.textDisabled,
                  ]}
                >
                  {row.jumlah > 0 ? formatRupiah(row.jumlah) : '-'}
                </Text>

                <View style={{ width: 90, alignItems: 'center' }}>
                  {isClickable ? (
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
          <View style={styles.tableFooterRow}>
            <Text style={[styles.tfLabel, { width: 50 + 10 }]}></Text>
            <Text style={[styles.tfLabel, { flex: 1 }]}>JUMLAH TOTAL PROYEK (Rp)</Text>
            <Text style={[styles.tfAmount, { width: 180, textAlign: 'right' }]}>
              {formatRupiah(rekapData?.totalProyek || 0)}
            </Text>
            <View style={{ width: 90 }} />
          </View>
        </View>
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
  logoIcon: {
    width: 40,
    height: 40,
  },
  headerMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnShare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
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
  roofChoiceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  roofChoiceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369a1',
  },
  roofToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roofToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  roofToggleBtnActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  roofToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  roofToggleTextActive: {
    color: '#166534',
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
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
  clickableText: {
    color: '#0369a1',
    fontWeight: '700',
  },
  tdJumlah: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
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
  tfLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  tfAmount: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
});
