import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function SkylineWatermarkBackground({ children, style, contentContainerStyle }) {
  return (
    <View style={[styles.container, style]}>
      {/* Layer 1: Watermark Logo Transparan */}
      <View style={styles.watermarkLayer} pointerEvents="none">
        <Image
          source={require('../../assets/brand/logo_icon.png')}
          style={styles.watermarkImage}
          resizeMode="contain"
        />
      </View>

      {/* Layer 2: Siluet Gedung Modern Skyline di Bagian Bawah */}
      <View style={styles.skylineLayer} pointerEvents="none">
        <Image
          source={require('../../assets/brand/modern_skyline.png')}
          style={styles.skylineImage}
          resizeMode="cover"
        />
      </View>

      {/* Layer 3: Konten Aplikasi Utama */}
      <View style={[styles.contentLayer, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  watermarkImage: {
    width: Math.min(width, height) * 0.95,
    height: Math.min(width, height) * 0.95,
    opacity: 0.08, // Transparan lembut agar tidak mengganggu keterbacaan teks
  },
  skylineLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120, // Ketinggian siluet gedung di bagian bawah
    zIndex: 2,
  },
  skylineImage: {
    width: '100%',
    height: '100%',
    opacity: 0.18, // Efek siluet skyline transparan
  },
  contentLayer: {
    flex: 1,
    zIndex: 10,
  },
});
