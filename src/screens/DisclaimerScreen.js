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
import { startSession } from '../utils/sessionManager';
import SkylineWatermarkBackground from '../components/SkylineWatermarkBackground';

export default function DisclaimerScreen({ onContinue }) {
  const handleProceed = () => {
    startSession();
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <SkylineWatermarkBackground style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={styles.bannerRow}>
            <View style={styles.titleBadge}>
              <Ionicons name="information-circle" size={14} color="#B45309" />
              <Text style={styles.titleBadgeText}>Disclaimer untuk Pengguna</Text>
            </View>
            <View style={styles.appBrandRow}>
              <Image
                source={require('../../assets/brand/logo_with_text.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Paragraph 1 - Panduan & Engineering Judgment */}
          <View style={styles.paragraphBox}>
            <View style={styles.iconBullet}>
              <Ionicons name="alert-circle" size={20} color="#ED7E08" />
            </View>
            <Text style={styles.bodyText}>
              Aplikasi <Text style={styles.boldText}>ESTIMATOR</Text> dirancang khusus sebagai alat bantu hitung volume
              pekerjaan konstruksi, dengan pendekatan matematis, ilmiah dan
              pengalaman empiris/uji coba. Tingkat akurasi ataupun perbedaan
              data dapat mungkin terjadi di lapangan, kebijakan pengguna
              diperlukan, khususnya dalam penyesuaian fleksibilitas ataupun{' '}
              <Text style={styles.boldText}>Engineering Judgment</Text>.
              Pengembang tools tidak bertanggung jawab atas segala hal yang
              merugikan dari penggunaan aplikasi ini.
            </Text>
          </View>

          {/* Paragraph 2 - Hak Cipta */}
          <View style={[styles.paragraphBox, styles.copyrightBox]}>
            <View style={styles.iconBullet}>
              <Ionicons name="shield-checkmark" size={20} color="#C66503" />
            </View>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Tentang HAK CIPTA & KARYA:</Text>{' '}
              Hak Cipta dilindungi (Undang-Undang Nomor 28 tahun 2014 tentang
              Hak Cipta). Dilarang keras mengubah, memodifikasi,
              memperjualbelikan, mencuri data atau segala tindakan yang melanggar
              hak karya, tanpa izin dari pihak pengembang{' '}
              <Text style={styles.boldText}>ESTIMATOR</Text>.
            </Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnProceed}
              activeOpacity={0.85}
              onPress={handleProceed}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.btnProceedText}>
                Saya Mengerti & Setuju — Buka Aplikasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SkylineWatermarkBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    maxWidth: 780,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  titleBadgeText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  appBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 120,
    height: 36,
  },
  paragraphBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    padding: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 10,
    gap: 10,
    alignItems: 'flex-start',
  },
  copyrightBox: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  iconBullet: {
    marginTop: 2,
  },
  bodyText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    color: '#334155',
  },
  boldText: {
    fontWeight: '800',
    color: '#1E1E1E',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  btnProceed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 7,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnProceedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
