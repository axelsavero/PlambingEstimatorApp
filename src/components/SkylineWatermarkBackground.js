import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function SkylineWatermarkBackground({ children, style, contentContainerStyle }) {
  return (
    <View style={[styles.container, style]}>
      {/* Background Decorator Layer: Murni Absolut, Terpisah dari Alur Flex Konten */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        {/* Layer 1: Watermark Logo Transparan di Tengah */}
        <View style={styles.watermarkCenter}>
          <Image
            source={require('../../assets/brand/logo_icon.png')}
            style={styles.watermarkImage}
            resizeMode="contain"
          />
        </View>

        {/* Layer 2: Siluet gedung di bawah. Strip sudah dipotong rapat (tanpa margin
            & pantulan) dan ditampilkan sesuai rasio aslinya agar puncak gedung tidak terpotong */}
        <Image
          source={require('../../assets/brand/skyline_strip.png')}
          style={styles.skylineImage}
          resizeMode="stretch"
        />
      </View>

      {/* Layer 3: Konten Utama Aplikasi */}
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
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  watermarkCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkImage: {
    width: 200,
    height: 200,
    opacity: 0.08, // Transparan lembut elegan
  },
  skylineImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    aspectRatio: 3138 / 429, // rasio skyline_strip.png
    opacity: 0.16, // Siluet skyline lembut
  },
  contentLayer: {
    flex: 1,
    zIndex: 1,
  },
});
