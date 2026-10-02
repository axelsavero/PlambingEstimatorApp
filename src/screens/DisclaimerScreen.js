import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { startSession, clearAppSession } from '../utils/sessionManager';
import RABProLogo from '../components/RABProLogo';

export default function DisclaimerScreen({ navigation, onContinue, onClearSession }) {
  const isFromModal = navigation?.canGoBack && navigation.canGoBack();

  const handleProceed = () => {
    startSession();
    if (onContinue) {
      onContinue();
    } else if (isFromModal) {
      navigation.goBack();
    } else if (navigation) {
      // Navigasi aman ke tab Home di dalam MainTabs navigator
      navigation.navigate('MainTabs', { screen: 'HomeTab' });
    }
  };

  const handleManualClearSession = () => {
    Alert.alert(
      'Hapus Sesi Aplikasi',
      'Apakah Anda yakin ingin menghapus sesi aktif dan kembali ke tampilan disclaimer pembuka?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Sesi',
          style: 'destructive',
          onPress: () => {
            clearAppSession();
            if (onClearSession) {
              onClearSession();
            }
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
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={styles.bannerRow}>
            <View style={styles.titleBadge}>
              <Text style={styles.titleBadgeText}>Disclaimer untuk Pengguna</Text>
            </View>
            <View style={styles.appBrandRow}>
              <RABProLogo size={32} textSize={20} textColor={colors.primaryDark} />
              {isFromModal ? (
                <TouchableOpacity
                  style={styles.btnClose}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              ) : null}
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
              <Ionicons
                name={isFromModal ? 'arrow-back' : 'checkmark-done'}
                size={20}
                color="#ffffff"
              />
              <Text style={styles.btnProceedText}>
                {isFromModal
                  ? 'Tutup & Kembali ke Aplikasi'
                  : 'Saya Mengerti & Setuju — Buka Aplikasi'}
              </Text>
            </TouchableOpacity>

            {/* Opsi Hapus Sesi jika dibuka dari dalam aplikasi */}
            {isFromModal ? (
              <TouchableOpacity
                style={styles.btnClearSession}
                activeOpacity={0.85}
                onPress={handleManualClearSession}
              >
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                <Text style={styles.btnClearSessionText}>
                  Hapus Sesi & Keluar
                </Text>
              </TouchableOpacity>
            ) : null}
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
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  titleBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  titleBadgeText: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  appBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnClose: {
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paragraphBox: {
    flexDirection: 'row',
    backgroundColor: '#fffdf5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 12,
    gap: 10,
    alignItems: 'flex-start',
  },
  copyrightBox: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  iconBullet: {
    marginTop: 2,
  },
  bodyText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
  },
  boldText: {
    fontWeight: '800',
    color: '#0f172a',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  btnProceed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnProceedText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnClearSession: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  btnClearSessionText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '800',
  },
});
