import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_ATAP_PELANA,
  hitungAtapPelana,
} from '../utils/constructionCalculations';
import { getProjectInputs, saveSheetInputs, saveRoofChoice } from '../utils/rabStorage';

export default function AtapPelanaScreen() {
  const [inputs, setInputs] = useState(DEFAULT_ATAP_PELANA);

  useEffect(() => {
    (async () => {
      const stored = await getProjectInputs();
      if (stored?.atap_pelana) {
        setInputs({ ...DEFAULT_ATAP_PELANA, ...stored.atap_pelana });
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
    await saveSheetInputs('atap_pelana', inputs);
    await saveRoofChoice('pelana');
    Alert.alert(
      'Berhasil',
      'Estimasi Atap Pelana Baja Ringan disimpan dan diaktifkan di Rekap RAB!'
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Atap Pelana ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_ATAP_PELANA);
            await saveSheetInputs('atap_pelana', DEFAULT_ATAP_PELANA);
          },
        },
      ]
    );
  };

  const results = hitungAtapPelana(inputs);

  const inputSections = [
    {
      title: '11.1 Dimensi Utama & Geometri Bangunan',
      icon: 'triangle-outline',
      fields: [
        { label: 'Lebar Bangunan', value: inputs.lebarBangunan, onChange: (v) => handleChange('lebarBangunan', v), unit: 'm' },
        { label: 'Panjang Bangunan', value: inputs.panjangBangunan, onChange: (v) => handleChange('panjangBangunan', v), unit: 'm' },
        { label: 'Tinggi Kuda-Kuda', value: inputs.tinggiKudaKuda, onChange: (v) => handleChange('tinggiKudaKuda', v), unit: 'm' },
        { label: 'Overstek Lebar', value: inputs.overstekLebar, onChange: (v) => handleChange('overstekLebar', v), unit: 'm' },
        { label: 'Overstek Panjang', value: inputs.overstekPanjang, onChange: (v) => handleChange('overstekPanjang', v), unit: 'm' },
        { label: 'Jarak Kuda-Kuda', value: inputs.jarakKudaKuda, onChange: (v) => handleChange('jarakKudaKuda', v), unit: 'm' },
      ],
    },
    {
      title: '11.2 Pilihan Struktur & Reng',
      icon: 'construct-outline',
      fields: [
        { label: 'Luas Efektif Genteng', value: inputs.luasEfektifGenteng, onChange: (v) => handleChange('luasEfektifGenteng', v), unit: 'm²' },
        { label: 'Jarak Antar Reng', value: inputs.jarakReng, onChange: (v) => handleChange('jarakReng', v), unit: 'm' },
        { label: 'Jarak Antar Batang H', value: inputs.jarakH, onChange: (v) => handleChange('jarakH', v), unit: 'm' },
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
      title="Pekerjaan Atap Pelana Baja Ringan"
      subtitle="Sheet 11: Rangka Kuda-Kuda C75, Reng, Genteng Metal Pasir, Nok & Lisplank"
      iconName="triangle-outline"
      diagramSource={require('../../assets/diagrams/atap_pelana.png')}
      diagramTitle="Gambar Panduan Geometri Kuda-Kuda Atap Pelana & Bracing"
      inputSections={inputSections}
      results={results}
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}
