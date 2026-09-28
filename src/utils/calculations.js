// Helper format mata uang Rupiah
export const formatRupiah = (number) => {
  if (isNaN(number) || number === null || number === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

// 1. Hitung Beda Tinggi / Kemiringan Pipa (Pipe Slope)
export const hitungKemiringanPipa = (panjangMeter, kemiringanPersen) => {
  const L = parseFloat(panjangMeter) || 0;
  const S = parseFloat(kemiringanPersen) || 0;
  // Beda tinggi (cm) = L (m) * S (%)
  const dropCm = L * S;
  const rekomendasi = S < 1.0 
    ? 'Kemiringan terlalu landai (< 1%), berisiko kotoran mengendap.' 
    : S > 4.0 
      ? 'Kemiringan terlalu curam (> 4%), air mengalir cepat meninggalkan padatan.' 
      : 'Kemiringan ideal sesuai standar SNI (1% - 2%).';

  return {
    panjangMeter: L,
    kemiringanPersen: S,
    bedaTinggiCm: dropCm.toFixed(1),
    bedaTinggiMeter: (dropCm / 100).toFixed(3),
    rekomendasi,
  };
};

// 2. Hitung Dimensi Septic Tank Konvensional
export const hitungSepticTank = (jumlahPenghuni, jenisBangunan = 'rumah') => {
  const n = parseInt(jumlahPenghuni, 10) || 1;
  
  let debitPerOrang = 30; // Liter
  if (jenisBangunan === 'kost') debitPerOrang = 40;
  if (jenisBangunan === 'kantor') debitPerOrang = 20;

  const volumeBasah = Math.max(1.5, n * (debitPerOrang * 2 / 1000 + 0.15));
  const kedalamanAir = 1.5;
  const lebar = 1.0;
  const panjang = (volumeBasah / (kedalamanAir * lebar));
  const tinggiTotal = kedalamanAir + 0.3;

  const panjangResapan = Math.max(2.0, (n * 0.4)).toFixed(1);

  return {
    jumlahOrang: n,
    jenisBangunan,
    volumeM3: volumeBasah.toFixed(2),
    panjangMeter: panjang.toFixed(2),
    lebarMeter: lebar.toFixed(1),
    tinggiMeter: tinggiTotal.toFixed(1),
    panjangResapanMeter: panjangResapan,
  };
};

// 3. Hitung Unit Beban Alat Plambing (UBAP / Fixture Units) & Diameter Pipa
export const FIXTURE_DATA = [
  { id: 'kloset_tangki', name: 'Kloset Tangki Gelontor', ubap: 3, unit: 'bh' },
  { id: 'kloset_katup', name: 'Kloset Katup Gelontor (Flush Valve)', ubap: 6, unit: 'bh' },
  { id: 'wastafel', name: 'Wastafel / Lavatory', ubap: 1, unit: 'bh' },
  { id: 'shower', name: 'Kamar Mandi / Shower', ubap: 2, unit: 'bh' },
  { id: 'floor_drain', name: 'Floor Drain (Saringan Lantai)', ubap: 2, unit: 'bh' },
  { id: 'bak_cuci_piring', name: 'Bak Cuci Piring (Kitchen Sink)', ubap: 2, unit: 'bh' },
  { id: 'urinoir', name: 'Urinoir / Peturasan', ubap: 2, unit: 'bh' },
];

export const hitungUBAP = (fixtureCounts) => {
  let totalUBAP = 0;
  const detail = [];

  FIXTURE_DATA.forEach((fix) => {
    const qty = parseInt(fixtureCounts[fix.id], 10) || 0;
    if (qty > 0) {
      const subtotal = qty * fix.ubap;
      totalUBAP += subtotal;
      detail.push({
        name: fix.name,
        qty,
        ubapPerItem: fix.ubap,
        subtotal,
      });
    }
  });

  let pipaBuangan = '2" (DN 50)';
  let pipaTegak = '2" (DN 50)';
  if (totalUBAP > 160) {
    pipaBuangan = '4" - 5" (DN 100 - DN 125)';
    pipaTegak = '4" (DN 100)';
  } else if (totalUBAP > 32) {
    pipaBuangan = '4" (DN 100)';
    pipaTegak = '3" - 4" (DN 75 - DN 100)';
  } else if (totalUBAP > 6) {
    pipaBuangan = '3" (DN 75)';
    pipaTegak = '3" (DN 75)';
  }

  let pipaAirBersih = '1/2" (DN 15)';
  if (totalUBAP > 60) {
    pipaAirBersih = '1 1/2" (DN 40)';
  } else if (totalUBAP > 20) {
    pipaAirBersih = '1" (DN 25)';
  } else if (totalUBAP > 8) {
    pipaAirBersih = '3/4" (DN 20)';
  }

  return {
    totalUBAP,
    detail,
    rekomendasiPipaBuangan: pipaBuangan,
    rekomendasiPipaTegak: pipaTegak,
    rekomendasiPipaAirBersih: pipaAirBersih,
  };
};

// 4. Hitung Estimasi Material Pipa & Biaya RAB
export const hitungRABPipa = (panjangTotalMeter, hargaPerBatang, fittingPersen = 20) => {
  const totalPanjang = parseFloat(panjangTotalMeter) || 0;
  const harga = parseFloat(hargaPerBatang) || 0;
  const persenFitting = parseFloat(fittingPersen) || 20;

  const batangBersih = totalPanjang / 4;
  const batang = Math.ceil(batangBersih * 1.05);
  const biayaPipa = batang * harga;
  const biayaFitting = Math.round(biayaPipa * (persenFitting / 100));
  const estimasiBiayaTotal = biayaPipa + biayaFitting;

  return {
    totalPanjangMeter: totalPanjang,
    kebutuhanBatang: batang,
    estimasiFittingPcs: Math.ceil(batang * 1.5),
    biayaPipaTotal: biayaPipa,
    biayaFittingTotal: biayaFitting,
    estimasiBiayaTotal,
    biayaPipaFormatted: formatRupiah(biayaPipa),
    biayaFittingFormatted: formatRupiah(biayaFitting),
    estimasiBiayaFormatted: formatRupiah(estimasiBiayaTotal),
  };
};

// 5. Hitung Volume Pondasi Footplate (PDF 2 materi A.1)
export const hitungVolumeFootplate = ({
  panjang,
  lebar,
  tebalBalok,
  tinggiLimas,
  alasAtasP,
  alasAtasL,
  jumlahTitik,
  lebarGalian,
  panjangGalian,
  dalamGalian,
  tebalPasir,
  tebalLantaiKerja,
  panjangKolom,
  lebarKolom,
  tinggiKolom,
}) => {
  const N = parseInt(jumlahTitik, 10) || 1;
  const P = parseFloat(panjang) || 1.0;
  const L = parseFloat(lebar) || 1.0;
  const tBalok = parseFloat(tebalBalok) || 0.25;
  const tLimas = parseFloat(tinggiLimas) || 0.2;
  const aAtasP = parseFloat(alasAtasP) || 0.25;
  const aAtasL = parseFloat(alasAtasL) || 0.25;

  const PGal = parseFloat(panjangGalian) || (P + 0.4);
  const LGal = parseFloat(lebarGalian) || (L + 0.4);
  const TGal = parseFloat(dalamGalian) || 1.5;
  const tPsr = parseFloat(tebalPasir) || 0.05;
  const tLk = parseFloat(tebalLantaiKerja) || 0.05;

  const PKol = parseFloat(panjangKolom) || 0.25;
  const LKol = parseFloat(lebarKolom) || 0.25;
  const TKol = parseFloat(tinggiKolom) || 1.0;

  const volGalianPerTitik = PGal * LGal * TGal;
  const volGalianTotal = volGalianPerTitik * N;

  const volPasirPerTitik = PGal * LGal * tPsr;
  const volPasirTotal = volPasirPerTitik * N;

  const volLKPerTitik = PGal * LGal * tLk;
  const volLKTotal = volLKPerTitik * N;

  const volBalok = P * L * tBalok;
  const A1 = P * L;
  const A2 = aAtasP * aAtasL;
  const volLimas = (1 / 3) * tLimas * (A1 + A2 + Math.sqrt(A1 * A2));
  const volStrukturPerTitik = volBalok + volLimas;
  const volStrukturTotal = volStrukturPerTitik * N;

  const volBekisting = 2 * (P + L) * tBalok * N;
  const volKolomPendek = N * (PKol * LKol * TKol);

  const volMaterialTertanam = volStrukturTotal + volKolomPendek + volLKTotal + volPasirTotal;
  const volUrugKembali = Math.max(0, (volGalianTotal - volMaterialTertanam) * 1.2);

  return {
    jumlahTitik: N,
    volGalian: volGalianTotal.toFixed(3),
    volPasir: volPasirTotal.toFixed(3),
    volLantaiKerja: volLKTotal.toFixed(3),
    volStrukturBeton: volStrukturTotal.toFixed(3),
    luasBekistingM2: volBekisting.toFixed(2),
    volKolomPendek: volKolomPendek.toFixed(3),
    volUrugKembali: volUrugKembali.toFixed(3),
  };
};

// 6. Hitung Volume Pondasi Batu Kali (PDF 2 materi A.2)
export const hitungVolumeBatuKali = ({
  panjangPondasi,
  lebarBawah,
  lebarAtas,
  tinggiPondasi,
  lebarGalian,
  dalamGalian,
  tebalPasir,
  tebalAanstamping,
  lebarSloof,
  tinggiSloof,
}) => {
  const P = parseFloat(panjangPondasi) || 0;
  const LB = parseFloat(lebarBawah) || 0.6;
  const LA = parseFloat(lebarAtas) || 0.3;
  const TP = parseFloat(tinggiPondasi) || 0.8;

  const LGal = parseFloat(lebarGalian) || (LB + 0.2);
  const DGal = parseFloat(dalamGalian) || 1.0;
  const tPasir = parseFloat(tebalPasir) || 0.05;
  const tAan = parseFloat(tebalAanstamping) || 0.15;

  const LSloof = parseFloat(lebarSloof) || 0.15;
  const TSloof = parseFloat(tinggiSloof) || 0.20;

  const volGalian = LGal * DGal * P;
  const volPasir = LGal * tPasir * P;
  const volAanstamping = LB * tAan * P;
  const luasTrapesium = 0.5 * (LB + LA) * TP;
  const volBatuKali = luasTrapesium * P;
  const volSloof = LSloof * TSloof * P;
  const luasBekistingSloof = 2 * (TSloof * P);

  return {
    panjangPondasi: P,
    volGalian: volGalian.toFixed(3),
    volPasir: volPasir.toFixed(3),
    volAanstamping: volAanstamping.toFixed(3),
    volPasanganBatu: volBatuKali.toFixed(3),
    volSloof: volSloof.toFixed(3),
    luasBekistingSloofM2: luasBekistingSloof.toFixed(2),
  };
};

// 7. Hitung Pekerjaan Beton
export const hitungBetonKolom = (jumlahKolom, panjang, lebar, tinggi) => {
  const N = parseInt(jumlahKolom, 10) || 1;
  const P = parseFloat(panjang) || 0.15;
  const L = parseFloat(lebar) || 0.15;
  const T = parseFloat(tinggi) || 3.5;

  const volTotal = N * (P * L * T);
  const luasBekisting = N * (2 * (P + L) * T);

  return {
    jumlahKolom: N,
    volBetonM3: volTotal.toFixed(3),
    luasBekistingM2: luasBekisting.toFixed(2),
  };
};

export const hitungBetonBalok = (panjangBalok, lebarBalok, tinggiBalok, tebalPlat, jumlahKolomInduk, lebarKolom) => {
  const PB = parseFloat(panjangBalok) || 0;
  const LB = parseFloat(lebarBalok) || 0.15;
  const TB = parseFloat(tinggiBalok) || 0.30;
  const tPlat = parseFloat(tebalPlat) || 0.12;
  const NCol = parseInt(jumlahKolomInduk, 10) || 0;
  const LCol = parseFloat(lebarKolom) || 0.15;

  const tinggiEfektif = Math.max(0, TB - tPlat);
  const volBalokKotor = PB * LB * tinggiEfektif;
  const volTertabrak = NCol * (LB * tinggiEfektif * LCol);
  const volBersih = Math.max(0, volBalokKotor - volTertabrak);
  const luasBekisting = PB * (2 * tinggiEfektif + LB);

  return {
    volBalokBersihM3: volBersih.toFixed(3),
    luasBekistingM2: luasBekisting.toFixed(2),
  };
};

export const hitungBetonPlat = (panjang, lebar, tebal, luasLubangTangga = 0) => {
  const P = parseFloat(panjang) || 0;
  const L = parseFloat(lebar) || 0;
  const T = parseFloat(tebal) || 0.12;
  const lubang = parseFloat(luasLubangTangga) || 0;

  const luasKotor = P * L;
  const luasBersih = Math.max(0, luasKotor - lubang);
  const volBeton = luasBersih * T;
  const bekistingDasar = luasBersih;
  const bekistingSamping = 2 * ((P * T) + (L * T));
  const luasBekisting = bekistingDasar + bekistingSamping;

  return {
    luasLantaiM2: luasBersih.toFixed(2),
    volBetonM3: volBeton.toFixed(3),
    luasBekistingM2: luasBekisting.toFixed(2),
  };
};