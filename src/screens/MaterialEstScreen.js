import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { hitungRABPipa, formatRupiah } from '../utils/calculations';
import { saveCalculation } from '../utils/storage';

export default function MaterialEstScreen() {
  const [panjang, setPanjang] = useState('48');
  const [harga, setHarga] = useState('85000');
  const [fittingPersen, setFittingPersen] = useState('20');
  const [hasil, setHasil] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    const L = parseFloat(panjang);
    const H = parseFloat(harga);
    if (!L || L <= 0 || !H || H <= 0) {
      Alert.alert('Perhatian', 'Masukkan total panjang dan harga satuan yang valid.');
      return;
    }
    const res = hitungRABPipa(L, H, fittingPersen);
    setHasil(res);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!hasil) return;
    const item = {
      type: 'material_rab',
      title: 'Estimasi RAB Pipa',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      summary: `${hasil.totalPanjangMeter}m -> ${hasil.kebutuhanBatang} Batang | Biaya: ${hasil.estimasiBiayaFormatted}`,
      data: hasil,
    };
    await saveCalculation(item);
    setSaved(true);
    Alert.alert('Berhasil', 'Hasil estimasi RAB pipa telah disimpan ke riwayat.');
  };

  const handleShare = async () => {
    if (!hasil) return;
    try {
      await Share.share({
        message: `*Hasil Estimasi Kebutuhan Batang Pipa & Biaya (RAB)*\n` +
          `• Total Panjang Saluran: ${hasil.totalPanjangMeter} meter\n` +
          `• Kebutuhan Batang Pipa (4m/btg): ${hasil.kebutuhanBatang} Batang\n` +
          `• Estimasi Fitting / Sambungan: ~${hasil.estimasiFittingPcs} pcs\n` +
          `• Subtotal Biaya Pipa: ${hasil.biayaPipaFormatted}\n` +
          `• Subtotal Aksesoris & Lem: ${hasil.biayaFittingFormatted}\n` +
          `• *TOTAL ESTIMASI BIAYA: ${hasil.estimasiBiayaFormatted}*\n\n` +
          `Dihitung otomatis via Plambing Estimator App`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Estimator Material Batang & Biaya RAB</Text>
        <Text style={styles.subtitle}>
          Hitung kebutuhan pipa 4 meteran standar Indonesia beserta perkiraan anggaran
        </Text>

        <Text style={styles.label}>Total Panjang Jalur Pipa (Meter):</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 48"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={panjang}
          onChangeText={(v) => {
            setPanjang(v);
            setSaved(false);
          }}
        />

        <Text style={styles.label}>Harga Satuan Pipa per Batang (Rp):</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 85000"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={harga}
          onChangeText={(v) => {
            setHarga(v);
            setSaved(false);
          }}
        />

        <Text style={styles.label}>Biaya Sambungan, Fitting & Lem (%):</Text>
        <TextInput
          style={styles.input}
          placeholder="Standar 20%"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={fittingPersen}
          onChangeText={(v) => {
            setFittingPersen(v);
            setSaved(false);
          }}
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Ionicons name="calculator" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Hitung Kebutuhan & Biaya</Text>
        </TouchableOpacity>
      </View>

      {hasil && (
        <View style={styles.resultBox}>
          <View style={styles.resultHeader}>
            <Ionicons name="receipt" size={22} color="#9333ea" />
            <Text style={styles.resultTitle}>Ringkasan Estimasi Biaya & Material:</Text>
          </View>

          <View style={styles.batangCard}>
            <Text style={styles.batangLabel}>Kebutuhan Batang Pipa (Panjang 4m)</Text>
            <Text style={styles.batangValue}>{hasil.kebutuhanBatang} Batang</Text>
            <Text style={styles.batangSub}>Sudah termasuk safety factor potongan 5%</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableKey}>Estimasi Fitting (Knee, Tee, Socket):</Text>
              <Text style={styles.tableVal}>~{hasil.estimasiFittingPcs} pcs</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableKey}>Subtotal Pembelian Pipa:</Text>
              <Text style={styles.tableVal}>{hasil.biayaPipaFormatted}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableKey}>Subtotal Aksesoris & Lem:</Text>
              <Text style={styles.tableVal}>{hasil.biayaFittingFormatted}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL ESTIMASI ANGGARAN:</Text>
              <Text style={styles.totalVal}>{hasil.estimasiBiayaFormatted}</Text>
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
      )}
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
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    color: colors.text,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#9333ea',
    padding: 14,
    borderRadius: 10,
    marginTop: 4,
  },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  resultBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    elevation: 2,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#7e22ce' },
  batangCard: {
    backgroundColor: '#faf5ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3e8ff',
    marginBottom: 14,
  },
  batangLabel: { fontSize: 12, color: '#7e22ce', fontWeight: '600' },
  batangValue: { fontSize: 28, fontWeight: '800', color: '#9333ea', marginVertical: 2 },
  batangSub: { fontSize: 11, color: '#a855f7' },
  table: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  tableKey: { fontSize: 12, color: colors.textMuted },
  tableVal: { fontSize: 13, fontWeight: '700', color: colors.text },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
  totalLabel: { fontSize: 12, fontWeight: '800', color: '#7e22ce' },
  totalVal: { fontSize: 16, fontWeight: '800', color: '#7e22ce' },
  actionRow: { flexDirection: 'row', gap: 10 },
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
