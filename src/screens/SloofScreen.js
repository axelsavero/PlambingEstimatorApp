import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_SLOOF,
  hitungSloof,
} from '../utils/constructionCalculations';
import { getProjectInputs, saveSheetInputs } from '../utils/rabStorage';

export default function SloofScreen() {
  const [inputs, setInputs] = useState(DEFAULT_SLOOF);

  useEffect(() => {
    (async () => {
      const stored = await getProjectInputs();
      if (stored?.sloof) {
        setInputs({ ...DEFAULT_SLOOF, ...stored.sloof });
      }
    })();
  }, []);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    await saveSheetInputs('sloof', inputs);
    Alert.alert('Berhasil', 'Estimasi Struktur Sloof Beton telah disimpan ke Rekap RAB.');
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Sloof ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_SLOOF);
            await saveSheetInputs('sloof', DEFAULT_SLOOF);
          },
        },
      ]
    );
  };

  const results = hitungSloof(inputs);

  const inputSections = [
    {
      title: '4.1 Dimensi Utama Sloof Beton',
      icon: 'remove-outline',
      fields: [
        { label: 'Panjang Sloof', symbol: 'P', value: inputs.panjangSloof, onChange: (v) => handleChange('panjangSloof', v), unit: 'm' },
        { label: 'Lebar Sloof', symbol: 'b', value: inputs.lebarSloof, onChange: (v) => handleChange('lebarSloof', v), unit: 'm' },
        { label: 'Tinggi Sloof', symbol: 'h', value: inputs.tinggiSloof, onChange: (v) => handleChange('tinggiSloof', v), unit: 'm' },
        { label: 'Jumlah Sloof', symbol: 'N', value: inputs.jumlahSloof, onChange: (v) => handleChange('jumlahSloof', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Pembesian Sloof',
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
        { label: 'Kayu Papan Kelas III', value: inputs.hargaKayuPapanIII, onChange: (v) => handleChange('hargaKayuPapanIII', v), unit: 'Rp/m³' },
        { label: 'Paku 4 inch', value: inputs.hargaPaku4inch, onChange: (v) => handleChange('hargaPaku4inch', v), unit: 'Rp/kg' },
        { label: 'Minyak Bekisting', value: inputs.hargaMinyakBekisting, onChange: (v) => handleChange('hargaMinyakBekisting', v), unit: 'Rp/liter' },
        { label: 'Semen Portland (PC)', value: inputs.hargaSemen, onChange: (v) => handleChange('hargaSemen', v), unit: 'Rp/sak' },
        { label: 'Pasir Beton', value: inputs.hargaPasirBeton, onChange: (v) => handleChange('hargaPasirBeton', v), unit: 'Rp/m³' },
        { label: 'Batu Split 2/3', value: inputs.hargaBatuSplit, onChange: (v) => handleChange('hargaBatuSplit', v), unit: 'Rp/m³' },
      ],
    },
  ];

  return (
    <LandscapeCalculatorLayout
      title="Pekerjaan Struktur Sloof Beton"
      subtitle="Sheet 4: Pembesian Sengkang Tumpuan/Lapangan, Bekisting & Beton K-275"
      iconName="remove-outline"
      diagramSource={require('../../assets/diagrams/sloof.png')}
      diagramTitle="Gambar Panduan Penulangan & Geometri Sloof Beton"
      inputSections={inputSections}
      results={results}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
