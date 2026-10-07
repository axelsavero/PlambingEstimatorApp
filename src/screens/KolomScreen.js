import React from 'react';
import { Alert } from 'react-native';
import LandscapeCalculatorLayout from '../components/LandscapeCalculatorLayout';
import {
  DEFAULT_KOLOM,
  hitungKolom,
} from '../utils/constructionCalculations';
import { saveSheetInputs } from '../utils/rabStorage';
import useSheetInputs from '../utils/useSheetInputs';

export default function KolomScreen() {
  const [inputs, setInputs] = useSheetInputs('kolom', DEFAULT_KOLOM);

  const handleChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleResetField = (field) => {
    handleChange(field, DEFAULT_KOLOM[field]);
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
        { fieldKey: 'tinggiKolom', label: 'Tinggi Kolom', symbol: 'T', value: inputs.tinggiKolom, onChange: (v) => handleChange('tinggiKolom', v), unit: 'm' },
        { fieldKey: 'lebarKolom', label: 'Lebar Kolom', symbol: 'L', value: inputs.lebarKolom, onChange: (v) => handleChange('lebarKolom', v), unit: 'm' },
        { fieldKey: 'panjangKolom', label: 'Panjang Kolom', symbol: 'P', value: inputs.panjangKolom, onChange: (v) => handleChange('panjangKolom', v), unit: 'm' },
        { fieldKey: 'jumlahKolom', label: 'Jumlah Kolom', symbol: 'N', value: inputs.jumlahKolom, onChange: (v) => handleChange('jumlahKolom', v), unit: 'unit' },
      ],
    },
    {
      title: 'Spesifikasi Pembesian Kolom',
      icon: 'construct-outline',
      fields: [
        { fieldKey: 'diaUtama', label: 'Besi Utama (D1), Ø', value: inputs.diaUtama, onChange: (v) => handleChange('diaUtama', v), unit: 'mm' },
        { fieldKey: 'jmlUtama', label: 'Jumlah Besi Utama', value: inputs.jmlUtama, onChange: (v) => handleChange('jmlUtama', v), unit: 'bh' },
        { fieldKey: 'diaSupport', label: 'Besi Support (D2), Ø', value: inputs.diaSupport, onChange: (v) => handleChange('diaSupport', v), unit: 'mm' },
        { fieldKey: 'jmlSupport', label: 'Jumlah Besi Support', value: inputs.jmlSupport, onChange: (v) => handleChange('jmlSupport', v), unit: 'bh' },
        { fieldKey: 'diaSengkang', label: 'Besi Sengkang, Ø', value: inputs.diaSengkang, onChange: (v) => handleChange('diaSengkang', v), unit: 'mm' },
        { fieldKey: 'jarakSengkang', label: 'Jarak Sengkang Kolom', value: inputs.jarakSengkang, onChange: (v) => handleChange('jarakSengkang', v), unit: 'cm' },
        { fieldKey: 'selimutBeton', label: 'Tebal Selimut Beton', symbol: 'S', value: inputs.selimutBeton, onChange: (v) => handleChange('selimutBeton', v), unit: 'cm' },
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
        { fieldKey: 'hargaBesiUtama', label: `Besi Utama Ø ${inputs.diaUtama} mm (12m)`, value: inputs.hargaBesiUtama, onChange: (v) => handleChange('hargaBesiUtama', v), unit: 'Rp/btg' },
        { fieldKey: 'hargaBesiSupport', label: `Besi Support Ø ${inputs.diaSupport} mm (12m)`, value: inputs.hargaBesiSupport, onChange: (v) => handleChange('hargaBesiSupport', v), unit: 'Rp/btg' },
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
      title="Struktur Kolom Beton"
      subtitle="Sheet 5: Besi Utama, Support & Sengkang, Bekisting & Cor Beton"
      iconName="business-outline"
      diagramSource={require('../../assets/diagrams/kolom.png')}
      diagramTitle="Gambar Panduan Geometri & Penulangan Kolom Beton"
      inputSections={inputSections}
      results={results}
      defaultInputs={DEFAULT_KOLOM}
      currentInputs={inputs}
      onResetField={handleResetField}
      onReset={handleReset}
    />
  );
}
