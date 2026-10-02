import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function RABProLogo({
  size = 32,
  showText = true,
  textSize = 20,
  textColor = '#0f172a',
  cubeColor = '#0284c7',
  cubeBgColor = '#e0f2fe',
}) {
  const iconSize = Math.round(size * 0.65);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.cubeBox,
          {
            width: size,
            height: size,
            backgroundColor: cubeBgColor,
            borderRadius: Math.round(size * 0.25),
          },
        ]}
      >
        <Ionicons name="cube" size={iconSize} color={cubeColor} />
      </View>

      {showText && (
        <Text style={[styles.brandText, { fontSize: textSize, color: textColor }]}>
          RABPro
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cubeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  brandText: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});
