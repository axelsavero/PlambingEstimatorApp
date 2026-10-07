import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import katex from 'katex';
import { KATEX_CSS } from '../constants/katexCss';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';

/**
 * MathEquation
 * Kartu rumus ringkas: label, persamaan KaTeX (offline), dan teks rumus.
 * Persamaan yang lebih lebar dari kartu otomatis diperkecil agar tetap utuh.
 */
export default function MathEquation({ label, latex, teks, height = 56 }) {
  const html = useMemo(() => {
    if (!latex) return '';
    try {
      const markup = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      });
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
${KATEX_CSS}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  background: #FFFFFF;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
#eq { transform-origin: left center; white-space: nowrap; }
.katex-display { margin: 0 !important; text-align: left; }
.katex { font-size: 1.15rem; color: #1E1E1E; }
</style>
</head>
<body>
<div id="eq">${markup}</div>
<script>
  // Perkecil persamaan yang lebih lebar dari kartu. Di Android, WebView bisa
  // belum punya ukuran saat skrip jalan (lebar 0) -> jangan skala ke 0;
  // ulangi saat ukuran berubah & setelah font KaTeX termuat.
  var eq = document.getElementById('eq');
  function fit() {
    var w = document.documentElement.clientWidth;
    var full = eq.scrollWidth;
    if (!w || !full) return;
    var scale = Math.min(1, w / full);
    eq.style.transform = scale < 1 ? 'scale(' + scale + ')' : '';
  }
  fit();
  window.addEventListener('load', fit);
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  setTimeout(fit, 150);
</script>
</body>
</html>`;
    } catch (e) {
      return '';
    }
  }, [latex]);

  return (
    <View style={styles.card}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {html ? (
        <View style={{ height }}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            scrollEnabled={false}
            javaScriptEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : null}

      {teks ? (
        <Text style={styles.teks} selectable>
          {teks}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  webview: {
    backgroundColor: colors.surface,
  },
  teks: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
