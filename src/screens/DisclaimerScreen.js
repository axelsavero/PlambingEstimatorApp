import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { setDisclaimerAccepted } from '../utils/rabStorage';

export default function DisclaimerScreen({ navigation, onContinue }) {
  const handleProceed = async () => {
    await setDisclaimerAccepted();
    if (onContinue) {
      onContinue();
    } else if (navigation) {
      navigation.navigate('HomeTab');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={styles.bannerRow}>
            <View style={styles.titleBadge}>
              <Text style={styles.titleBadgeText}>Disclaimer untuk Pengguna</Text>
            </View>
            <View style={styles.appBrandRow}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logoIcon}
                resizeMode="contain"
              />
              <Text style={styles.brandTitle}>RABPro</Text>
            </View>
          </View>

          {/* Paragraph 1 */}
          <View style={styles.paragraphBox}>
            <View style={styles.iconBullet}>
              <Ionicons name="alert-circle-outline" size={20} color="#b45309" />
            </View>
            <Text style={styles.bodyText}>
              Aplikasi RABPro dirancang khusus sebagai alat bantu hitung volume
              pekerjaan konstruksi, dengan pendekatan matematis, ilmiah dan
              pengalaman empiris/uji coba. Tingkat akurasi ataupun perbedaan
              data dapat mungkin terjadi di lapangan, kebijakan pengguna
              diperlukan. Khususnya dalam penyesuaian fleksibilitas ataupun{' '}
              <Text style={styles.boldText}>Engineering Judgment</Text>.
              Pengembang tools tidak bertanggung jawab atas segala yang
              merugikan dari aplikasi ini.
            </Text>
          </View>

          {/* Paragraph 2 - Hak Cipta */}
          <View style={[styles.paragraphBox, styles.copyrightBox]}>
            <View style={styles.iconBullet}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0369a1" />
            </View>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Tentang HAK CIPTA & KARYA:</Text>{' '}
              Hak Cipta dilindungi (Undang-Undang Nomor 28 tahun 2014 tentang
              Hak Cipta). Dilarang keras mengubah, memodifikasi,
              memperjualbelikan, mencuri data atau segala tindakan yang melanggar
              hak karya, tanpa izin dari pihak pengembang{' '}
              <Text style={styles.boldText}>RABPro</Text>.
            </Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnProceed}
              activeOpacity={0.85}
              onPress={handleProceed}
            >
              <Ionicons name="checkmark-done" size={20} color="#ffffff" />
              <Text style={styles.btnProceedText}>
                Saya Mengerti & Setuju — Buka Aplikasi
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  titleBadge: {
    backgroundColor: '#facc15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  titleBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
  appBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  paragraphBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    gap: 12,
  },
  copyrightBox: {
    backgroundColor: '#f0f9ff',
    borderLeftColor: '#0284c7',
  },
  iconBullet: {
    marginTop: 2,
  },
  bodyText: {
    flex: 1,
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '800',
    color: '#0f172a',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnProceed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  btnProceedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
