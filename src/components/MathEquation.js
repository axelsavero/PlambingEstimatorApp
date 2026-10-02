import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import katex from 'katex';
import { KATEX_CSS } from '../constants/katexCss';

/**
 * MathEquation
 * Komponen render persamaan matematika standar LaTeX / Microsoft Word Equation Editor.
 * Menggunakan KaTeX renderToString lokal offline + MathML & KaTeX CSS embedded.
 * Mendukung eksponen (pangkat kecil di atas), pecahan bertingkat, akar kuadrat bergaris atas,
 * dan subskrip kecil di bawah, persis seperti Word Equation / LaTeX.
 */
export default function MathEquation({
  persamaan,
  readable,
  latex,
  title,
  height = 68,
}) {
  // Mode tampilan: 'persamaan' (Word/LaTeX equation) | 'teks' (Teks acuan lapangan)
  const [viewMode, setViewMode] = useState('persamaan');
  const [copied, setCopied] = useState(false);

  // Pre-render LaTeX ke HTML KaTeX secara sinkron dan 100% offline
  const katexHtml = useMemo(() => {
    const rawLatex = latex || persamaan || '';
    if (!rawLatex) return '';
    try {
      const renderedMarkup = katex.renderToString(rawLatex, {
        displayMode: true,
        throwOnError: false,
        output: 'htmlAndMathml',
      });

      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    ${KATEX_CSS}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background-color: #f8fafc;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: 'Cambria Math', 'STIX Two Math', 'Latin Modern Math', 'KaTeX_Math', 'Times New Roman', serif;
    }
    .katex-display {
      margin: 0 !important;
      text-align: center;
    }
    .katex {
      font-size: 1.25rem !important;
      color: #0369a1;
      font-weight: 600;
    }
    math {
      font-size: 1.25rem;
      color: #0369a1;
    }
  </style>
</head>
<body>
  ${renderedMarkup}
</body>
</html>
      `;
    } catch (e) {
      console.log('KaTeX render error', e);
      return '';
    }
  }, [latex, persamaan]);

  const displayEquation = persamaan || formatLatexToEquation(latex) || readable || '';
  const displayTextFormula = readable || displayEquation;

  const handleShareOrCopy = async () => {
    try {
      await Share.share({
        message: `*${title || 'Rumus Estimator RABPro'}*\n• Persamaan LaTeX: ${latex || displayEquation}\n• Acuan Lapangan: ${displayTextFormula}`,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.log('Copy formula error', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.mathBadge}>
            <Text style={styles.mathBadgeText}>Σ f(x)</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title || 'Persamaan Matematis / Rumus'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* Segmented Switch: [Persamaan] [Teks Rumus] */}
          <View style={styles.segmentedWrap}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                viewMode === 'persamaan' && styles.segmentBtnActive,
              ]}
              onPress={() => setViewMode('persamaan')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="calculator"
                size={11}
                color={viewMode === 'persamaan' ? '#ffffff' : '#64748b'}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  viewMode === 'persamaan' && styles.segmentBtnTextActive,
                ]}
              >
                Persamaan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                viewMode === 'teks' && styles.segmentBtnActive,
              ]}
              onPress={() => setViewMode('teks')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text-outline"
                size={11}
                color={viewMode === 'teks' ? '#ffffff' : '#64748b'}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  viewMode === 'teks' && styles.segmentBtnTextActive,
                ]}
              >
                Teks Rumus
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bagikan / Salin Button */}
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleShareOrCopy}
            activeOpacity={0.7}
          >
            <Ionicons
              name={copied ? 'checkmark-circle' : 'share-social-outline'}
              size={12}
              color={copied ? '#16a34a' : '#0284c7'}
            />
            <Text style={styles.copyBtnText}>
              {copied ? 'Tersalin' : 'Bagikan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Formula Content Area */}
      {viewMode === 'persamaan' ? (
        <View style={styles.equationCard}>
          <View style={styles.equationBadgeRow}>
            <View style={styles.notationBadge}>
              <Ionicons name="sparkles" size={10} color="#0284c7" />
              <Text style={styles.notationBadgeText}>Notasi Equation Editor (Word / LaTeX)</Text>
            </View>
          </View>

          {/* Render Offline KaTeX HTML in WebView with True Equations */}
          {katexHtml ? (
            <View style={[styles.webviewContainer, { height }]}>
              <WebView
                originWhitelist={['*']}
                source={{ html: katexHtml }}
                style={styles.webview}
                scrollEnabled={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.fallbackBox}>
              <Text style={styles.fallbackText}>{displayEquation}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.readableCard}>
          <View style={styles.equationBadgeRow}>
            <View style={styles.textFormulaBadge}>
              <Ionicons name="text-outline" size={10} color="#b45309" />
              <Text style={styles.textFormulaBadgeText}>Acuan Uraian Teknis</Text>
            </View>
          </View>

          <View style={styles.readableBox}>
            <Text style={styles.readableText} selectable={true}>
              {displayTextFormula}
            </Text>
          </View>
        </View>
      )}

      {/* Footer Sub-Note (Cross-Reference) */}
      <View style={styles.footerNote}>
        <Ionicons name="information-circle-outline" size={12} color="#64748b" />
        <Text style={styles.footerNoteLabel}>
          {viewMode === 'persamaan' ? 'Teks Rumus: ' : 'Bentuk Persamaan: '}
        </Text>
        <Text style={styles.footerNoteText} numberOfLines={1}>
          {viewMode === 'persamaan' ? displayTextFormula : displayEquation}
        </Text>
      </View>
    </View>
  );
}

/**
 * Helper untuk membersihkan LaTeX menjadi notasi matematika yang dapat dibaca
 */
function formatLatexToEquation(latex) {
  if (!latex) return '';
  return latex
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\sum_\{i=1\}\^\{([^}]+)\}/g, '∑(i=1..$1)')
    .replace(/\\sum_\{([^}]+)\}/g, '∑($1)')
    .replace(/\\sum/g, '∑')
    .replace(/\\left\lceil/g, '⌈')
    .replace(/\\right\rceil/g, '⌉')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\quad/g, '   ')
    .replace(/\\dots/g, '...')
    .replace(/\\%/g, '%')
    .replace(/\\alpha/g, 'α')
    .replace(/\\theta/g, 'θ')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/_\{([^}]+)\}/g, '_$1')
    .replace(/\\,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  mathBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  mathBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0369a1',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentedWrap: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    padding: 2,
    gap: 2,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  segmentBtnActive: {
    backgroundColor: '#0284c7',
  },
  segmentBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  segmentBtnTextActive: {
    color: '#ffffff',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  copyBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0284c7',
  },
  equationCard: {
    padding: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  equationBadgeRow: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  notationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  notationBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0369a1',
  },
  webviewContainer: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  webview: {
    backgroundColor: '#f8fafc',
    width: '100%',
    height: '100%',
  },
  fallbackBox: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  readableCard: {
    padding: 12,
    backgroundColor: '#fffdf5',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  textFormulaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textFormulaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#b45309',
  },
  readableBox: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fed7aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readableText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#92400e',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerNoteLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748b',
  },
  footerNoteText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
});
