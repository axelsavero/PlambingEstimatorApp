import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  getCalculations,
  deleteCalculation,
  clearAllCalculations,
} from '../utils/storage';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getCalculations();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id, title) => {
    Alert.alert('Hapus Riwayat', `Apakah Anda yakin ingin menghapus "${title}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteCalculation(id);
          setHistory(updated);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert(
      'Hapus Seluruh Riwayat',
      'Seluruh catatan perhitungan yang tersimpan akan dibersihkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bersihkan Semua',
          style: 'destructive',
          onPress: async () => {
            await clearAllCalculations();
            setHistory([]);
          },
        },
      ]
    );
  };

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `*Arsip Perhitungan Estimator*\n` +
          `• Judul: ${item.title}\n` +
          `• Tanggal: ${item.date}\n` +
          `• Ringkasan:\n${item.summary}\n\n` +
          `Tersimpan di Plambing & Construction Estimator App`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleWrap}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleShare(item)}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleDelete(item.id, item.title)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>{item.summary}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>
          Total Riwayat: <Text style={styles.bold}>{history.length}</Text>
        </Text>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Ionicons name="trash-bin-outline" size={14} color={colors.danger} />
            <Text style={styles.clearBtnText}>Hapus Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="time-outline" size={48} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat Tersimpan</Text>
              <Text style={styles.emptySub}>
                Gunakan tombol "Simpan" pada kalkulator untuk mengarsipkan hasil hitung Anda di sini.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: { fontSize: 13, color: colors.textMuted },
  bold: { fontWeight: '800', color: colors.text },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: colors.dangerLight,
  },
  clearBtnText: { fontSize: 12, fontWeight: '700', color: colors.danger },
  listContent: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleWrap: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  itemDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 6, borderRadius: 6, backgroundColor: '#f8fafc' },
  summaryBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryText: { fontSize: 12, color: colors.text, lineHeight: 18 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
});
