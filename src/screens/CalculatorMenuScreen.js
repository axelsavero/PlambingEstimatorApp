import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const CALCULATORS = [
  {
    id: 'slope',
    route: 'SlopeCalc',
    title: 'Kalkulator Kemiringan Pipa (Slope)',
    subtitle: 'Menghitung beda tinggi elevasi pipa buangan (standar 1% - 2% SNI)',
    icon: 'trending-down',
    color: '#0284c7',
    badge: 'Plambing',
  },
  {
    id: 'septic',
    route: 'SepticTankCalc',
    title: 'Dimensi Tangki Septik & Resapan',
    subtitle: 'Kapasitas volume basah, panjang, lebar, tinggi, dan bidang perkolasi',
    icon: 'cube-outline',
    color: '#d97706',
    badge: 'Sanitasi',
  },
  {
    id: 'ubap',
    route: 'FixtureUnitCalc',
    title: 'UBAP (Unit Beban Alat Plambing)',
    subtitle: 'Akumulasi bobot fixture dan rekomendasi diameter pipa buangan & air bersih',
    icon: 'water-outline',
    color: '#16a34a',
    badge: 'SNI 8153',
  },
  {
    id: 'material',
    route: 'MaterialEst',
    title: 'Estimasi Batang Pipa & Biaya (RAB)',
    subtitle: 'Hitung kebutuhan batang pipa 4 meteran, estimasi sambungan, dan anggaran',
    icon: 'cash-outline',
    color: '#9333ea',
    badge: 'Estimator',
  },
  {
    id: 'volume',
    route: 'VolumeCalc',
    title: 'Volume Struktur, Pondasi & Beton',
    subtitle: 'Footplate, batu kali, balok sloof, kolom induk, balok, dan plat lantai',
    icon: 'business-outline',
    color: '#0891b2',
    badge: 'Struktur PUPR',
  },
];

export default function CalculatorMenuScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alat Hitung Cepat</Text>
        <Text style={styles.headerSubtitle}>
          Pilih kalkulator teknis untuk mendapatkan estimasi otomatis akurat
        </Text>
      </View>

      <View style={styles.list}>
        {CALCULATORS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>

            <View style={styles.textWrap}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: `${item.color}20` }]}>
                  <Text style={[styles.badgeText, { color: item.color }]}>
                    {item.badge}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  headerSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  list: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: { flex: 1, marginRight: 8 },
  badgeRow: { marginBottom: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, lineHeight: 20 },
  cardSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 3, lineHeight: 16 },
});
