import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  hitungVolumeFootplate,
  hitungVolumeBatuKali,
  hitungBetonKolom,
  hitungBetonBalok,
  hitungBetonPlat,
} from '../utils/calculations';
import { saveCalculation } from '../utils/storage';

export default function VolumeCalcScreen() {
  const [activeTab, setActiveTab] = useState('footplate');

  // Footplate state
  const [fpTitik, setFpTitik] = useState('20');
  const [fpPanjang, setFpPanjang] = useState('1.2');
  const [fpLebar, setFpLebar] = useState('1.2');
  const [fpTebalBalok, setFpTebalBalok] = useState('0.25');
  const [fpTinggiLimas, setFpTinggiLimas] = useState('0.20');
  const [fpAlasAtas, setFpAlasAtas] = useState('0.25');
  const [fpDalamGalian, setFpDalamGalian] = useState('1.5');
  const [fpHasil, setFpHasil] = useState(null);

  // Batu kali state
  const [bkPanjang, setBkPanjang] = useState('45');
  const [bkLebarBawah, setBkLebarBawah] = useState('0.7');
  const [bkLebarAtas, setBkLebarAtas] = useState('0.3');
  const [bkTinggi, setBkTinggi] = useState('0.8');
  const [bkHasil, setBkHasil] = useState(null);

  // Beton state
  const [betonTipe, setBetonTipe] = useState('kolom');
  const [btJml, setBtJml] = useState('16');
  const [btP, setBtP] = useState('0.2');
  const [btL, setBtL] = useState('0.2');
  const [btT, setBtT] = useState('3.5');
  const [btHasil, setBtHasil] = useState(null);

  const [saved, setSaved] = useState(false);

  const handleCalcFootplate = () => {
    const res = hitungVolumeFootplate({
      panjang: fpPanjang,
      lebar: fpLebar,
      tebalBalok: fpTebalBalok,
      tinggiLimas: fpTinggiLimas,
      alasAtasP: fpAlasAtas,
      alasAtasL: fpAlasAtas,
      jumlahTitik: fpTitik,
      dalamGalian: fpDalamGalian,
    });
    setFpHasil(res);
    setSaved(false);
  };

  const handleCalcBatuKali = () => {
    const res = hitungVolumeBatuKali({
      panjangPondasi: bkPanjang,
      lebarBawah: bkLebarBawah,
      lebarAtas: bkLebarAtas,
      tinggiPondasi: bkTinggi,
    });
    setBkHasil(res);
    setSaved(false);
  };

  const handleCalcBeton = () => {
    if (betonTipe === 'kolom') {
      const res = hitungBetonKolom(btJml, btP, btL, btT);
      setBtHasil({ tipe: 'Kolom Induk', ...res });
    } else if (betonTipe === 'balok') {
      const res = hitungBetonBalok(btP, btL, btT, 0.12, 4, 0.2);
      setBtHasil({ tipe: 'Balok Induk', ...res });
    } else {
      const res = hitungBetonPlat(btP, btL, btT, 4);
      setBtHasil({ tipe: 'Plat Lantai', ...res });
    }
    setSaved(false);
  };

  const handleSave = async (title, summary, data) => {
    const item = {
      type: 'volume_struktur',
      title,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      summary,
      data,
    };
    await saveCalculation(item);
    setSaved(true);
    Alert.alert('Berhasil', 'Hasil kalkulasi volume telah disimpan ke riwayat.');
  };

  const handleShare = async (message) => {
    try {
      await Share.share({ message });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'footplate' && styles.tabBtnActive]}
          onPress={() => setActiveTab('footplate')}
        >
          <Text style={[styles.tabText, activeTab === 'footplate' && styles.tabTextActive]}>
            Footplate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'batukali' && styles.tabBtnActive]}
          onPress={() => setActiveTab('batukali')}
        >
          <Text style={[styles.tabText, activeTab === 'batukali' && styles.tabTextActive]}>
            Batu Kali
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'beton' && styles.tabBtnActive]}
          onPress={() => setActiveTab('beton')}
        >
          <Text style={[styles.tabText, activeTab === 'beton' && styles.tabTextActive]}>
            Kolom & Balok
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTPLATE */}
      {activeTab === 'footplate' && (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pondasi Footplate (Telapak Beton)</Text>
            <Text style={styles.cardSubtitle}>
              Hitung galian, lantai kerja, beton balok & limas terpancung
            </Text>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Jumlah Titik (N):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={fpTitik}
                  onChangeText={setFpTitik}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Kedalaman Galian (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={fpDalamGalian}
                  onChangeText={setFpDalamGalian}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Panjang Telapak (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={fpPanjang}
                  onChangeText={setFpPanjang}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Lebar Telapak (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={fpLebar}
                  onChangeText={setFpLebar}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Tebal Balok Bawah (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={fpTebalBalok}
                  onChangeText={setFpTebalBalok}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Tinggi Limas (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={fpTinggiLimas}
                  onChangeText={setFpTinggiLimas}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.btnCalculate} onPress={handleCalcFootplate}>
              <Ionicons name="calculator" size={18} color="#ffffff" />
              <Text style={styles.btnCalculateText}>Hitung Volume Footplate</Text>
            </TouchableOpacity>
          </View>

          {fpHasil && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Hasil Perhitungan Footplate ({fpHasil.jumlahTitik} Titik):</Text>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Volume Galian Tanah:</Text>
                <Text style={styles.resVal}>{fpHasil.volGalian} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Urugan Pasir Dasar:</Text>
                <Text style={styles.resVal}>{fpHasil.volPasir} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Lantai Kerja Rabat Beton:</Text>
                <Text style={styles.resVal}>{fpHasil.volLantaiKerja} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={[styles.resLabel, styles.bold]}>Beton Struktur Footplate:</Text>
                <Text style={[styles.resVal, styles.highlightVal]}>{fpHasil.volStrukturBeton} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Luas Bekisting Balok:</Text>
                <Text style={styles.resVal}>{fpHasil.luasBekistingM2} m²</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Urugan Tanah Kembali:</Text>
                <Text style={styles.resVal}>{fpHasil.volUrugKembali} m³</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actBtn, styles.saveBtn, saved && styles.savedBtn]}
                  onPress={() =>
                    handleSave(
                      'Pondasi Footplate',
                      `${fpHasil.jumlahTitik} Titik -> Beton: ${fpHasil.volStrukturBeton} m³ | Galian: ${fpHasil.volGalian} m³`,
                      fpHasil
                    )
                  }
                  disabled={saved}
                >
                  <Ionicons name={saved ? 'checkmark-done' : 'bookmark'} size={16} color="#fff" />
                  <Text style={styles.actBtnText}>{saved ? 'Tersimpan' : 'Simpan'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actBtn, styles.shareBtn]}
                  onPress={() =>
                    handleShare(
                      `*Hasil Hitung Pondasi Footplate (${fpHasil.jumlahTitik} Titik)*\n` +
                      `• Beton Footplate: ${fpHasil.volStrukturBeton} m³\n` +
                      `• Galian Tanah: ${fpHasil.volGalian} m³\n` +
                      `• Urugan Pasir: ${fpHasil.volPasir} m³\n` +
                      `• Lantai Kerja: ${fpHasil.volLantaiKerja} m³\n` +
                      `• Bekisting: ${fpHasil.luasBekistingM2} m²\n` +
                      `• Urug Tanah Kembali: ${fpHasil.volUrugKembali} m³`
                    )
                  }
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                  <Text style={styles.actBtnText}>Bagikan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* BATU KALI */}
      {activeTab === 'batukali' && (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pondasi Batu Kali & Sloof</Text>
            <Text style={styles.cardSubtitle}>
              Hitung galian memanjang, aanstamping batu kosong, dan pasangan batu belah
            </Text>

            <Text style={styles.label}>Panjang Total Pondasi (m):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={bkPanjang}
              onChangeText={setBkPanjang}
            />

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>Lebar Bawah (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={bkLebarBawah}
                  onChangeText={setBkLebarBawah}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.label}>Lebar Atas (m):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={bkLebarAtas}
                  onChangeText={setBkLebarAtas}
                />
              </View>
            </View>

            <Text style={styles.label}>Tinggi Pondasi (m):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={bkTinggi}
              onChangeText={setBkTinggi}
            />

            <TouchableOpacity style={styles.btnCalculate} onPress={handleCalcBatuKali}>
              <Ionicons name="calculator" size={18} color="#ffffff" />
              <Text style={styles.btnCalculateText}>Hitung Volume Batu Kali</Text>
            </TouchableOpacity>
          </View>

          {bkHasil && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Hasil Perhitungan Batu Kali ({bkHasil.panjangPondasi} m):</Text>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Volume Galian Tanah:</Text>
                <Text style={styles.resVal}>{bkHasil.volGalian} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Urugan Pasir Dasar:</Text>
                <Text style={styles.resVal}>{bkHasil.volPasir} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Aanstamping Batu Kosong:</Text>
                <Text style={styles.resVal}>{bkHasil.volAanstamping} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={[styles.resLabel, styles.bold]}>Pasangan Batu Kali:</Text>
                <Text style={[styles.resVal, styles.highlightVal]}>{bkHasil.volPasanganBatu} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Balok Sloof Beton (15/20):</Text>
                <Text style={styles.resVal}>{bkHasil.volSloof} m³</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Bekisting Sloof:</Text>
                <Text style={styles.resVal}>{bkHasil.luasBekistingSloofM2} m²</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actBtn, styles.saveBtn, saved && styles.savedBtn]}
                  onPress={() =>
                    handleSave(
                      'Pondasi Batu Kali',
                      `P: ${bkHasil.panjangPondasi}m -> Batu Kali: ${bkHasil.volPasanganBatu} m³ | Sloof: ${bkHasil.volSloof} m³`,
                      bkHasil
                    )
                  }
                  disabled={saved}
                >
                  <Ionicons name={saved ? 'checkmark-done' : 'bookmark'} size={16} color="#fff" />
                  <Text style={styles.actBtnText}>{saved ? 'Tersimpan' : 'Simpan'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actBtn, styles.shareBtn]}
                  onPress={() =>
                    handleShare(
                      `*Hasil Hitung Pondasi Batu Kali (P: ${bkHasil.panjangPondasi}m)*\n` +
                      `• Pasangan Batu Kali: ${bkHasil.volPasanganBatu} m³\n` +
                      `• Aanstamping: ${bkHasil.volAanstamping} m³\n` +
                      `• Galian Tanah: ${bkHasil.volGalian} m³\n` +
                      `• Balok Sloof Beton: ${bkHasil.volSloof} m³\n` +
                      `• Bekisting Sloof: ${bkHasil.luasBekistingSloofM2} m²`
                    )
                  }
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                  <Text style={styles.actBtnText}>Bagikan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* BETON */}
      {activeTab === 'beton' && (
        <View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pekerjaan Beton Struktur</Text>
            <Text style={styles.cardSubtitle}>
              Hitung volume beton dan bekisting kolom induk, balok, & plat lantai
            </Text>

            <View style={styles.subTypeRow}>
              {[
                { id: 'kolom', label: 'Kolom' },
                { id: 'balok', label: 'Balok' },
                { id: 'plat', label: 'Plat Lantai' },
              ].map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.subTypeBtn, betonTipe === t.id && styles.subTypeBtnActive]}
                  onPress={() => {
                    setBetonTipe(t.id);
                    setBtHasil(null);
                  }}
                >
                  <Text
                    style={[styles.subTypeText, betonTipe === t.id && styles.subTypeTextActive]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {betonTipe === 'kolom' && (
              <View>
                <Text style={styles.label}>Jumlah Kolom:</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={btJml} onChangeText={setBtJml} />
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.label}>Dimensi P (m):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={btP} onChangeText={setBtP} />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.label}>Dimensi L (m):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={btL} onChangeText={setBtL} />
                  </View>
                </View>
                <Text style={styles.label}>Tinggi Kolom (m):</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={btT} onChangeText={setBtT} />
              </View>
            )}

            {betonTipe === 'balok' && (
              <View>
                <Text style={styles.label}>Panjang Total Balok (m):</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={btP} onChangeText={setBtP} />
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.label}>Lebar Balok (m):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={btL} onChangeText={setBtL} />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.label}>Tinggi Balok (m):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={btT} onChangeText={setBtT} />
                  </View>
                </View>
              </View>
            )}

            {betonTipe === 'plat' && (
              <View>
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.label}>Panjang Plat (m):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={btP} onChangeText={setBtP} />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.label}>Lebar Plat (m):</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={btL} onChangeText={setBtL} />
                  </View>
                </View>
                <Text style={styles.label}>Tebal Plat (m):</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={btT} onChangeText={setBtT} />
              </View>
            )}

            <TouchableOpacity style={styles.btnCalculate} onPress={handleCalcBeton}>
              <Ionicons name="calculator" size={18} color="#ffffff" />
              <Text style={styles.btnCalculateText}>Hitung Volume Beton</Text>
            </TouchableOpacity>
          </View>

          {btHasil && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Hasil Perhitungan {btHasil.tipe}:</Text>
              <View style={styles.resRow}>
                <Text style={[styles.resLabel, styles.bold]}>Volume Beton Bersih:</Text>
                <Text style={[styles.resVal, styles.highlightVal]}>
                  {btHasil.volBetonM3 || btHasil.volBalokBersihM3} m³
                </Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resLabel}>Luas Kebutuhan Bekisting:</Text>
                <Text style={styles.resVal}>{btHasil.luasBekistingM2} m²</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actBtn, styles.saveBtn, saved && styles.savedBtn]}
                  onPress={() =>
                    handleSave(
                      `Beton ${btHasil.tipe}`,
                      `Beton: ${btHasil.volBetonM3 || btHasil.volBalokBersihM3} m³ | Bekisting: ${btHasil.luasBekistingM2} m²`,
                      btHasil
                    )
                  }
                  disabled={saved}
                >
                  <Ionicons name={saved ? 'checkmark-done' : 'bookmark'} size={16} color="#fff" />
                  <Text style={styles.actBtnText}>{saved ? 'Tersimpan' : 'Simpan'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actBtn, styles.shareBtn]}
                  onPress={() =>
                    handleShare(
                      `*Hasil Hitung Beton ${btHasil.tipe}*\n` +
                      `• Volume Beton: ${btHasil.volBetonM3 || btHasil.volBalokBersihM3} m³\n` +
                      `• Bekisting: ${btHasil.luasBekistingM2} m²`
                    )
                  }
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                  <Text style={styles.actBtnText}>Bagikan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#ffffff' },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: colors.primary },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: colors.textMuted, marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 4 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    color: colors.text,
  },
  formRow: { flexDirection: 'row', gap: 10 },
  formCol: { flex: 1 },
  subTypeRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  subTypeBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  subTypeBtnActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  subTypeText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  subTypeTextActive: { color: colors.primaryDark },
  btnCalculate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  btnCalculateText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  resultBox: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
    elevation: 2,
  },
  resultTitle: { fontSize: 15, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 10 },
  resRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  resLabel: { fontSize: 13, color: colors.textMuted },
  resVal: { fontSize: 13, fontWeight: '700', color: colors.text },
  bold: { fontWeight: '700', color: colors.text },
  highlightVal: { color: colors.primary, fontSize: 15 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  saveBtn: { backgroundColor: colors.secondary },
  savedBtn: { backgroundColor: '#94a3b8' },
  shareBtn: { backgroundColor: '#10b981' },
  actBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
