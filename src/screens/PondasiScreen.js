import React from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_PONDASI,
  hitungPondasi,
} from '../utils/constructionCalculations';
import { saveSheetInputs } from '../utils/rabStorage';
import useSheetInputs from '../utils/useSheetInputs';

export default function PondasiScreen() {
  const [inputs, setInputs] = useSheetInputs('pondasi', DEFAULT_PONDASI);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleResetField = (field) => {
    handleChange(field, DEFAULT_PONDASI[field]);
  };

  const handleToggle = (field) => {
    setInputs((prev) => {
      if (field === 'campuran1_3') {
        return { ...prev, campuran1_3: 1, campuran1_4: 0 };
      } else {
        return { ...prev, campuran1_3: 0, campuran1_4: 1 };
      }
    });
  };

  const handleReset = () => {
    Alert.alert(
      'Konfirmasi Reset',
      'Kembalikan seluruh parameter Pondasi ke nilai standar Excel?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setInputs(DEFAULT_PONDASI);
            await saveSheetInputs('pondasi', DEFAULT_PONDASI);
          },
        },
      ]
    );
  };

  const results = hitungPondasi(inputs);

  const inputSections = [
    {
      title: '2.1 Dimensi Utama Galian & Pondasi',
      icon: 'resize-outline',
      fields: [
        { fieldKey: 'lebarAtasGalian', label: 'Lebar Atas Galian', symbol: 'a.1', value: inputs.lebarAtasGalian, onChange: (v) => handleChange('lebarAtasGalian', v), unit: 'm' },
        { fieldKey: 'lebarBawahGalian', label: 'Lebar Bawah Galian', symbol: 'b.1', value: inputs.lebarBawahGalian, onChange: (v) => handleChange('lebarBawahGalian', v), unit: 'm' },
        { fieldKey: 'dalamGalian', label: 'Kedalaman Galian', symbol: 'c.1', value: inputs.dalamGalian, onChange: (v) => handleChange('dalamGalian', v), unit: 'm' },
        { fieldKey: 'panjangPondasi', label: 'Panjang Pondasi', symbol: 'P', value: inputs.panjangPondasi, onChange: (v) => handleChange('panjangPondasi', v), unit: 'm' },
        { fieldKey: 'lebarAtasPondasi', label: 'Lebar Atas Pondasi', symbol: 'a.2', value: inputs.lebarAtasPondasi, onChange: (v) => handleChange('lebarAtasPondasi', v), unit: 'm' },
        { fieldKey: 'lebarBawahPondasi', label: 'Lebar Bawah Pondasi', symbol: 'b.2', value: inputs.lebarBawahPondasi, onChange: (v) => handleChange('lebarBawahPondasi', v), unit: 'm' },
        { fieldKey: 'tinggiPondasi', label: 'Tinggi Pasangan Pondasi', symbol: 'c.2', value: inputs.tinggiPondasi, onChange: (v) => handleChange('tinggiPondasi', v), unit: 'm' },
        { fieldKey: 'tinggiBatuKosong', label: 'Tinggi Batu Kosong', symbol: 'd', value: inputs.tinggiBatuKosong, onChange: (v) => handleChange('tinggiBatuKosong', v), unit: 'm' },
        { fieldKey: 'tinggiPasirUruk', label: 'Tebal Pasir Uruk', symbol: 'e', value: inputs.tinggiPasirUruk, onChange: (v) => handleChange('tinggiPasirUruk', v), unit: 'm' },
      ],
    },
    {
      title: 'Dimensi Pekerjaan Urukan',
      icon: 'layers-outline',
      fields: [
        { fieldKey: 'panjangBangunan', label: 'Panjang Bangunan', value: inputs.panjangBangunan, onChange: (v) => handleChange('panjangBangunan', v), unit: 'm' },
        { fieldKey: 'lebarBangunan', label: 'Lebar Bangunan', value: inputs.lebarBangunan, onChange: (v) => handleChange('lebarBangunan', v), unit: 'm' },
        { fieldKey: 'tebalUrukanLantai', label: 'Tebal Urukan Lantai', symbol: 'f', value: inputs.tebalUrukanLantai, onChange: (v) => handleChange('tebalUrukanLantai', v), unit: 'm' },
        { fieldKey: 'persenUrukanSamping', label: 'Urukan Samping Pondasi', value: inputs.persenUrukanSamping, onChange: (v) => handleChange('persenUrukanSamping', v), unit: '%' },
      ],
    },
    {
      title: 'Pilihan Campuran Mortar Pasangan',
      icon: 'flask-outline',
      subtitle: 'Pilih jenis spesi mortar standar AHSP:',
      toggles: [
        {
          label: 'Campuran 1SP : 3PP (Tipe S 12,5 MPa)',
          active: inputs.campuran1_3 === 1,
          isModified: inputs.campuran1_3 !== DEFAULT_PONDASI.campuran1_3,
          onPress: () => handleToggle('campuran1_3'),
        },
        {
          label: 'Campuran 1SP : 4PP (Tipe N 5,2 MPa)',
          active: inputs.campuran1_4 === 1,
          isModified: inputs.campuran1_4 !== DEFAULT_PONDASI.campuran1_4,
          onPress: () => handleToggle('campuran1_4'),
        },
      ],
      fields: [],
    },
    {
      title: '2.3 Harga Satuan Upah Tenaga Kerja',
      icon: 'people-outline',
      fields: [
        { fieldKey: 'hargaPekerja', label: 'Upah Pekerja', value: inputs.hargaPekerja, onChange: (v) => handleChange('hargaPekerja', v), unit: 'Rp/OH' },
        { fieldKey: 'hargaTukang', label: 'Upah Tukang Batu', value: inputs.hargaTukang, onChange: (v) => handleChange('hargaTukang', v), unit: 'Rp/OH' },
        { fieldKey: 'hargaKepalaTukang', label: 'Upah Kepala Tukang', value: inputs.hargaKepalaTukang, onChange: (v) => handleChange('hargaKepalaTukang', v), unit: 'Rp/OH' },
        { fieldKey: 'hargaMandor', label: 'Upah Mandor', value: inputs.hargaMandor, onChange: (v) => handleChange('hargaMandor', v), unit: 'Rp/OH' },
      ],
    },
    {
      title: 'Harga Satuan Bahan & Material',
      icon: 'cube-outline',
      fields: [
        { fieldKey: 'hargaPasirUruk', label: 'Pasir Uruk', value: inputs.hargaPasirUruk, onChange: (v) => handleChange('hargaPasirUruk', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaTanahUruk', label: 'Tanah Uruk Biasa', value: inputs.hargaTanahUruk, onChange: (v) => handleChange('hargaTanahUruk', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaBatuAnstamping', label: 'Batu Belah Aanstamping', value: inputs.hargaBatuAnstamping, onChange: (v) => handleChange('hargaBatuAnstamping', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaBatuPondasi', label: 'Batu Belah Pondasi', value: inputs.hargaBatuPondasi, onChange: (v) => handleChange('hargaBatuPondasi', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaSemen', label: 'Semen Portland (50kg)', value: inputs.hargaSemen, onChange: (v) => handleChange('hargaSemen', v), unit: 'Rp/sak' },
        { fieldKey: 'hargaPasirPasang', label: 'Pasir Pasang', value: inputs.hargaPasirPasang, onChange: (v) => handleChange('hargaPasirPasang', v), unit: 'Rp/m³' },
      ],
    },
  ];

  return (
    <LandscapeCalculatorLayout
      title="Pondasi Batu Belah"
      subtitle="Sheet 2: Galian, Aanstamping, Mortar Pasangan & Urukan"
      iconName="layers"
      diagramSource={require('../../assets/diagrams/pondasi.png')}
      diagramTitle="Gambar Panduan Pondasi Batu Belah & Galian"
      inputSections={inputSections}
      results={results}
      defaultInputs={DEFAULT_PONDASI}
      currentInputs={inputs}
      onResetField={handleResetField}
      onReset={handleReset}
    />
  );
}
