import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function ResultCard({
  title = 'Hasil Perhitungan:',
  icon = 'checkmark-circle',
  iconColor = colors.primary,
  children,
  onSave,
  onShare,
  isSaved = false,
  style,
}) {
  return (
    <View style={[styles.resultBox, style]}>
      <View style={styles.resultHeader}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text style={[styles.resultTitle, { color: iconColor }]}>{title}</Text>
      </View>

      <View style={styles.body}>{children}</View>

      {(onSave || onShare) && (
        <View style={styles.actionRow}>
          {onSave && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.saveBtn, isSaved && styles.savedBtn]}
              onPress={onSave}
              disabled={isSaved}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSaved ? 'checkmark-done' : 'bookmark-outline'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.actionBtnText}>
                {isSaved ? 'Tersimpan' : 'Simpan'}
              </Text>
            </TouchableOpacity>
          )}

          {onShare && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.shareBtn]}
              onPress={onShare}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#ffffff" />
              <Text style={styles.actionBtnText}>Bagikan</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bae6fd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: colors.secondary,
  },
  savedBtn: {
    backgroundColor: '#94a3b8',
  },
  shareBtn: {
    backgroundColor: '#10b981',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
