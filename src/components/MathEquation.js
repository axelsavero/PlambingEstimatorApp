import React, { useState } from 'react';
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
import { colors } from '../constants/colors';

/**
 * MathEquation
 * Komponen render persamaan / rumus matematika dengan font KaTeX (Computer Modern)
 * Memiliki fallback tampilan formula native dan tombol salin formula LaTeX.
 */
export default function MathEquation({
  latex,
  readable,
  title,
  height = 58,
}) {
  const [viewMode, setViewMode] = useState('katex'); // 'katex' | 'readable'
  const [copied, setCopied] = useState(false);

  // HTML page rendering KaTeX via local script & CDN fallback
  const katexHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body);"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: transparent;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .katex-display {
      margin: 0 !important;
    }
    .katex {
      font-size: 1.12rem !important;
      color: #0369a1;
      font-weight: 600;
    }
  </style>
</head>
<body>
  $$${latex || ''}$$
</body>
</html>
`;

  const handleShareOrCopy = async () => {
    try {
      await Share.share({
        message: `Rumus: ${title || ''}\n• KaTeX LaTeX: ${latex}\n• Acuan: ${readable}`,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.log('Copy formula error', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Rumus */}
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
          {/* Toggle KaTeX vs Readable */}
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'katex' && styles.toggleBtnActive]}
            onPress={() => setViewMode(viewMode === 'katex' ? 'readable' : 'katex')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={viewMode === 'katex' ? 'sparkles' : 'code-outline'}
              size={12}
              color={viewMode === 'katex' ? '#0369a1' : '#64748b'}
            />
            <Text
              style={[
                styles.toggleBtnText,
                viewMode === 'katex' && styles.toggleBtnTextActive,
              ]}
            >
              {viewMode === 'katex' ? 'Font KaTeX' : 'Teks Rumus'}
            </Text>
          </TouchableOpacity>

          {/* Share/Copy formula */}
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleShareOrCopy}
            activeOpacity={0.7}
          >
            <Ionicons
              name={copied ? 'checkmark-circle' : 'share-social-outline'}
              size={13}
              color={copied ? '#16a34a' : '#0284c7'}
            />
            <Text style={styles.copyBtnText}>
              {copied ? 'Tersalin' : 'Bagikan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body Equation Display */}
      {viewMode === 'katex' && latex ? (
        <View style={[styles.equationBox, { height }]}>
          <WebView
            originWhitelist={['*']}
            source={{ html: katexHtml }}
            style={styles.webview}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            androidLayerType={Platform.OS === 'android' ? 'software' : 'none'}
          />
        </View>
      ) : (
        <View style={styles.readableBox}>
          <Text style={styles.readableText}>{readable || latex}</Text>
        </View>
      )}

      {/* Footer Sub-keterangan */}
      {readable && viewMode === 'katex' ? (
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteLabel}>Bentuk Teknis: </Text>
          <Text style={styles.footerNoteText}>{readable}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
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
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleBtnActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#7dd3fc',
  },
  toggleBtnText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleBtnTextActive: {
    color: '#0369a1',
    fontWeight: '700',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  copyBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0284c7',
  },
  equationBox: {
    width: '100%',
    backgroundColor: '#fcfdfe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  readableBox: {
    padding: 10,
    backgroundColor: '#fffdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readableText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerNoteLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  footerNoteText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
});
