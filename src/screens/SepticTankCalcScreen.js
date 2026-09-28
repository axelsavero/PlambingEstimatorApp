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
import { hitungSepticTank } from '../utils/calculations';
import { saveCalculation } from '../utils/storage';

export default function SepticTankCalcScreen() {
  const [orang, setOrang] = useState('5');
  const [bangunan, setBangunan] = useState('rumah');
  const [hasil, setHasil] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    const n = parseInt(orang, 10);
    if (!n || n <= 0) {
      Alert.alert('Perhatian', 'Masukkan jumlah pemakai / orang yang valid.');
      return;
    }
    const res = hitungSepticTank(n, bangunan);
    setHasil(res);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!hasil) return;
    const item = {
      type: 'septic',
      title: 'Dimensi Septic Tank',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      summary: `${hasil.jumlahOrang} Org (${hasil.jenisBangunan}) -> V: ${hasil.volumeM3} m³ | P: ${hasil.panjangMeter}m L: ${hasil.lebarMeter}m T: ${hasil.tinggiMeter}m`,
      data: hasil,
    };
    await saveCalculation(item);
    setSaved(true);
    Alert.alert('Berhasil', 'Hasil perhitungan telah disimpan ke riwayat.');
  };

  const handleShare = async () => {
    if (!hasil) return;
    try {
      await Share.share({
        message: `*Hasil Perhitungan Dimensi Tangki Septik (SNI 2398:2017)*\n` +
          `• Kapasitas: ${hasil.jumlahOrang} Orang (${hasil.jenisBangunan})\n` +
          `• Volume Basah Efektif: ${hasil.volumeM3} m³\n` +
          `• Rekomendasi Dimensi Fisik:\n` +
          `  - Panjang (P): ${hasil.panjangMeter} meter\n` +
          `  - Lebar (L): ${hasil.lebarMeter} meter\n` +
          `  - Tinggi Total (T): ${hasil.tinggiMeter} meter\n` +
          `• Panjang Bidang Resapan: ${hasil.panjangResapanMeter} meter\n\n` +
          `Dihitung otomatis via Plambing Estimator App`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Dimensi Tangki Septik & Resapan</Text>
        <Text style={styles.subtitle}>
          Kapasitas ruang basah dan dimensi fisik sesuai SNI 2398:2017
        </Text>

        <Text style={styles.label}>Jumlah Pemakai / Penghuni (Orang):</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 5"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={orang}
          onChangeText={(v) => {
            setOrang(v);
            setSaved(false);
          }}
        />

        <Text style={styles.label}>Jenis Bangunan:</Text>
        <View style={styles.typeRow}>
          {[
            { id: 'rumah', label: 'Rumah Tinggal' },
            { id: 'kost', label: 'Kost / Asrama' },
            { id: 'kantor', label: 'Kantor' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.typeBtn,
                bangunan === item.id && styles.typeBtnActive,
              ]}
              onPress={() => {
                setBangunan(item.id);
                setSaved(false);
              }}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  bangunan === item.id && styles.typeBtnTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Ionicons name="calculator" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Hitung Dimensi Tangki</Text>
        </TouchableOpacity>
      </View>

      {hasil && (
        <View style={styles.resultBox}>
          <View style={styles.resultHeader}>
            <Ionicons name="cube" size={22} color={colors.secondary} />
            <Text style={styles.resultTitle}>Rekomendasi Desain Tangki:</Text>
          </View>

          <View style={styles.volumeCard}>
            <Text style={styles.volumeLabel}>Volume Ruang Basah Minimum</Text>
            <Text style={styles.volumeValue}>{hasil.volumeM3} m³</Text>
            <Text style={styles.volumeSub}>Waktu retensi 48 jam + cadangan lumpur</Text>
          </View>

          <Text style={styles.dimTitle}>Dimensi Fisik Septic Tank:</Text>
          <View style={styles.dimGrid}>
            <View style={styles.dimBox}>
              <Text style={styles.dimLabel}>Panjang (P)</Text>
              <Text style={styles.dimVal}>{hasil.panjangMeter} m</Text>
            </View>
            <View style={styles.dimBox}>
              <Text style={styles.dimLabel}>Lebar (L)</Text>
              <Text style={styles.dimVal}>{hasil.lebarMeter} m</Text>
            </View>
            <View style={styles.dimBox}>
              <Text style={styles.dimLabel}>Tinggi (T)</Text>
              <Text style={styles.dimVal}>{hasil.tinggiMeter} m</Text>
            </View>
          </View>

          <View style={styles.resapanBox}>
            <Ionicons name="git-branch-outline" size={18} color="#059669" />
            <Text style={styles.resapanText}>
              Panjang Bidang Resapan / Parit Resapan: <Text style={styles.bold}>{hasil.panjangResapanMeter} meter</Text>
            </Text>
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
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  typeBtnText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  typeBtnTextActive: { color: '#ffffff' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
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
    borderColor: '#fed7aa',
    elevation: 2,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: colors.secondaryDark },
  volumeCard: {
    backgroundColor: '#fff7ed',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffedd5',
    marginBottom: 14,
  },
  volumeLabel: { fontSize: 12, color: '#c2410c', fontWeight: '600' },
  volumeValue: { fontSize: 30, fontWeight: '800', color: '#ea580c', marginVertical: 2 },
  volumeSub: { fontSize: 11, color: '#9a3412' },
  dimTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  dimGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  dimBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dimLabel: { fontSize: 11, color: colors.textMuted },
  dimVal: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  resapanBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 16,
  },
  resapanText: { flex: 1, fontSize: 12, color: '#065f46' },
  bold: { fontWeight: 'bold' },
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
