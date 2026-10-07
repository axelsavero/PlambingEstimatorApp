import React from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_BALOK,
  hitungBalok,
} from '../utils/constructionCalculations';
import { saveSheetInputs } from '../utils/rabStorage';
import useSheetInputs from '../utils/useSheetInputs';

export default function BalokScreen() {
  const [inputs, setInputs] = useSheetInputs('balok', DEFAULT_BALOK);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleResetField = (field) => {
    handleChange(field, DEFAULT_BALOK[field]);
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
        { fieldKey: 'panjangBalok', label: 'Panjang Balok', symbol: 'P', value: inputs.panjangBalok, onChange: (v) => handleChange('panjangBalok', v), unit: 'm' },
        { fieldKey: 'lebarBalok', label: 'Lebar Balok', symbol: 'b', value: inputs.lebarBalok, onChange: (v) => handleChange('lebarBalok', v), unit: 'm' },
        { fieldKey: 'tinggiBalok', label: 'Tinggi Balok', symbol: 'h', value: inputs.tinggiBalok, onChange: (v) => handleChange('tinggiBalok', v), unit: 'm' },
        { fieldKey: 'jumlahBalok', label: 'Jumlah Balok', symbol: 'N', value: inputs.jumlahBalok, onChange: (v) => handleChange('jumlahBalok', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Pembesian Balok',
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
        { fieldKey: 'hargaPaku12cm', label: 'Paku 12 cm', value: inputs.hargaPaku12cm, onChange: (v) => handleChange('hargaPaku12cm', v), unit: 'Rp/kg' },
        { fieldKey: 'hargaMinyakBekisting', label: 'Minyak Bekisting', value: inputs.hargaMinyakBekisting, onChange: (v) => handleChange('hargaMinyakBekisting', v), unit: 'Rp/liter' },
        { fieldKey: 'hargaKayuBalokII', label: 'Kayu Balok 6/12 Kelas II', value: inputs.hargaKayuBalokII, onChange: (v) => handleChange('hargaKayuBalokII', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaPlywood12mm', label: 'Plywood 12 mm', value: inputs.hargaPlywood12mm, onChange: (v) => handleChange('hargaPlywood12mm', v), unit: 'Rp/lbr' },
        { fieldKey: 'hargaDolken', label: 'Dolken Kayu φ 8-10', value: inputs.hargaDolken, onChange: (v) => handleChange('hargaDolken', v), unit: 'Rp/btg' },
        { fieldKey: 'hargaSemen', label: 'Semen Portland (PC)', value: inputs.hargaSemen, onChange: (v) => handleChange('hargaSemen', v), unit: 'Rp/sak' },
        { fieldKey: 'hargaPasirBeton', label: 'Pasir Beton', value: inputs.hargaPasirBeton, onChange: (v) => handleChange('hargaPasirBeton', v), unit: 'Rp/m³' },
        { fieldKey: 'hargaBatuSplit', label: 'Batu Split 2/3', value: inputs.hargaBatuSplit, onChange: (v) => handleChange('hargaBatuSplit', v), unit: 'Rp/m³' },
      ],
    },
  ];

  return (
    <LandscapeCalculatorLayout
      title="Struktur Balok Beton"
      subtitle="Sheet 6: Besi Tulangan 1 & 2, Sengkang Tumpuan/Lapangan, Bekisting & Cor"
      iconName="cube-outline"
      diagramSource={require('../../assets/diagrams/balok.png')}
      diagramTitle="Gambar Panduan Geometri & Penulangan Balok Beton"
      inputSections={inputSections}
      results={results}
      defaultInputs={DEFAULT_BALOK}
      currentInputs={inputs}
      onResetField={handleResetField}
      onReset={handleReset}
    />
  );
}
