import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { hitungKemiringanPipa } from '../utils/calculations';

export default function SlopeCalcScreen() {
  const [panjang, setPanjang] = useState('');
  const [persen, setPersen] = useState('2'); // Default 2%
  const [hasil, setHasil] = useState(null);

  const handleCalculate = () => {
    const res = hitungKemiringanPipa(panjang, persen);
    setHasil(res);
  };

  const handleShare = async () => {
    if (!hasil) return;
    try {
      await Share.share({
        message: `*Hasil Perhitungan Kemiringan Pipa*\nPanjang Saluran: ${hasil.panjangMeter} m\nKemiringan: ${hasil.kemiringanPersen}%\nBeda Tinggi / Drop: ${hasil.bedaTinggiCm} cm`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Panjang Saluran Pipa (Meter):</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: 12"
        keyboardType="numeric"
        value={panjang}
        onChangeText={setPanjang}
      />

      <Text style={styles.label}>Persentase Kemiringan / Slope (%):</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: 2"
        keyboardType="numeric"
        value={persen}
        onChangeText={setPersen}
      />

      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Hitung Beda Tinggi</Text>
      </TouchableOpacity>

      {hasil && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Hasil Perhitungan:</Text>
          <Text style={styles.resultItem}>• Panjang Pipa: {hasil.panjangMeter} meter</Text>
          <Text style={styles.resultItem}>• Kemiringan Standar: {hasil.kemiringanPersen} %</Text>
          <Text style={[styles.resultItem, styles.highlight]}>
            • Penurunan / Beda Tinggi: {hasil.bedaTinggiCm} cm
          </Text>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>Bagikan Hasil (WhatsApp)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0284c7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  resultBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#0369a1', marginBottom: 8 },
  resultItem: { fontSize: 14, color: '#0f172a', marginBottom: 4 },
  highlight: { fontWeight: 'bold', color: '#0284c7', fontSize: 16, marginTop: 4 },
  shareBtn: {
    marginTop: 12,
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  shareBtnText: { color: '#ffffff', fontWeight: '600' },
});