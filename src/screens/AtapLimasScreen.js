import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_ATAP_LIMAS,
  hitungAtapLimas,
} from '../utils/constructionCalculations';
import { getProjectInputs, saveSheetInputs, saveRoofChoice } from '../utils/rabStorage';

export default function AtapLimasScreen() {
  const [inputs, setInputs] = useState(DEFAULT_ATAP_LIMAS);

  useEffect(() => {
    (async () => {
      const stored = await getProjectInputs();
      if (stored?.atap_limas) {
        setInputs({ ...DEFAULT_ATAP_LIMAS, ...stored.atap_limas });
      }
    })();
  }, []);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleToggleLisplank = (size) => {
    setInputs((prev) => ({
      ...prev,
      toggleLisplank30: size === 30 ? 1 : 0,
      toggleLisplank20: size === 20 ? 1 : 0,
    }));
  };

  const handleSave = async () => {
    await saveSheetInputs('atap_limas', inputs);
    await saveRoofChoice('limas');
    Alert.alert(
      'Berhasil',
      'Estimasi Atap Limas Baja Ringan disimpan dan diaktifkan di Rekap RAB!'
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Atap Limas ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_ATAP_LIMAS);
            await saveSheetInputs('atap_limas', DEFAULT_ATAP_LIMAS);
          },
        },
      ]
    );
  };

  const results = hitungAtapLimas(inputs);

  const inputSections = [
    {
      title: '11.A.1 Dimensi Utama & Geometri Bangunan',
      icon: 'diamond-outline',
      fields: [
        { label: 'Lebar Bangunan', value: inputs.lebarBangunan, onChange: (v) => handleChange('lebarBangunan', v), unit: 'm' },
        { label: 'Panjang Bangunan', value: inputs.panjangBangunan, onChange: (v) => handleChange('panjangBangunan', v), unit: 'm' },
        { label: 'Tinggi Kuda-Kuda', value: inputs.tinggiKudaKuda, onChange: (v) => handleChange('tinggiKudaKuda', v), unit: 'm' },
        { label: 'Overstek Lebar', value: inputs.overstekLebar, onChange: (v) => handleChange('overstekLebar', v), unit: 'm' },
        { label: 'Overstek Panjang', value: inputs.overstekPanjang, onChange: (v) => handleChange('overstekPanjang', v), unit: 'm' },
        { label: 'Jml. Atap Trapesium', value: inputs.jmlAtapTrapesium, onChange: (v) => handleChange('jmlAtapTrapesium', v), unit: 'set' },
        { label: 'Jml. Atap Segitiga', value: inputs.jmlAtapSegitiga, onChange: (v) => handleChange('jmlAtapSegitiga', v), unit: 'set' },
        { label: 'Jumlah Jurai', value: inputs.jmlJurai, onChange: (v) => handleChange('jmlJurai', v), unit: 'set' },
      ],
    },
    {
      title: '11.A.2 Pilihan Struktur & Reng Atap Limas',
      icon: 'construct-outline',
      fields: [
        { label: 'Luas Efektif Genteng', value: inputs.luasEfektifGenteng, onChange: (v) => handleChange('luasEfektifGenteng', v), unit: 'm²' },
        { label: 'Jarak Antar Reng', value: inputs.jarakReng, onChange: (v) => handleChange('jarakReng', v), unit: 'm' },
      ],
    },
    {
      title: 'Pilihan Lisplank GRC',
      icon: 'layers-outline',
      subtitle: 'Pilih ukuran lisplank yang digunakan:',
      toggles: [
        { label: 'Lisplank GRC Lebar 30 cm', active: inputs.toggleLisplank30 === 1, onPress: () => handleToggleLisplank(30) },
        { label: 'Lisplank GRC Lebar 20 cm', active: inputs.toggleLisplank20 === 1, onPress: () => handleToggleLisplank(20) },
      ],
      fields: [],
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
        { label: 'Baja Ringan C75 (6m)', value: inputs.hargaC75, onChange: (v) => handleChange('hargaC75', v), unit: 'Rp/btg' },
        { label: 'Reng Baja Ringan (6m)', value: inputs.hargaReng, onChange: (v) => handleChange('hargaReng', v), unit: 'Rp/btg' },
        { label: 'Baut (Screw Driver)', value: inputs.hargaBaut, onChange: (v) => handleChange('hargaBaut', v), unit: 'Rp/bh' },
        { label: 'Dynabolt', value: inputs.hargaDynabolt, onChange: (v) => handleChange('hargaDynabolt', v), unit: 'Rp/bh' },
        { label: `Genteng ${inputs.jenisPenutup}`, value: inputs.hargaPenutup, onChange: (v) => handleChange('hargaPenutup', v), unit: 'Rp/lbr' },
        { label: `Nok ${inputs.jenisPenutup}`, value: inputs.hargaNok, onChange: (v) => handleChange('hargaNok', v), unit: 'Rp/bh' },
        { label: 'Paku 1 inch', value: inputs.hargaPaku1, onChange: (v) => handleChange('hargaPaku1', v), unit: 'Rp/kg' },
        { label: 'Lisplank GRC 30 cm', value: inputs.hargaLisplank30, onChange: (v) => handleChange('hargaLisplank30', v), unit: "Rp/m'" },
        { label: 'Paku 2 inch', value: inputs.hargaPaku2, onChange: (v) => handleChange('hargaPaku2', v), unit: 'Rp/kg' },
      ],
    },
  ];

  return (
    <LandscapeCalculatorLayout
      title="Pekerjaan Atap Limas Baja Ringan"
      subtitle="Sheet 11.A: Geometri Limas, Jurai, Nok, Profil C75, Reng & Penutup"
      iconName="diamond-outline"
      diagramSource={require('../../assets/diagrams/atap_limas.png')}
      diagramTitle="Gambar Panduan Geometri & Jurai Atap Limas"
      inputSections={inputSections}
      results={results}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
