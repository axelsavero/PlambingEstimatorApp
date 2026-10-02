import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_KOLOM,
  hitungKolom,
} from '../utils/constructionCalculations';
import { getProjectInputs, saveSheetInputs } from '../utils/rabStorage';

export default function KolomScreen() {
  const [inputs, setInputs] = useState(DEFAULT_KOLOM);

  useEffect(() => {
    (async () => {
      const stored = await getProjectInputs();
      if (stored?.kolom) {
        setInputs({ ...DEFAULT_KOLOM, ...stored.kolom });
      }
    })();
  }, []);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    await saveSheetInputs('kolom', inputs);
    Alert.alert('Berhasil', 'Estimasi Struktur Kolom Beton telah disimpan ke Rekap RAB.');
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Kolom ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_KOLOM);
            await saveSheetInputs('kolom', DEFAULT_KOLOM);
          },
        },
      ]
    );
  };

  const results = hitungKolom(inputs);

  const inputSections = [
    {
      title: '5.1 Dimensi Utama Kolom Beton',
      icon: 'business-outline',
      fields: [
        { label: 'Tinggi Kolom', symbol: 'T', value: inputs.tinggiKolom, onChange: (v) => handleChange('tinggiKolom', v), unit: 'm' },
        { label: 'Lebar Kolom', symbol: 'L', value: inputs.lebarKolom, onChange: (v) => handleChange('lebarKolom', v), unit: 'm' },
        { label: 'Panjang Kolom', symbol: 'P', value: inputs.panjangKolom, onChange: (v) => handleChange('panjangKolom', v), unit: 'm' },
        { label: 'Jumlah Kolom', symbol: 'N', value: inputs.jumlahKolom, onChange: (v) => handleChange('jumlahKolom', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Pembesian Kolom',
      icon: 'construct-outline',
      fields: [
        { label: 'Besi Utama (D1), Ø', value: inputs.diaUtama, onChange: (v) => handleChange('diaUtama', v), unit: 'mm' },
        { label: 'Jumlah Besi Utama', value: inputs.jmlUtama, onChange: (v) => handleChange('jmlUtama', v), unit: 'bh' },
        { label: 'Besi Support (D2), Ø', value: inputs.diaSupport, onChange: (v) => handleChange('diaSupport', v), unit: 'mm' },
        { label: 'Jumlah Besi Support', value: inputs.jmlSupport, onChange: (v) => handleChange('jmlSupport', v), unit: 'bh' },
        { label: 'Besi Sengkang, Ø', value: inputs.diaSengkang, onChange: (v) => handleChange('diaSengkang', v), unit: 'mm' },
        { label: 'Jarak Sengkang Kolom', value: inputs.jarakSengkang, onChange: (v) => handleChange('jarakSengkang', v), unit: 'cm' },
        { label: 'Tebal Selimut Beton', symbol: 'S', value: inputs.selimutBeton, onChange: (v) => handleChange('selimutBeton', v), unit: 'cm' },
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
        { label: `Besi Utama Ø ${inputs.diaUtama} mm (12m)`, value: inputs.hargaBesiUtama, onChange: (v) => handleChange('hargaBesiUtama', v), unit: 'Rp/btg' },
        { label: `Besi Support Ø ${inputs.diaSupport} mm (12m)`, value: inputs.hargaBesiSupport, onChange: (v) => handleChange('hargaBesiSupport', v), unit: 'Rp/btg' },
        { label: `Besi Sengkang Ø ${inputs.diaSengkang} mm`, value: inputs.hargaBesiSengkang, onChange: (v) => handleChange('hargaBesiSengkang', v), unit: 'Rp/btg' },
        { label: 'Kawat Beton', value: inputs.hargaKawatBeton, onChange: (v) => handleChange('hargaKawatBeton', v), unit: 'Rp/kg' },
        { label: 'Paku 12 cm', value: inputs.hargaPaku12cm, onChange: (v) => handleChange('hargaPaku12cm', v), unit: 'Rp/kg' },
        { label: 'Minyak Bekisting', value: inputs.hargaMinyakBekisting, onChange: (v) => handleChange('hargaMinyakBekisting', v), unit: 'Rp/liter' },
        { label: 'Kayu Balok 6/12 Kelas II', value: inputs.hargaKayuBalokII, onChange: (v) => handleChange('hargaKayuBalokII', v), unit: 'Rp/m³' },
        { label: 'Plywood 12 mm', value: inputs.hargaPlywood12mm, onChange: (v) => handleChange('hargaPlywood12mm', v), unit: 'Rp/lbr' },
        { label: 'Dolken Kayu φ 8-10', value: inputs.hargaDolken, onChange: (v) => handleChange('hargaDolken', v), unit: 'Rp/btg' },
        { label: 'Semen Portland (PC)', value: inputs.hargaSemen, onChange: (v) => handleChange('hargaSemen', v), unit: 'Rp/sak' },
        { label: 'Pasir Beton', value: inputs.hargaPasirBeton, onChange: (v) => handleChange('hargaPasirBeton', v), unit: 'Rp/m³' },
        { label: 'Batu Split 2/3', value: inputs.hargaBatuSplit, onChange: (v) => handleChange('hargaBatuSplit', v), unit: 'Rp/m³' },
      ],
    },
  ];

  return (
    <LandscapeCalculatorLayout
      title="Pekerjaan Struktur Kolom Beton"
      subtitle="Sheet 5: Besi Utama, Support & Sengkang, Bekisting & Cor Beton"
      iconName="business-outline"
      diagramSource={require('../../assets/diagrams/kolom.png')}
      diagramTitle="Gambar Panduan Geometri & Penulangan Kolom Beton"
      inputSections={inputSections}
      results={results}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
