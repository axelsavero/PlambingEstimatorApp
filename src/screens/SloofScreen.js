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

  const handleResetField = (field) => {
    handleChange(field, DEFAULT_SLOOF[field]);
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
        { fieldKey: 'panjangSloof', label: 'Panjang Sloof', symbol: 'P', value: inputs.panjangSloof, onChange: (v) => handleChange('panjangSloof', v), unit: 'm' },
        { fieldKey: 'lebarSloof', label: 'Lebar Sloof', symbol: 'b', value: inputs.lebarSloof, onChange: (v) => handleChange('lebarSloof', v), unit: 'm' },
        { fieldKey: 'tinggiSloof', label: 'Tinggi Sloof', symbol: 'h', value: inputs.tinggiSloof, onChange: (v) => handleChange('tinggiSloof', v), unit: 'm' },
        { fieldKey: 'jumlahSloof', label: 'Jumlah Sloof', symbol: 'N', value: inputs.jumlahSloof, onChange: (v) => handleChange('jumlahSloof', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Pembesian Sloof',
      icon: 'construct-outline',
      fields: [
        { fieldKey: 'diaTul1', label: 'Besi Tulangan 1, Ø', value: inputs.diaTul1, onChange: (v) => handleChange('diaTul1', v), unit: 'mm' },
        { fieldKey: 'jmlTul1', label: 'Jumlah Tulangan 1', value: inputs.jmlTul1, onChange: (v) => handleChange('jmlTul1', v), unit: 'bh' },
        { fieldKey: 'diaTul2', label: 'Besi Tulangan 2, Ø', value: inputs.diaTul2, onChange: (v) => handleChange('diaTul2', v), unit: 'mm' },
        { fieldKey: 'jmlTul2', label: 'Jumlah Tulangan 2', value: inputs.jmlTul2, onChange: (v) => handleChange('jmlTul2', v), unit: 'bh' },
        { fieldKey: 'diaSengkang', label: 'Besi Sengkang, Ø', value: inputs.diaSengkang, onChange: (v) => handleChange('diaSengkang', v), unit: 'mm' },
        { fieldKey: 'jarakSengkangTumpuan', label: 'Jarak Sengkang Tumpuan', value: inputs.jarakSengkangTumpuan, onChange: (v) => handleChange('jarakSengkangTumpuan', v), unit: 'cm' },
        { fieldKey: 'jarakSengkangLapangan', label: 'Jarak Sengkang Lapangan', value: inputs.jarakSengkangLapangan, onChange: (v) => handleChange('jarakSengkangLapangan', v), unit: 'cm' },
        { fieldKey: 'selimutBeton', label: 'Tebal Selimut Beton', symbol: 's', value: inputs.selimutBeton, onChange: (v) => handleChange('selimutBeton', v), unit: 'cm' },
        { fieldKey: 'diaKawat', label: 'Kawat Beton, Ø', value: inputs.diaKawat, onChange: (v) => handleChange('diaKawat', v), unit: 'mm' },
        { fieldKey: 'panjangKawatIkat', label: 'Panjang Kawat Ikat', value: inputs.panjangKawatIkat, onChange: (v) => handleChange('panjangKawatIkat', v), unit: 'm' },
      ],
    },
    {
      title: 'Harga Satuan Upah Tenaga Kerja',
      icon: 'people-outline',
      fields: [
        { fieldKey: 'hargaPekerja', label: 'Upah Pekerja', value: inputs.hargaPekerja, onChange: (v) => handleChange('hargaPekerja', v), unit: 'Rp/OH' },
        { fieldKey: 'hargaTukang', label: 'Upah Tukang', value: inputs.hargaTukang, onChange: (v) => handleChange('hargaTukang', v), unit: 'Rp/OH' },
        { fieldKey: 'hargaKepalaTukang', label: 'Upah Kepala Tukang', value: inputs.hargaKepalaTukang, onChange: (v) => handleChange('hargaKepalaTukang', v), unit: 'Rp/OH' },
        { fieldKey: 'hargaMandor', label: 'Upah Mandor', value: inputs.hargaMandor, onChange: (v) => handleChange('hargaMandor', v), unit: 'Rp/OH' },
      ],
    },
    {
      title: 'Harga Satuan Bahan & Material',
      icon: 'pricetags-outline',
      fields: [
        { fieldKey: 'hargaBesiTul1', label: `Besi Ø ${inputs.diaTul1} mm (12m)`, value: inputs.hargaBesiTul1, onChange: (v) => handleChange('hargaBesiTul1', v), unit: 'Rp/btg' },
        { fieldKey: 'hargaBesiTul2', label: `Besi Ø ${inputs.diaTul2} mm (12m)`, value: inputs.hargaBesiTul2, onChange: (v) => handleChange('hargaBesiTul2', v), unit: 'Rp/btg' },
        { fieldKey: 'hargaBesiSengkang', label: `Besi Sengkang Ø ${inputs.diaSengkang} mm`, value: inputs.hargaBesiSengkang, onChange: (v) => handleChange('hargaBesiSengkang', v), unit: 'Rp/btg' },
        { fieldKey: 'hargaKawatBeton', label: 'Kawat Beton', value: inputs.hargaKawatBeton, onChange: (v) => handleChange('hargaKawatBeton', v), unit: 'Rp/kg' },
        { fieldKey: 'hargaKayuPapanIII', label: 'Kayu Papan Kelas III', value: inputs.hargaKayuPapanIII, onChange: (v) => handleChange('hargaKayuPapanIII', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaPaku4inch', label: 'Paku 4 inch', value: inputs.hargaPaku4inch, onChange: (v) => handleChange('hargaPaku4inch', v), unit: 'Rp/kg' },
        { fieldKey: 'hargaMinyakBekisting', label: 'Minyak Bekisting', value: inputs.hargaMinyakBekisting, onChange: (v) => handleChange('hargaMinyakBekisting', v), unit: 'Rp/liter' },
        { fieldKey: 'hargaSemen', label: 'Semen Portland (PC)', value: inputs.hargaSemen, onChange: (v) => handleChange('hargaSemen', v), unit: 'Rp/sak' },
        { fieldKey: 'hargaPasirBeton', label: 'Pasir Beton', value: inputs.hargaPasirBeton, onChange: (v) => handleChange('hargaPasirBeton', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaBatuSplit', label: 'Batu Split 2/3', value: inputs.hargaBatuSplit, onChange: (v) => handleChange('hargaBatuSplit', v), unit: 'Rp/m³' },
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
      defaultInputs={DEFAULT_SLOOF}
      currentInputs={inputs}
      onResetField={handleResetField}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
