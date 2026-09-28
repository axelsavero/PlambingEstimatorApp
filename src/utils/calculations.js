// Helper format mata uang Rupiah
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

// 1. Hitung Beda Tinggi / Kemiringan Pipa
export const hitungKemiringanPipa = (panjangMeter, kemiringanPersen) => {
  const L = parseFloat(panjangMeter) || 0;
  const S = parseFloat(kemiringanPersen) || 0;
  // Beda tinggi (cm) = L (m) * S (%)
  const dropCm = L * S;
  return {
    panjangMeter: L,
    kemiringanPersen: S,
    bedaTinggiCm: dropCm.toFixed(1),
  };
};

// 2. Hitung Estimasi Dimensi Septic Tank Konvensional
export const hitungSepticTank = (jumlahPenghuni) => {
  const n = parseInt(jumlahPenghuni, 10) || 1;
  // Asumsi standar pemakaian air limbah ~25 liter/orang/hari dengan waktu retensi 2 hari + lumpur
  // Estimasi volume basah minimum = n * 0.4 m3 (min. 1.5 m3)
  const volumeTotal = Math.max(1.5, n * 0.35);
  const kedalamanAir = 1.5; // meter standar kedalaman efektif
  const lebar = 1.0; // meter standar
  const panjang = (volumeTotal / (kedalamanAir * lebar)).toFixed(2);

  return {
    jumlahOrang: n,
    volumeM3: volumeTotal.toFixed(2),
    panjangMeter: panjang,
    lebarMeter: lebar.toFixed(1),
    tinggiMeter: (kedalamanAir + 0.3).toFixed(1), // + freeboard 30 cm
  };
};

// 3. Hitung Estimasi Kebutuhan Batang Pipa & Biaya
export const hitungRABPipa = (panjangTotalMeter, hargaPerBatang) => {
  const totalPanjang = parseFloat(panjangTotalMeter) || 0;
  const harga = parseFloat(hargaPerBatang) || 0;
  // Panjang standar pipa PVC adalah 4 meter
  const batang = Math.ceil(totalPanjang / 4);
  const estimasiBiaya = batang * harga;

  return {
    kebutuhanBatang: batang,
    estimasiBiayaTotal: estimasiBiaya,
    estimasiBiayaFormatted: formatRupiah(estimasiBiaya),
  };
};