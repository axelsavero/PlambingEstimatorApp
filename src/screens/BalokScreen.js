import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_BALOK,
  hitungBalok,
} from '../utils/constructionCalculations';
import { getProjectInputs, saveSheetInputs } from '../utils/rabStorage';

export default function BalokScreen() {
  const [inputs, setInputs] = useState(DEFAULT_BALOK);

  useEffect(() => {
    (async () => {
      const stored = await getProjectInputs();
      if (stored?.balok) {
        setInputs({ ...DEFAULT_BALOK, ...stored.balok });
      }
    })();
  }, []);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    await saveSheetInputs('balok', inputs);
    Alert.alert('Berhasil', 'Estimasi Struktur Balok Beton telah disimpan ke Rekap RAB.');
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Balok ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_BALOK);
            await saveSheetInputs('balok', DEFAULT_BALOK);
          },
        },
      ]
    );
  };

  const results = hitungBalok(inputs);

  const inputSections = [
    {
      title: '6.1 Dimensi Utama Balok Beton',
      icon: 'resize-outline',
      fields: [
        { label: 'Panjang Balok', symbol: 'P', value: inputs.panjangBalok, onChange: (v) => handleChange('panjangBalok', v), unit: 'm' },
        { label: 'Lebar Balok', symbol: 'b', value: inputs.lebarBalok, onChange: (v) => handleChange('lebarBalok', v), unit: 'm' },
        { label: 'Tinggi Balok', symbol: 'h', value: inputs.tinggiBalok, onChange: (v) => handleChange('tinggiBalok', v), unit: 'm' },
        { label: 'Jumlah Balok', symbol: 'N', value: inputs.jumlahBalok, onChange: (v) => handleChange('jumlahBalok', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Pembesian Balok',
      icon: 'construct-outline',
      fields: [
        { label: 'Besi Tulangan 1, Ø', value: inputs.diaTul1, onChange: (v) => handleChange('diaTul1', v), unit: 'mm' },
        { label: 'Jumlah Tulangan 1', value: inputs.jmlTul1, onChange: (v) => handleChange('jmlTul1', v), unit: 'bh' },
        { label: 'Besi Tulangan 2, Ø', value: inputs.diaTul2, onChange: (v) => handleChange('diaTul2', v), unit: 'mm' },
        { label: 'Jumlah Tulangan 2', value: inputs.jmlTul2, onChange: (v) => handleChange('jmlTul2', v), unit: 'bh' },
        { label: 'Besi Sengkang, Ø', value: inputs.diaSengkang, onChange: (v) => handleChange('diaSengkang', v), unit: 'mm' },
        { label: 'Jarak Sengkang Tumpuan', value: inputs.jarakSengkangTumpuan, onChange: (v) => handleChange('jarakSengkangTumpuan', v), unit: 'cm' },
        { label: 'Jarak Sengkang Lapangan', value: inputs.jarakSengkangLapangan, onChange: (v) => handleChange('jarakSengkangLapangan', v), unit: 'cm' },
        { label: 'Tebal Selimut Beton', symbol: 's', value: inputs.selimutBeton, onChange: (v) => handleChange('selimutBeton', v), unit: 'cm' },
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
        { label: `Besi Ø ${inputs.diaTul1} mm (12m)`, value: inputs.hargaBesiTul1, onChange: (v) => handleChange('hargaBesiTul1', v), unit: 'Rp/btg' },
        { label: `Besi Ø ${inputs.diaTul2} mm (12m)`, value: inputs.hargaBesiTul2, onChange: (v) => handleChange('hargaBesiTul2', v), unit: 'Rp/btg' },
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
      title="Pekerjaan Struktur Balok Beton"
      subtitle="Sheet 6: Besi Tulangan 1 & 2, Sengkang Tumpuan/Lapangan, Bekisting & Cor"
      iconName="cube-outline"
      diagramSource={require('../../assets/diagrams/balok.png')}
      diagramTitle="Gambar Panduan Geometri & Penulangan Balok Beton"
      inputSections={inputSections}
      results={results}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
