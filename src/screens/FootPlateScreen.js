import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_FOOTPLATE,
  hitungFootPlate,
} from '../utils/constructionCalculations';
import { getProjectInputs, saveSheetInputs } from '../utils/rabStorage';

export default function FootPlateScreen() {
  const [inputs, setInputs] = useState(DEFAULT_FOOTPLATE);

  useEffect(() => {
    (async () => {
      const stored = await getProjectInputs();
      if (stored?.footplate) {
        setInputs({ ...DEFAULT_FOOTPLATE, ...stored.footplate });
      }
    })();
  }, []);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    await saveSheetInputs('footplate', inputs);
    Alert.alert('Berhasil', 'Estimasi Foot Plate telah disimpan ke Rekap RAB.');
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Foot Plate ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_FOOTPLATE);
            await saveSheetInputs('footplate', DEFAULT_FOOTPLATE);
          },
        },
      ]
    );
  };

  const results = hitungFootPlate(inputs);

  const inputSections = [
    {
      title: '3.1 Dimensi Utama & Geometri Foot Plate',
      icon: 'cube-outline',
      fields: [
        { label: 'Lebar Kolom 1', symbol: 'a1', value: inputs.lebarKolom1, onChange: (v) => handleChange('lebarKolom1', v), unit: 'm' },
        { label: 'Lebar Kolom 2', symbol: 'a2', value: inputs.lebarKolom2, onChange: (v) => handleChange('lebarKolom2', v), unit: 'm' },
        { label: 'Lebar Tapak 1', symbol: 'b1', value: inputs.lebarTapak1, onChange: (v) => handleChange('lebarTapak1', v), unit: 'm' },
        { label: 'Lebar Tapak 2', symbol: 'b2', value: inputs.lebarTapak2, onChange: (v) => handleChange('lebarTapak2', v), unit: 'm' },
        { label: 'Tinggi Kolom Pedestal', symbol: 'h1', value: inputs.tinggiKolom, onChange: (v) => handleChange('tinggiKolom', v), unit: 'm' },
        { label: 'Kemiringan Tapak (Limas)', symbol: 'h2', value: inputs.kemiringanTapak, onChange: (v) => handleChange('kemiringanTapak', v), unit: 'm' },
        { label: 'Tinggi Tapak Bawah', symbol: 'h3', value: inputs.tinggiTapak, onChange: (v) => handleChange('tinggiTapak', v), unit: 'm' },
        { label: 'Tebal Lantai Kerja', symbol: 'h4', value: inputs.tinggiLantaiKerja, onChange: (v) => handleChange('tinggiLantaiKerja', v), unit: 'm' },
        { label: 'Tebal Urugan Pasir', symbol: 'h5', value: inputs.tinggiPasirUruk, onChange: (v) => handleChange('tinggiPasirUruk', v), unit: 'm' },
        { label: 'Jumlah Pondasi Tapak', symbol: 'N', value: inputs.jumlahTapak, onChange: (v) => handleChange('jumlahTapak', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Besi Tulangan Kolom & Tapak',
      icon: 'construct-outline',
      fields: [
        { label: 'Besi Utama, Ø', symbol: 'd1', value: inputs.diaUtama, onChange: (v) => handleChange('diaUtama', v), unit: 'mm' },
        { label: 'Jumlah Besi Utama', symbol: 'n1', value: inputs.jmlBesiUtama, onChange: (v) => handleChange('jmlBesiUtama', v), unit: 'bh' },
        { label: 'Besi Support, Ø', symbol: 'd2', value: inputs.diaSupport, onChange: (v) => handleChange('diaSupport', v), unit: 'mm' },
        { label: 'Jumlah Besi Support', symbol: 'n2', value: inputs.jmlBesiSupport, onChange: (v) => handleChange('jmlBesiSupport', v), unit: 'bh' },
        { label: 'Besi Sengkang, Ø', symbol: 'd3', value: inputs.diaSengkang, onChange: (v) => handleChange('diaSengkang', v), unit: 'mm' },
        { label: 'Jarak Sengkang', symbol: 'r1', value: inputs.jarakSengkang, onChange: (v) => handleChange('jarakSengkang', v), unit: 'm' },
        { label: 'Besi Alas (merah), Ø', symbol: 'd4', value: inputs.diaAlas, onChange: (v) => handleChange('diaAlas', v), unit: 'mm' },
        { label: 'Besi Pembentuk (hijau), Ø', symbol: 'd5', value: inputs.diaPembentuk, onChange: (v) => handleChange('diaPembentuk', v), unit: 'mm' },
        { label: 'Besi Kait (kuning), Ø', symbol: 'd6', value: inputs.diaKait, onChange: (v) => handleChange('diaKait', v), unit: 'mm' },
        { label: 'Jarak Tulangan Tapak', symbol: 'r2', value: inputs.jarakTulangan, onChange: (v) => handleChange('jarakTulangan', v), unit: 'm' },
        { label: 'Selimut Beton', symbol: 's', value: inputs.selimutBeton, onChange: (v) => handleChange('selimutBeton', v), unit: 'm' },
        { label: 'Kawat Beton, Ø', value: inputs.diaKawat, onChange: (v) => handleChange('diaKawat', v), unit: 'mm' },
        { label: 'Panjang Kawat Ikat', value: inputs.panjangKawatIkat, onChange: (v) => handleChange('panjangKawatIkat', v), unit: 'm' },
      ],
    },
    {
      title: 'Harga Satuan Upah Tenaga Kerja',
      icon: 'people-outline',
      fields: [
        { label: 'Upah Pekerja', value: inputs.hargaPekerja, onChange: (v) => handleChange('hargaPekerja', v), unit: 'Rp/OH' },
        { label: 'Upah Tukang', value: inputs.hargaTukang, onChange: (v) => handleChange('hargaTukang', v), unit: 'Rp/OH' },
        { label: 'Upah Kepala Tukang', value: inputs.hargaKepalaTukang, onChange: (v) => handleChange('hargaKepalaTukang', v), unit: 'Rp/OH' },
        { label: 'Upah Mandor', value: inputs.hargaMandor, onChange: (v) => handleChange('hargaMandor', v), unit: 'Rp/OH' },
      ],
    },
    {
      title: 'Harga Satuan Bahan & Material',
      icon: 'pricetags-outline',
      fields: [
        { label: 'Besi Ø 16 mm (12m)', value: inputs.hargaBesiUtama, onChange: (v) => handleChange('hargaBesiUtama', v), unit: 'Rp/btg' },
        { label: 'Besi Ø 13 mm (12m)', value: inputs.hargaBesiAlas, onChange: (v) => handleChange('hargaBesiAlas', v), unit: 'Rp/btg' },
        { label: 'Besi Ø 10 mm (12m)', value: inputs.hargaBesiSengkang, onChange: (v) => handleChange('hargaBesiSengkang', v), unit: 'Rp/btg' },
        { label: 'Kawat Beton', value: inputs.hargaKawatBeton, onChange: (v) => handleChange('hargaKawatBeton', v), unit: 'Rp/kg' },
        { label: 'Kayu Papan Kelas III', value: inputs.hargaKayuPapanIII, onChange: (v) => handleChange('hargaKayuPapanIII', v), unit: 'Rp/m³' },
        { label: 'Kayu Balok 6/12 Kelas II', value: inputs.hargaKayuBalokII, onChange: (v) => handleChange('hargaKayuBalokII', v), unit: 'Rp/m³' },
        { label: 'Plywood 12 mm', value: inputs.hargaPlywood12mm, onChange: (v) => handleChange('hargaPlywood12mm', v), unit: 'Rp/lbr' },
        { label: 'Dolken Kayu φ 8-10', value: inputs.hargaDolken, onChange: (v) => handleChange('hargaDolken', v), unit: 'Rp/btg' },
        { label: 'Semen Portland (50kg)', value: inputs.hargaSemen, onChange: (v) => handleChange('hargaSemen', v), unit: 'Rp/sak' },
        { label: 'Pasir Beton', value: inputs.hargaPasirBeton, onChange: (v) => handleChange('hargaPasirBeton', v), unit: 'Rp/m³' },
        { label: 'Batu Split 2/3', value: inputs.hargaBatuSplit, onChange: (v) => handleChange('hargaBatuSplit', v), unit: 'Rp/m³' },
        { label: 'Pasir Uruk Dasar', value: inputs.hargaPasirUruk, onChange: (v) => handleChange('hargaPasirUruk', v), unit: 'Rp/m³' },
      ],
    },
  ];

  return (
    <LandscapeCalculatorLayout
      title="Pekerjaan Pondasi Tapak Beton (Foot Plate)"
      subtitle="Sheet 3: Pembesian 6 Tipe Tulangan, Bekisting & Pengecoran K-300"
      iconName="grid-outline"
      diagramSource={require('../../assets/diagrams/footplate.png')}
      diagramTitle="Gambar Panduan Geometri & Penulangan Foot Plate"
      inputSections={inputSections}
      results={results}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
