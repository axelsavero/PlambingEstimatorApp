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
import { hitungKemiringanPipa } from '../utils/calculations';
import { saveCalculation } from '../utils/storage';

export default function SlopeCalcScreen() {
  const [panjang, setPanjang] = useState('');
  const [persen, setPersen] = useState('2');
  const [hasil, setHasil] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    if (!panjang || parseFloat(panjang) <= 0) {
      Alert.alert('Perhatian', 'Masukkan panjang saluran pipa yang valid.');
      return;
    }
    const res = hitungKemiringanPipa(panjang, persen);
    setHasil(res);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!hasil) return;
    const item = {
      type: 'slope',
      title: 'Kemiringan Pipa',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      summary: `P: ${hasil.panjangMeter} m | S: ${hasil.kemiringanPersen}% -> Drop: ${hasil.bedaTinggiCm} cm`,
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
        message: `*Hasil Perhitungan Kemiringan Pipa (Plambing Estimator)*\n` +
          `• Panjang Saluran: ${hasil.panjangMeter} meter\n` +
          `• Kemiringan (Slope): ${hasil.kemiringanPersen} %\n` +
          `• Penurunan / Beda Tinggi: ${hasil.bedaTinggiCm} cm (${hasil.bedaTinggiMeter} m)\n` +
          `• Catatan: ${hasil.rekomendasi}\n\n` +
          `Dihitung otomatis via Plambing Estimator App (SNI 8153:2015)`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Kalkulator Kemiringan Pipa (Slope)</Text>
        <Text style={styles.subtitle}>
          Hitung beda tinggi (drop) saluran air buangan gravitasi
        </Text>

        <Text style={styles.label}>Panjang Saluran Pipa (Meter):</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 12"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={panjang}
          onChangeText={(v) => {
            setPanjang(v);
            setSaved(false);
          }}
        />

        <Text style={styles.label}>Persentase Kemiringan / Slope (%):</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 2"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={persen}
          onChangeText={(v) => {
            setPersen(v);
            setSaved(false);
          }}
        />

        <View style={styles.presetRow}>
          <Text style={styles.presetLabel}>Preset SNI:</Text>
          {['1', '1.5', '2'].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.presetChip, persen === val && styles.presetChipActive]}
              onPress={() => {
                setPersen(val);
                setSaved(false);
              }}
            >
              <Text
                style={[
                  styles.presetChipText,
                  persen === val && styles.presetChipTextActive,
                ]}
              >
                {val}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Ionicons name="calculator" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Hitung Beda Tinggi</Text>
        </TouchableOpacity>
      </View>

      {hasil && (
        <View style={styles.resultBox}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
            <Text style={styles.resultTitle}>Hasil Perhitungan:</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Panjang Saluran:</Text>
            <Text style={styles.resultValue}>{hasil.panjangMeter} meter</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Kemiringan Standar:</Text>
            <Text style={styles.resultValue}>{hasil.kemiringanPersen} %</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>Total Beda Tinggi / Penurunan (Drop):</Text>
            <Text style={styles.highlightValue}>{hasil.bedaTinggiCm} cm</Text>
            <Text style={styles.highlightSub}>({hasil.bedaTinggiMeter} meter)</Text>
          </View>

          <View style={styles.noteBox}>
            <Ionicons name="information-circle-outline" size={18} color="#0369a1" />
            <Text style={styles.noteText}>{hasil.rekomendasi}</Text>
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
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  presetLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  presetChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  presetChipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  presetChipTextActive: { color: '#ffffff' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
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
    borderColor: '#bae6fd',
    elevation: 2,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primaryDark },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  resultLabel: { fontSize: 13, color: colors.textMuted },
  resultValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  highlightBox: {
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  highlightLabel: { fontSize: 12, fontWeight: '600', color: '#0369a1' },
  highlightValue: { fontSize: 28, fontWeight: '800', color: colors.primary, marginVertical: 2 },
  highlightSub: { fontSize: 12, color: '#0284c7' },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  noteText: { flex: 1, fontSize: 12, color: '#0369a1' },
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