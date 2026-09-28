import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { FIXTURE_DATA, hitungUBAP } from '../utils/calculations';
import { saveCalculation } from '../utils/storage';

export default function FixtureUnitCalcScreen() {
  const [counts, setCounts] = useState({
    kloset_tangki: 2,
    kloset_katup: 0,
    wastafel: 2,
    shower: 2,
    floor_drain: 2,
    bak_cuci_piring: 1,
    urinoir: 0,
  });
  const [saved, setSaved] = useState(false);

  const updateCount = (id, delta) => {
    setCounts((prev) => {
      const nextVal = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: nextVal };
    });
    setSaved(false);
  };

  const hasil = hitungUBAP(counts);

  const handleSave = async () => {
    const item = {
      type: 'ubap',
      title: 'UBAP & Ukuran Pipa',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      summary: `Total UBAP: ${hasil.totalUBAP} | Pipa Buangan: ${hasil.rekomendasiPipaBuangan} | Air Bersih: ${hasil.rekomendasiPipaAirBersih}`,
      data: hasil,
    };
    await saveCalculation(item);
    setSaved(true);
    Alert.alert('Berhasil', 'Hasil perhitungan UBAP telah disimpan ke riwayat.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `*Hasil Perhitungan UBAP & Rekomendasi Pipa (SNI 8153:2015)*\n` +
          `• Total Akumulasi UBAP: ${hasil.totalUBAP} Unit\n` +
          `• Rekomendasi Pipa Buangan Horizontal: ${hasil.rekomendasiPipaBuangan}\n` +
          `• Rekomendasi Pipa Tegak: ${hasil.rekomendasiPipaTegak}\n` +
          `• Rekomendasi Pipa Suplai Air Bersih: ${hasil.rekomendasiPipaAirBersih}\n\n` +
          `Dihitung otomatis via Plambing Estimator App`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Unit Beban Alat Plambing (UBAP)</Text>
        <Text style={styles.subtitle}>
          Atur jumlah fixture sanitasi untuk menentukan diameter pipa SNI
        </Text>

        <View style={styles.fixtureList}>
          {FIXTURE_DATA.map((item) => {
            const count = counts[item.id] || 0;
            return (
              <View key={item.id} style={styles.fixtureRow}>
                <View style={styles.fixtureInfo}>
                  <Text style={styles.fixtureName}>{item.name}</Text>
                  <Text style={styles.fixtureSub}>
                    Bobot: {item.ubap} UBAP / {item.unit}
                  </Text>
                </View>

                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={[styles.stepBtn, count === 0 && styles.stepBtnDisabled]}
                    onPress={() => updateCount(item.id, -1)}
                    disabled={count === 0}
                  >
                    <Ionicons
                      name="remove"
                      size={18}
                      color={count === 0 ? '#cbd5e1' : colors.text}
                    />
                  </TouchableOpacity>

                  <Text style={styles.countText}>{count}</Text>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => updateCount(item.id, 1)}
                  >
                    <Ionicons name="add" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.resultBox}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Akumulasi UBAP</Text>
          <Text style={styles.totalValue}>{hasil.totalUBAP}</Text>
          <Text style={styles.totalSub}>Fixture Units</Text>
        </View>

        <Text style={styles.recomHeader}>Rekomendasi Diameter Pipa (SNI):</Text>

        <View style={styles.recomCard}>
          <View style={styles.recomIconWrap}>
            <Ionicons name="swap-horizontal" size={20} color="#0284c7" />
          </View>
          <View style={styles.recomTextWrap}>
            <Text style={styles.recomTitle}>Pipa Buangan Horizontal</Text>
            <Text style={styles.recomValue}>{hasil.rekomendasiPipaBuangan}</Text>
          </View>
        </View>

        <View style={styles.recomCard}>
          <View style={styles.recomIconWrap}>
            <Ionicons name="swap-vertical" size={20} color="#d97706" />
          </View>
          <View style={styles.recomTextWrap}>
            <Text style={styles.recomTitle}>Pipa Buangan Tegak (Stack)</Text>
            <Text style={styles.recomValue}>{hasil.rekomendasiPipaTegak}</Text>
          </View>
        </View>

        <View style={styles.recomCard}>
          <View style={styles.recomIconWrap}>
            <Ionicons name="water" size={20} color="#16a34a" />
          </View>
          <View style={styles.recomTextWrap}>
            <Text style={styles.recomTitle}>Pipa Suplai Air Bersih Utama</Text>
            <Text style={styles.recomValue}>{hasil.rekomendasiPipaAirBersih}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.saveBtn, saved && styles.savedBtn]}
            onPress={handleSave}
            disabled={saved}
          >
            <Ionicons
              name={saved ? 'checkmark-done' : 'bookmark-outline'}
              size={18}
              color="#ffffff"
            />
            <Text style={styles.actionBtnText}>
              {saved ? 'Tersimpan' : 'Simpan'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.shareBtn]}
            onPress={handleShare}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#ffffff" />
            <Text style={styles.actionBtnText}>Bagikan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
  fixtureList: { gap: 10 },
  fixtureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  fixtureInfo: { flex: 1, paddingRight: 8 },
  fixtureName: { fontSize: 14, fontWeight: '700', color: colors.text },
  fixtureSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 4,
  },
  stepBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  stepBtnDisabled: { opacity: 0.5 },
  countText: { width: 28, textAlign: 'center', fontSize: 15, fontWeight: '800', color: colors.text },
  resultBox: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    elevation: 2,
  },
  totalBox: {
    backgroundColor: '#f0fdf4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
    marginBottom: 14,
  },
  totalLabel: { fontSize: 12, fontWeight: '600', color: '#166534' },
  totalValue: { fontSize: 32, fontWeight: '800', color: '#15803d', marginVertical: 2 },
  totalSub: { fontSize: 11, color: '#166534' },
  recomHeader: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 10 },
  recomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  recomIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recomTextWrap: { flex: 1 },
  recomTitle: { fontSize: 11, color: colors.textMuted },
  recomValue: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
  },
  saveBtn: { backgroundColor: colors.secondary },
  savedBtn: { backgroundColor: '#94a3b8' },
  shareBtn: { backgroundColor: '#10b981' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
});
