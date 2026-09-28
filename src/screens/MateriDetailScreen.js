import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function MateriDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = item.steps || [];
  const currentStep = steps[currentStepIndex] || null;

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleOpenCalculator = () => {
    if (item.calcRoute) {
      navigation.navigate('KalkulatorTab', { screen: item.calcRoute });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.kategori}</Text>
        </View>
        <Text style={styles.title}>{item.judul}</Text>
        <Text style={styles.summary}>{item.ringkasan}</Text>
      </View>

      {/* Interactive Step-by-Step Viewer */}
      {steps.length > 0 && (
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>
                Langkah {currentStepIndex + 1} dari {steps.length}
              </Text>
            </View>
            <View style={styles.stepProgressRow}>
              {steps.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.stepDot,
                    idx === currentStepIndex && styles.stepDotActive,
                    idx < currentStepIndex && styles.stepDotCompleted,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.visualBox}>
            <View style={styles.visualIconCircle}>
              <Ionicons
                name={
                  currentStepIndex === 0
                    ? 'calculator-outline'
                    : currentStepIndex === 1
                    ? 'layers-outline'
                    : 'checkmark-circle-outline'
                }
                size={36}
                color={colors.primary}
              />
            </View>
            <Text style={styles.visualStepTitle}>{currentStep?.title}</Text>
            <Text style={styles.visualStepBadge}>Tahap {currentStep?.step}</Text>
          </View>

          <View style={styles.stepBody}>
            <Text style={styles.stepDesc}>{currentStep?.desc}</Text>

            {currentStep?.rumus && (
              <View style={styles.formulaBox}>
                <View style={styles.formulaHeader}>
                  <Ionicons name="bulb-outline" size={16} color="#d97706" />
                  <Text style={styles.formulaHeaderText}>Rumus / Acuan:</Text>
                </View>
                <Text style={styles.formulaCode}>{currentStep.rumus}</Text>
              </View>
            )}
          </View>

          <View style={styles.stepperNav}>
            <TouchableOpacity
              style={[styles.stepperBtn, currentStepIndex === 0 && styles.stepperBtnDisabled]}
              onPress={handlePrev}
              disabled={currentStepIndex === 0}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={currentStepIndex === 0 ? '#94a3b8' : '#ffffff'}
              />
              <Text
                style={[
                  styles.stepperBtnText,
                  currentStepIndex === 0 && styles.stepperBtnTextDisabled,
                ]}
              >
                Sebelumnya
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.stepperBtn,
                styles.stepperBtnPrimary,
                currentStepIndex === steps.length - 1 && styles.stepperBtnFinish,
              ]}
              onPress={handleNext}
              disabled={currentStepIndex === steps.length - 1}
            >
              <Text style={styles.stepperBtnText}>
                {currentStepIndex === steps.length - 1 ? 'Selesai' : 'Langkah Berikut'}
              </Text>
              <Ionicons
                name={currentStepIndex === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
                size={18}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {item.tips && (
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="warning-outline" size={20} color="#b45309" />
            <Text style={styles.tipTitle}>Catatan Pengawas Lapangan</Text>
          </View>
          <Text style={styles.tipText}>{item.tips}</Text>
        </View>
      )}

      {item.calcRoute && (
        <TouchableOpacity
          style={styles.calcCtaBtn}
          activeOpacity={0.85}
          onPress={handleOpenCalculator}
        >
          <Ionicons name="calculator" size={22} color="#ffffff" />
          <Text style={styles.calcCtaText}>
            {item.calcTitle || 'Buka Kalkulator Terkait'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#ffffff" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  categoryText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, lineHeight: 26, marginBottom: 8 },
  summary: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepNumberBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepNumberText: { fontSize: 11, fontWeight: '700', color: colors.text },
  stepProgressRow: { flexDirection: 'row', gap: 6 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cbd5e1' },
  stepDotActive: { width: 20, backgroundColor: colors.primary },
  stepDotCompleted: { backgroundColor: colors.primaryLight },
  visualBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
  },
  visualIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#bae6fd',
    marginBottom: 10,
  },
  visualStepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  visualStepBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    marginTop: 4,
  },
  stepBody: { padding: 16 },
  stepDesc: { fontSize: 14, color: colors.text, lineHeight: 22, marginBottom: 14 },
  formulaBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  formulaHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  formulaHeaderText: { fontSize: 12, fontWeight: '700', color: '#b45309' },
  formulaCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350f',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  stepperNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#f8fafc',
    gap: 10,
  },
  stepperBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#64748b',
    paddingVertical: 10,
    borderRadius: 8,
  },
  stepperBtnPrimary: { backgroundColor: colors.primary },
  stepperBtnFinish: { backgroundColor: '#10b981' },
  stepperBtnDisabled: { backgroundColor: '#e2e8f0' },
  stepperBtnText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  stepperBtnTextDisabled: { color: '#94a3b8' },
  tipCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: '#92400e' },
  tipText: { fontSize: 13, color: '#78350f', lineHeight: 19 },
  calcCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  calcCtaText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
});
