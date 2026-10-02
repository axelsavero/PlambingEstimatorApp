// Helper format mata uang Rupiah
export const formatRupiah = (number) => {
  if (isNaN(number) || number === null || number === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatNumber = (num, decimals = 2) => {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return Number(num).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

// =============================================================================
// 1. PONDASI BATU BELAH (Sheet: Pondasi)
// =============================================================================
export const DEFAULT_PONDASI = {
  // 2.1 Dimensi Utama
  lebarAtasGalian: '0.6',      // a.1 (m)
  lebarBawahGalian: '0.5',     // b.1 (m)
  dalamGalian: '0.7',          // c.1 (m)
  panjangPondasi: '20',        // P (m)
  lebarAtasPondasi: '0.3',     // a.2 (m)
  lebarBawahPondasi: '0.4',    // b.2 (m)
  tinggiPondasi: '0.8',        // c.2 (m)
  tinggiBatuKosong: '0.1',     // d (m)
  tinggiPasirUruk: '0.15',     // e (m)
  tebalUrukanLantai: '0.4',    // f (m)
  persenUrukanSamping: '25',   // (%)
  panjangBangunan: '9',        // (m)
  lebarBangunan: '6',          // (m)
  
  // Pilihan Campuran Mortar (1 active, 0 inactive)
  campuran1_3: 1, // 1SP : 3PP
  campuran1_4: 0, // 1SP : 4PP

  // 2.3 Harga Satuan Upah (Rp)
  hargaPekerja: '100000',
  hargaTukang: '140000',
  hargaKepalaTukang: '175000',
  hargaMandor: '200000',

  // Harga Satuan Bahan (Rp)
  hargaPasirUruk: '254700',
  hargaTanahUruk: '146900',
  hargaBatuAnstamping: '286500',
  hargaBatuPondasi: '286500',
  hargaSemen: '65000',        // per sak 50kg
  hargaPasirPasang: '275000',
};

export const hitungPondasi = (inputs = DEFAULT_PONDASI) => {
  const a1 = parseFloat(inputs.lebarAtasGalian) || 0;
  const b1 = parseFloat(inputs.lebarBawahGalian) || 0;
  const c1 = parseFloat(inputs.dalamGalian) || 0;
  const P = parseFloat(inputs.panjangPondasi) || 0;
  const a2 = parseFloat(inputs.lebarAtasPondasi) || 0;
  const b2 = parseFloat(inputs.lebarBawahPondasi) || 0;
  const c2 = parseFloat(inputs.tinggiPondasi) || 0;
  const d = parseFloat(inputs.tinggiBatuKosong) || 0;
  const e = parseFloat(inputs.tinggiPasirUruk) || 0;
  const f = parseFloat(inputs.tebalUrukanLantai) || 0;
  const persSamping = parseFloat(inputs.persenUrukanSamping) || 0;
  const pBgn = parseFloat(inputs.panjangBangunan) || 0;
  const lBgn = parseFloat(inputs.lebarBangunan) || 0;

  const L18 = inputs.campuran1_3 ? 1 : 0;
  const L22 = inputs.campuran1_4 ? 1 : 0;

  // 2.2 Volume
  // I9: Volume galian
  const volGalian = a1 === b1 ? (a1 * c1 * P) : (((a1 + b1) / 2) * c1 * P);
  // I10: Volume pondasi
  const volPondasi = a2 === b2 ? (a2 * c2 * P) : (((a2 + b2) / 2) * c2 * P);
  // I11: Pas. Aanstamping
  const volAanstamping = P * b1 * d;
  // I12: Pasir uruk
  const volPasirUruk = b1 * e * P;
  // I15: Urukan tanah di bawah lantai
  const volUrukLantai = pBgn * lBgn * f;
  // I16: Urukan di samping pondasi
  const volUrukSamping = (persSamping * volGalian) / 100;
  // I17: Urukan tanah kembali
  const volUrukKembali = volGalian;

  // AHSP Koefisien & Quantities
  const H65 = volGalian * 0.75; // Pekerja galian
  const H66 = volGalian * 0.038; // Mandor galian

  const H71 = volAanstamping * 0.78; // Pekerja anstamping
  const H72 = volAanstamping * 0.39; // Tukang batu
  const H73 = volAanstamping * 0.039; // Kepala tukang
  const H74 = volAanstamping * 0.013; // Mandor
  const H76 = volAanstamping * 1.2; // Batu belah anstamping
  const H77 = volAanstamping * 0.432; // Pasir uruk anstamping

  // Campuran 1:3
  const H81 = volPondasi * 1.5 * L18; // Pekerja
  const H82 = volPondasi * 0.5 * L18; // Tukang batu
  const H83 = volPondasi * 0.15 * L18; // Mandor
  const H85 = volPondasi * 1.2 * L18; // Batu belah
  const H86 = (volPondasi * 202 / 50) * L18; // Semen sak
  const H87 = volPondasi * 0.485 * L18; // Pasir pasang

  // Campuran 1:4
  const H91 = volPondasi * 1.5 * L22;
  const H92 = volPondasi * 0.5 * L22;
  const H93 = volPondasi * 0.15 * L22;
  const H95 = volPondasi * 1.2 * L22;
  const H96 = (volPondasi * 163 / 50) * L22;
  const H97 = volPondasi * 0.52 * L22;

  // Urukan kembali
  const H101 = volUrukKembali * 0.5; // Pekerja
  const H102 = volUrukKembali * 0.025; // Mandor

  // Urukan pasir uruk
  const H106 = volPasirUruk * 0.3; // Pekerja
  const H107 = volPasirUruk * 0.015; // Mandor
  const H109 = volPasirUruk * 1.2; // Pasir uruk m3

  // Urukan tanah biasa
  const volUrukBiasaTotal = volUrukLantai + volUrukSamping;
  const H113 = volUrukBiasaTotal * 0.1; // Pekerja
  const H114 = volUrukBiasaTotal * 0.01; // Mandor
  const H116 = volUrukBiasaTotal * 1.4; // Tanah biasa m3

  // Total Tenaga Kerja (OH)
  const volPekerja = H65 + H71 + H81 + H91 + H101 + H106 + H113;
  const volTukang = H72 + H82 + H92;
  const volKepalaTukang = H73;
  const volMandor = H66 + H74 + H83 + H93 + H102 + H107 + H114;

  // Harga Tenaga Kerja
  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepalaTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepalaTukang = volKepalaTukang * hKepalaTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepalaTukang + costMandor;

  // Volume & Harga Bahan
  const volBahanPasirUruk = volPasirUruk + H77;
  const volBahanTanahUruk = H116;
  const volBahanBatuAnst = H76;
  const volBahanBatu1_3 = H85;
  const volBahanSemen1_3 = H86;
  const volBahanPasir1_3 = H87;
  const volBahanBatu1_4 = H95;
  const volBahanSemen1_4 = H96;
  const volBahanPasir1_4 = H97;

  const hPasirUruk = parseFloat(inputs.hargaPasirUruk) || 0;
  const hTanahUruk = parseFloat(inputs.hargaTanahUruk) || 0;
  const hBatuAnst = parseFloat(inputs.hargaBatuAnstamping) || 0;
  const hBatuPondasi = parseFloat(inputs.hargaBatuPondasi) || 0;
  const hSemen = parseFloat(inputs.hargaSemen) || 0;
  const hPasirPasang = parseFloat(inputs.hargaPasirPasang) || 0;

  const costPasirUruk = volBahanPasirUruk * hPasirUruk;
  const costTanahUruk = volBahanTanahUruk * hTanahUruk;
  const costBatuAnst = volBahanBatuAnst * hBatuAnst;
  const costBatu1_3 = volBahanBatu1_3 * hBatuPondasi;
  const costSemen1_3 = volBahanSemen1_3 * hSemen;
  const costPasir1_3 = volBahanPasir1_3 * hPasirPasang;
  const costBatu1_4 = volBahanBatu1_4 * hBatuPondasi;
  const costSemen1_4 = volBahanSemen1_4 * hSemen;
  const costPasir1_4 = volBahanPasir1_4 * hPasirPasang;

  const totalBahan = costPasirUruk + costTanahUruk + costBatuAnst +
    costBatu1_3 + costSemen1_3 + costPasir1_3 +
    costBatu1_4 + costSemen1_4 + costPasir1_4;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      volGalian,
      volPondasi,
      volAanstamping,
      volPasirUruk,
      volUrukLantai,
      volUrukSamping,
      volUrukKembali,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepalaTukang, subtotal: costKepalaTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: 'Pasir uruk', volume: volBahanPasirUruk, satuan: 'm³', harga: hPasirUruk, subtotal: costPasirUruk },
      { uraian: 'Tanah uruk biasa', volume: volBahanTanahUruk, satuan: 'm³', harga: hTanahUruk, subtotal: costTanahUruk },
      { uraian: 'Batu belah anstamping', volume: volBahanBatuAnst, satuan: 'm³', harga: hBatuAnst, subtotal: costBatuAnst },
      ...(L18 ? [
        { uraian: 'Batu belah (1SP:3PP)', volume: volBahanBatu1_3, satuan: 'm³', harga: hBatuPondasi, subtotal: costBatu1_3 },
        { uraian: 'Semen portland (1SP:3PP)', volume: volBahanSemen1_3, satuan: 'sak', harga: hSemen, subtotal: costSemen1_3 },
        { uraian: 'Pasir pasang (1SP:3PP)', volume: volBahanPasir1_3, satuan: 'm³', harga: hPasirPasang, subtotal: costPasir1_3 },
      ] : []),
      ...(L22 ? [
        { uraian: 'Batu belah (1SP:4PP)', volume: volBahanBatu1_4, satuan: 'm³', harga: hBatuPondasi, subtotal: costBatu1_4 },
        { uraian: 'Semen portland (1SP:4PP)', volume: volBahanSemen1_4, satuan: 'sak', harga: hSemen, subtotal: costSemen1_4 },
        { uraian: 'Pasir pasang (1SP:4PP)', volume: volBahanPasir1_4, satuan: 'm³', harga: hPasirPasang, subtotal: costPasir1_4 },
      ] : []),
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// 2. FOOT PLATE / PONDASI TAPAK (Sheet: Foot Plate)
// =============================================================================
export const DEFAULT_FOOTPLATE = {
  // 3.1 Dimensi Utama
  lebarKolom1: '0.25', // a1 (m)
  lebarKolom2: '0.25', // a2 (m)
  lebarTapak1: '0.7',  // b1 (m)
  lebarTapak2: '0.7',  // b2 (m)
  tinggiKolom: '1.5',  // h1 (m)
  kemiringanTapak: '0.1', // h2 (m)
  tinggiTapak: '0.3',  // h3 (m)
  tinggiLantaiKerja: '0.05', // h4 (m)
  tinggiPasirUruk: '0.1', // h5 (m)
  jumlahTapak: '5',    // unit
  
  // Besi Tulangan
  diaUtama: '16',      // d1 (mm)
  diaSupport: '16',    // d2 (mm)
  diaSengkang: '10',   // d3 (mm)
  diaAlas: '13',       // d4 (mm)
  diaPembentuk: '13',  // d5 (mm)
  diaKait: '10',       // d6 (mm)
  diaKawat: '1.2',     // (mm)
  
  jmlBesiUtama: '3',   // bh
  jmlBesiSupport: '3', // bh
  jarakSengkang: '0.15', // r1 (m)
  jarakTulangan: '0.15', // r2 (m)
  panjangKawatIkat: '0.35', // (m)
  selimutBeton: '0.03', // (m)
  massaJenisBesi: '7850', // (kg/m3)

  // Harga Upah
  hargaPekerja: '100000',
  hargaTukang: '145000',
  hargaKepalaTukang: '175000',
  hargaMandor: '200000',

  // Harga Bahan
  hargaBesiUtama: '196700',      // dia 16mm per batang (12m)
  hargaBesiSupport: '196700',    // dia 16mm per batang
  hargaBesiSengkang: '67800',    // dia 10mm per batang
  hargaBesiAlas: '117200',       // dia 13mm per batang
  hargaBesiPembentuk: '117200',  // dia 13mm per batang
  hargaBesiKait: '67800',        // dia 10mm per batang
  hargaKawatBeton: '18800',      // per kg
  hargaKayuPapanIII: '8000000',  // per m³
  hargaKayuBalokII: '11950000',  // per m³
  hargaPlywood12mm: '167300',    // per lembar
  hargaDolken: '35000',          // per batang
  hargaMinyakBekisting: '9500',  // per liter
  hargaPaku12cm: '20500',        // per kg
  hargaPaku4inch: '19000',       // per kg
  hargaSemen: '65000',           // per sak 50kg
  hargaPasirBeton: '420000',     // per m³
  hargaBatuSplit: '400000',      // per m³
  hargaAir: '200',               // per liter
  hargaPasirUruk: '254700',      // per m³
};

export const hitungFootPlate = (inputs = DEFAULT_FOOTPLATE) => {
  const a1 = parseFloat(inputs.lebarKolom1) || 0;
  const a2 = parseFloat(inputs.lebarKolom2) || 0;
  const b1 = parseFloat(inputs.lebarTapak1) || 0;
  const b2 = parseFloat(inputs.lebarTapak2) || 0;
  const h1 = parseFloat(inputs.tinggiKolom) || 0;
  const h2 = parseFloat(inputs.kemiringanTapak) || 0;
  const h3 = parseFloat(inputs.tinggiTapak) || 0;
  const h4 = parseFloat(inputs.tinggiLantaiKerja) || 0;
  const h5 = parseFloat(inputs.tinggiPasirUruk) || 0;
  const nUnit = parseFloat(inputs.jumlahTapak) || 0;

  const d1 = parseFloat(inputs.diaUtama) || 0;
  const d2 = parseFloat(inputs.diaSupport) || 0;
  const d3 = parseFloat(inputs.diaSengkang) || 0;
  const d4 = parseFloat(inputs.diaAlas) || 0;
  const d5 = parseFloat(inputs.diaPembentuk) || 0;
  const d6 = parseFloat(inputs.diaKait) || 0;
  const dKawat = parseFloat(inputs.diaKawat) || 0;

  const jmlUtama = parseFloat(inputs.jmlBesiUtama) || 0;
  const jmlSupport = parseFloat(inputs.jmlBesiSupport) || 0;
  const r1 = parseFloat(inputs.jarakSengkang) || 0.15;
  const r2 = parseFloat(inputs.jarakTulangan) || 0.15;
  const pKawat = parseFloat(inputs.panjangKawatIkat) || 0.35;
  const sBeton = parseFloat(inputs.selimutBeton) || 0.03;
  const rho = parseFloat(inputs.massaJenisBesi) || 7850;

  // Besi per 1 titik (1 set)
  // I8: Jumlah Besi D1 = (h1 + h2 + h3 + a1 + 10*d1/1000) * jmlUtama
  const pjgD1_1set = (h1 + h2 + h3 + a1 + (10 * d1 / 1000)) * jmlUtama;
  // I9: Jumlah Besi D2 = (h1 + h2 + h3 + a1 + 10*d2/1000) * jmlSupport
  const pjgD2_1set = (h1 + h2 + h3 + a1 + (10 * d2 / 1000)) * jmlSupport;
  // I10: Jumlah Besi D3 (sengkang)
  const pjgD3_1set = (((h1 + h2 + h3) / r1) + 1) * (a1 + a2 + (10 * d3 / 1000) - 2 * sBeton) * 2;
  // I11: Jumlah Besi D4 (alas)
  const pjgD4_1set = ((b1 / r2) + 1) * (b2 + 2 * 10 * d4 / 1000) + ((b2 / r2) + 1) * (b1 + 2 * 10 * d4 / 1000);
  // I12: Jumlah Besi D5 (pembentuk)
  const pjgD5_1set = ((b1 / r2) + 1) * (b2 + 2 * h2 + 2 * h3 + 2 * 10 * d5 / 1000) + ((b2 / r2) + 1) * (b1 + 2 * h2 + 2 * h3 + 2 * 10 * d5 / 1000);
  // I13: Jumlah Besi D6 (kait)
  const pjgD6_1set = (a1 + 1.25 * 2 * (h2 + h3) + 2 * 10 * d6 / 1000) * 4;
  // I14: Jumlah Kawat Beton per 1 set
  const pjgKawat_1set = (((h1 / r1) + 1) * (jmlUtama + jmlSupport) + ((b1 / r1) + 1) * ((b2 / r1) + 1)) * pKawat;

  // Total Panjang Besi untuk seluruh pondasi (I24..I30)
  const totPjgD1 = pjgD1_1set * nUnit;
  const totPjgD2 = pjgD2_1set * nUnit;
  const totPjgD3 = pjgD3_1set * nUnit;
  const totPjgD4 = pjgD4_1set * nUnit;
  const totPjgD5 = pjgD5_1set * nUnit;
  const totPjgD6 = pjgD6_1set * nUnit;
  const totPjgKawat = pjgKawat_1set * nUnit;

  // I16: Galian Pondasi
  const volGalian = b1 * b2 * (h1 + h2 + h3 + h4 + h5) * nUnit;
  // I17: Urugan Pasir Pondasi
  const volPasirUruk = b1 * b2 * h5 * nUnit;
  // I22: Volume Lantai Kerja
  const volLantaiKerja = b1 * b2 * h4 * nUnit;
  // I19: Pekerjaan Bekisting
  const bekistingTapak = (b1 + b2) * 2 * h3 * nUnit;
  const bekistingKolom = (a1 + a2) * 2 * h1 * nUnit;
  const volBekisting = bekistingTapak + bekistingKolom;
  // I20: Pekerjaan Cor K-300
  const volCor = (a1 * a2 * h1 + b1 * b2 * h3 + b1 * b2 * h2 * 0.5) * nUnit;

  // Berat Besi Total (I18)
  const beratPembesianTotal = (0.785 * rho / 1000000) * (
    pjgD1_1set * (d1 ** 2) +
    pjgD2_1set * (d2 ** 2) +
    pjgD3_1set * (d3 ** 2) +
    pjgD4_1set * (d4 ** 2) +
    pjgD5_1set * (d5 ** 2) +
    pjgD6_1set * (d6 ** 2) +
    pjgKawat_1set * (dKawat ** 2)
  ) * nUnit;

  // Berat kawat (I21)
  const beratKawatTotal = (0.785 * rho / 1000000) * (totPjgKawat * (dKawat ** 2));

  // AHSP Tenaga Kerja (I58, I59, I60, I61)
  // Pembesian (beratPembesianTotal)
  const ohPekBesi = beratPembesianTotal * 0.0016;
  const ohTukBesi = beratPembesianTotal * 0.0016;
  const ohKepBesi = beratPembesianTotal * 0.00016;
  const ohManBesi = beratPembesianTotal * 0.00016;

  // Bekisting tapak (bekistingTapak)
  const ohPekBekTapak = bekistingTapak * 0.52;
  const ohTukBekTapak = bekistingTapak * 0.26;
  const ohKepBekTapak = bekistingTapak * 0.026;
  const ohManBekTapak = bekistingTapak * 0.009;

  // Bekisting kolom (bekistingKolom)
  const ohPekBekKol = bekistingKolom * 0.66;
  const ohTukBekKol = bekistingKolom * 0.33;
  const ohKepBekKol = bekistingKolom * 0.033;
  const ohManBekKol = bekistingKolom * 0.011;

  // Cor K-300 (volCor)
  const ohPekCor = volCor * 1.0;
  const ohTukCor = volCor * 0.25;
  const ohKepCor = volCor * 0.025;
  const ohManCor = volCor * 0.1;

  // Galian & Urukan (I16)
  const ohPekGal = volGalian * 0.9; // 0.5 + 0.4
  const ohManGal = volGalian * 0.065;

  // Total OH Tenaga Kerja
  const volPekerja = ohPekBesi + ohPekBekTapak + ohPekBekKol + ohPekCor + ohPekGal;
  const volTukang = ohTukBesi + ohTukBekTapak + ohTukBekKol + ohTukCor;
  const volKepalaTukang = ohKepBesi + ohKepBekTapak + ohKepBekKol + ohKepCor;
  const volMandor = ohManBesi + ohManBekTapak + ohManBekKol + ohManCor + ohManGal;

  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepTukang = volKepalaTukang * hKepTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepTukang + costMandor;

  // Batang Besi (12m per btg)
  const btgD1 = totPjgD1 / 12;
  const btgD2 = totPjgD2 / 12;
  const btgD3 = totPjgD3 / 12;
  const btgD4 = totPjgD4 / 12;
  const btgD5 = totPjgD5 / 12;
  const btgD6 = totPjgD6 / 12;

  // Bahan Bekisting Tapak (bekistingTapak)
  const volKayuPapan = bekistingTapak * 0.016;
  const beratPaku4 = bekistingTapak * 0.3;
  const ltrMinyakTapak = bekistingTapak * 0.1;

  // Bahan Bekisting Kolom (bekistingKolom)
  const volKayuBalok = bekistingKolom * 0.00465;
  const lbrPlywood = bekistingKolom * 0.12705;
  const btgDolken = bekistingKolom * 0.65;
  const beratPaku12 = bekistingKolom * 0.4;
  const ltrMinyakKolom = bekistingKolom * 0.2;
  const totMinyak = ltrMinyakTapak + ltrMinyakKolom;

  // Bahan Cor K-300 (volCor)
  const sakSemen = (volCor * 407) / 50;
  const volPasirBeton = (volCor * 731) / 1400;
  const volBatuSplit = (volCor * 1009) / 1450;
  const ltrAir = volCor * 202;

  // Hitung Biaya Bahan
  const costD1 = btgD1 * (parseFloat(inputs.hargaBesiUtama) || 0);
  const costD2 = btgD2 * (parseFloat(inputs.hargaBesiSupport) || 0);
  const costD3 = btgD3 * (parseFloat(inputs.hargaBesiSengkang) || 0);
  const costD4 = btgD4 * (parseFloat(inputs.hargaBesiAlas) || 0);
  const costD5 = btgD5 * (parseFloat(inputs.hargaBesiPembentuk) || 0);
  const costD6 = btgD6 * (parseFloat(inputs.hargaBesiKait) || 0);
  const costKawat = beratKawatTotal * (parseFloat(inputs.hargaKawatBeton) || 0);

  const costKayuPapan = volKayuPapan * (parseFloat(inputs.hargaKayuPapanIII) || 0);
  const costKayuBalok = volKayuBalok * (parseFloat(inputs.hargaKayuBalokII) || 0);
  const costPlywood = lbrPlywood * (parseFloat(inputs.hargaPlywood12mm) || 0);
  const costDolken = btgDolken * (parseFloat(inputs.hargaDolken) || 0);
  const costMinyak = totMinyak * (parseFloat(inputs.hargaMinyakBekisting) || 0);
  const costPaku12 = beratPaku12 * (parseFloat(inputs.hargaPaku12cm) || 0);
  const costPaku4 = beratPaku4 * (parseFloat(inputs.hargaPaku4inch) || 0);

  const costSemen = sakSemen * (parseFloat(inputs.hargaSemen) || 0);
  const costPasirBeton = volPasirBeton * (parseFloat(inputs.hargaPasirBeton) || 0);
  const costBatuSplit = volBatuSplit * (parseFloat(inputs.hargaBatuSplit) || 0);
  const costAir = ltrAir * (parseFloat(inputs.hargaAir) || 0);
  const costPasirUruk = volPasirUruk * (parseFloat(inputs.hargaPasirUruk) || 0);

  const totalBahan = costD1 + costD2 + costD3 + costD4 + costD5 + costD6 + costKawat +
    costKayuPapan + costKayuBalok + costPlywood + costDolken + costMinyak + costPaku12 + costPaku4 +
    costSemen + costPasirBeton + costBatuSplit + costAir + costPasirUruk;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      volGalian,
      volPasirUruk,
      volLantaiKerja,
      volBekisting,
      volCor,
      beratPembesianTotal,
      beratKawatTotal,
      totPjgD1,
      totPjgD2,
      totPjgD3,
      totPjgD4,
      totPjgD5,
      totPjgD6,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepTukang, subtotal: costKepTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: `Besi utama, dia: ${d1} mm`, volume: btgD1, satuan: 'batang', harga: parseFloat(inputs.hargaBesiUtama) || 0, subtotal: costD1 },
      { uraian: `Besi support, dia: ${d2} mm`, volume: btgD2, satuan: 'batang', harga: parseFloat(inputs.hargaBesiSupport) || 0, subtotal: costD2 },
      { uraian: `Besi sengkang, dia: ${d3} mm`, volume: btgD3, satuan: 'batang', harga: parseFloat(inputs.hargaBesiSengkang) || 0, subtotal: costD3 },
      { uraian: `Besi alas, dia: ${d4} mm`, volume: btgD4, satuan: 'batang', harga: parseFloat(inputs.hargaBesiAlas) || 0, subtotal: costD4 },
      { uraian: `Besi pembentuk, dia: ${d5} mm`, volume: btgD5, satuan: 'batang', harga: parseFloat(inputs.hargaBesiPembentuk) || 0, subtotal: costD5 },
      { uraian: `Besi kait, dia: ${d6} mm`, volume: btgD6, satuan: 'batang', harga: parseFloat(inputs.hargaBesiKait) || 0, subtotal: costD6 },
      { uraian: `Kawat beton, ${dKawat} mm`, volume: beratKawatTotal, satuan: 'kg', harga: parseFloat(inputs.hargaKawatBeton) || 0, subtotal: costKawat },
      { uraian: 'Kayu papan kelas III', volume: volKayuPapan, satuan: 'm³', harga: parseFloat(inputs.hargaKayuPapanIII) || 0, subtotal: costKayuPapan },
      { uraian: 'Kayu balok 6/12 kelas II', volume: volKayuBalok, satuan: 'm³', harga: parseFloat(inputs.hargaKayuBalokII) || 0, subtotal: costKayuBalok },
      { uraian: 'Plywood 12 mm', volume: lbrPlywood, satuan: 'lembar', harga: parseFloat(inputs.hargaPlywood12mm) || 0, subtotal: costPlywood },
      { uraian: 'Dolken kayu φ 8-10 (4m)', volume: btgDolken, satuan: 'batang', harga: parseFloat(inputs.hargaDolken) || 0, subtotal: costDolken },
      { uraian: 'Minyak bekisting', volume: totMinyak, satuan: 'liter', harga: parseFloat(inputs.hargaMinyakBekisting) || 0, subtotal: costMinyak },
      { uraian: 'Paku 12 cm', volume: beratPaku12, satuan: 'kg', harga: parseFloat(inputs.hargaPaku12cm) || 0, subtotal: costPaku12 },
      { uraian: 'Paku 4 inch', volume: beratPaku4, satuan: 'kg', harga: parseFloat(inputs.hargaPaku4inch) || 0, subtotal: costPaku4 },
      { uraian: 'Semen Portland (50kg)', volume: sakSemen, satuan: 'sak', harga: parseFloat(inputs.hargaSemen) || 0, subtotal: costSemen },
      { uraian: 'Pasir beton', volume: volPasirBeton, satuan: 'm³', harga: parseFloat(inputs.hargaPasirBeton) || 0, subtotal: costPasirBeton },
      { uraian: 'Batu split', volume: volBatuSplit, satuan: 'm³', harga: parseFloat(inputs.hargaBatuSplit) || 0, subtotal: costBatuSplit },
      { uraian: 'Air', volume: ltrAir, satuan: 'liter', harga: parseFloat(inputs.hargaAir) || 0, subtotal: costAir },
      { uraian: 'Pasir uruk', volume: volPasirUruk, satuan: 'm³', harga: parseFloat(inputs.hargaPasirUruk) || 0, subtotal: costPasirUruk },
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// 3. SLOOF BETON (Sheet: Sloof)
// =============================================================================
export const DEFAULT_SLOOF = {
  panjangSloof: '3',   // P (m)
  lebarSloof: '0.2',    // b (m)
  tinggiSloof: '0.3',   // h (m)
  jumlahSloof: '5',    // unit

  diaTul1: '10',       // (mm)
  diaTul2: '8',        // (mm)
  diaSengkang: '6',    // (mm)
  diaKawat: '1.2',     // (mm)

  jmlTul1: '4',        // bh
  jmlTul2: '2',        // bh
  jarakSengkangTumpuan: '15', // cm
  jarakSengkangLapangan: '20', // cm
  selimutBeton: '2.5', // cm
  panjangKawatIkat: '0.25', // m
  massaJenisBesi: '7850', // kg/m³

  // Harga Upah
  hargaPekerja: '80000',
  hargaTukang: '135000',
  hargaKepalaTukang: '145000',
  hargaMandor: '170000',

  // Harga Bahan
  hargaBesiTul1: '67800',       // per batang
  hargaBesiTul2: '47500',       // per batang
  hargaBesiSengkang: '36053',   // per batang
  hargaKawatBeton: '18800',     // per kg
  hargaKayuPapanIII: '8000000', // per m³
  hargaPaku4inch: '19000',      // per kg
  hargaMinyakBekisting: '16800',// per liter
  hargaSemen: '65000',          // per sak 50kg
  hargaPasirBeton: '420000',    // per m³
  hargaBatuSplit: '400000',     // per m³
  hargaAir: '200',              // per liter
};

export const hitungSloof = (inputs = DEFAULT_SLOOF) => {
  const P = parseFloat(inputs.panjangSloof) || 0;
  const b = parseFloat(inputs.lebarSloof) || 0;
  const h = parseFloat(inputs.tinggiSloof) || 0;
  const nUnit = parseFloat(inputs.jumlahSloof) || 0;

  const d1 = parseFloat(inputs.diaTul1) || 0;
  const d2 = parseFloat(inputs.diaTul2) || 0;
  const dS = parseFloat(inputs.diaSengkang) || 0;
  const dKawat = parseFloat(inputs.diaKawat) || 0;

  const n1 = parseFloat(inputs.jmlTul1) || 0;
  const n2 = parseFloat(inputs.jmlTul2) || 0;
  const sTump = parseFloat(inputs.jarakSengkangTumpuan) || 15;
  const sLap = parseFloat(inputs.jarakSengkangLapangan) || 20;
  const s = parseFloat(inputs.selimutBeton) || 2.5;
  const pKawat = parseFloat(inputs.panjangKawatIkat) || 0.25;
  const rho = parseFloat(inputs.massaJenisBesi) || 7850;

  // I14: Besi kait = MAX(d1, d2) * 10 / 1000
  const pjgKait = Math.max(d1, d2) * 10 / 1000;
  // I15: Besi overstek = h
  const pjgOverstek = h;

  // Sengkang tumpuan & lapangan (I16, I17)
  const setSengkangTumpuan = Math.ceil((P * 100 / 2 / sTump) + 1);
  const setSengkangLapangan = Math.ceil((P * 100 / 2 / sLap) + 1);

  // D25: Panjang besi sengkang 1 bh = ((b + h) * 2) - (s * 8 / 100) + (10 * dS * 2 / 1000)
  const pjgSengkang1Bh = ((b + h) * 2) - (s * 8 / 100) + (10 * dS * 2 / 1000);

  // Panjang besi 1 set sloof (I9, I10, I11, I12)
  const pjgTul1_1set = (P + (pjgKait * 2) + (pjgOverstek * 2)) * n1;
  const pjgTul2_1set = (P + (pjgKait * 2) + (pjgOverstek * 2)) * n2;
  const pjgSengkang_1set = pjgSengkang1Bh * (setSengkangTumpuan + setSengkangLapangan);
  const pjgKawat_1set = (n1 + n2) * pKawat * (setSengkangTumpuan + setSengkangLapangan + 1);

  // Total Panjang untuk seluruh sloof
  const totPjgTul1 = pjgTul1_1set * nUnit;
  const totPjgTul2 = pjgTul2_1set * nUnit;
  const totPjgSengkang = pjgSengkang_1set * nUnit;
  const totPjgKawat = pjgKawat_1set * nUnit;

  // Berat Pembesian (R44, R45, R46, R47)
  const area1 = Math.PI * ((d1 / 1000) / 2) ** 2;
  const area2 = Math.PI * ((d2 / 1000) / 2) ** 2;
  const areaS = Math.PI * ((dS / 1000) / 2) ** 2;
  const areaKawat = Math.PI * ((dKawat / 1000) / 2) ** 2;

  const beratTul1 = area1 * totPjgTul1 * rho;
  const beratTul2 = area2 * totPjgTul2 * rho;
  const beratSengkang = areaS * totPjgSengkang * rho;
  const beratPembesianTotal = beratTul1 + beratTul2 + beratSengkang;
  const beratKawatTotal = areaKawat * totPjgKawat * rho;

  // Volume Bekisting & Cor (I20, I21)
  const volBekisting = (P * h * 2) * nUnit;
  const volCor = (P * b * h) * nUnit;

  // AHSP Tenaga Kerja
  // Pembesian (beratPembesianTotal)
  const H55 = beratPembesianTotal * 0.0016; // Pekerja
  const H56 = beratPembesianTotal * 0.0016; // Tukang besi
  const H57 = beratPembesianTotal * 0.00016; // Kepala tukang
  const H58 = beratPembesianTotal * 0.00016; // Mandor

  // Bekisting Sloof (volBekisting)
  const H66 = volBekisting * 0.52; // Pekerja
  const H67 = volBekisting * 0.26; // Tukang kayu
  const H68 = volBekisting * 0.026; // Kepala tukang
  const H69 = volBekisting * 0.009; // Mandor

  // Cor Beton K-275 (volCor)
  const H78 = volCor * 1.65; // Pekerja
  const H79 = volCor * 0.275; // Tukang batu
  const H80 = volCor * 0.028; // Kepala tukang
  const H81 = volCor * 0.009; // Mandor

  // Pembongkaran Bekisting
  const H91 = volBekisting * 0.04; // Pekerja
  const H92 = volBekisting * 0.004; // Mandor

  // Akumulasi Tenaga Kerja
  const volPekerja = H55 + H66 + H78 + H91;
  const volTukang = H56 + H67 + H79;
  const volKepalaTukang = H57 + H68 + H80;
  const volMandor = H58 + H69 + H81 + H92;

  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepTukang = volKepalaTukang * hKepTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepTukang + costMandor;

  // Bahan
  const btgTul1 = totPjgTul1 / 12;
  const btgTul2 = totPjgTul2 / 12;
  const btgSengkang = totPjgSengkang / 12;

  const volKayuPapan = volBekisting * 0.018;
  const beratPaku4 = volBekisting * 0.3;
  const ltrMinyak = volBekisting * 0.1;

  const sakSemen = (volCor * 368) / 50;
  const volPasirBeton = (volCor * 770) / 1400;
  const volBatuSplit = (volCor * 1009) / 1450;
  const ltrAir = volCor * 202;

  const costTul1 = btgTul1 * (parseFloat(inputs.hargaBesiTul1) || 0);
  const costTul2 = btgTul2 * (parseFloat(inputs.hargaBesiTul2) || 0);
  const costSengkang = btgSengkang * (parseFloat(inputs.hargaBesiSengkang) || 0);
  const costKawat = beratKawatTotal * (parseFloat(inputs.hargaKawatBeton) || 0);

  const costKayuPapan = volKayuPapan * (parseFloat(inputs.hargaKayuPapanIII) || 0);
  const costPaku4 = beratPaku4 * (parseFloat(inputs.hargaPaku4inch) || 0);
  const costMinyak = ltrMinyak * (parseFloat(inputs.hargaMinyakBekisting) || 0);

  const costSemen = sakSemen * (parseFloat(inputs.hargaSemen) || 0);
  const costPasirBeton = volPasirBeton * (parseFloat(inputs.hargaPasirBeton) || 0);
  const costBatuSplit = volBatuSplit * (parseFloat(inputs.hargaBatuSplit) || 0);
  const costAir = ltrAir * (parseFloat(inputs.hargaAir) || 0);

  const totalBahan = costTul1 + costTul2 + costSengkang + costKawat +
    costKayuPapan + costPaku4 + costMinyak +
    costSemen + costPasirBeton + costBatuSplit + costAir;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      volBekisting,
      volCor,
      beratPembesianTotal,
      beratKawatTotal,
      totPjgTul1,
      totPjgTul2,
      totPjgSengkang,
      totPjgKawat,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepTukang, subtotal: costKepTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: `Besi diameter: ${d1} mm`, volume: btgTul1, satuan: 'batang', harga: parseFloat(inputs.hargaBesiTul1) || 0, subtotal: costTul1 },
      { uraian: `Besi diameter: ${d2} mm`, volume: btgTul2, satuan: 'batang', harga: parseFloat(inputs.hargaBesiTul2) || 0, subtotal: costTul2 },
      { uraian: `Besi diameter: ${dS} mm`, volume: btgSengkang, satuan: 'batang', harga: parseFloat(inputs.hargaBesiSengkang) || 0, subtotal: costSengkang },
      { uraian: `Kawat beton: ${dKawat} mm`, volume: beratKawatTotal, satuan: 'kg', harga: parseFloat(inputs.hargaKawatBeton) || 0, subtotal: costKawat },
      { uraian: 'Kayu papan kelas III', volume: volKayuPapan, satuan: 'm³', harga: parseFloat(inputs.hargaKayuPapanIII) || 0, subtotal: costKayuPapan },
      { uraian: 'Paku 4 inch', volume: beratPaku4, satuan: 'kg', harga: parseFloat(inputs.hargaPaku4inch) || 0, subtotal: costPaku4 },
      { uraian: 'Minyak Bekisting', volume: ltrMinyak, satuan: 'liter', harga: parseFloat(inputs.hargaMinyakBekisting) || 0, subtotal: costMinyak },
      { uraian: 'Semen Portland (PC)', volume: sakSemen, satuan: 'sak', harga: parseFloat(inputs.hargaSemen) || 0, subtotal: costSemen },
      { uraian: 'Pasir beton', volume: volPasirBeton, satuan: 'm³', harga: parseFloat(inputs.hargaPasirBeton) || 0, subtotal: costPasirBeton },
      { uraian: 'Batu split 2/3', volume: volBatuSplit, satuan: 'm³', harga: parseFloat(inputs.hargaBatuSplit) || 0, subtotal: costBatuSplit },
      { uraian: 'Air', volume: ltrAir, satuan: 'liter', harga: parseFloat(inputs.hargaAir) || 0, subtotal: costAir },
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// 4. KOLOM BETON (Sheet: Kolom)
// =============================================================================
export const DEFAULT_KOLOM = {
  tinggiKolom: '3',    // T (m)
  lebarKolom: '0.15',  // L (m)
  panjangKolom: '0.25',// P (m)
  jumlahKolom: '5',    // unit

  diaUtama: '12',      // D1 (mm)
  diaSupport: '10',    // D2 (mm)
  diaSengkang: '8',    // (mm)
  diaKawat: '1.2',     // (mm)

  jmlUtama: '4',       // bh
  jmlSupport: '2',     // bh
  jarakSengkang: '15', // cm
  selimutBeton: '2.5', // cm
  panjangKawatIkat: '0.35', // m
  massaJenisBesi: '7850', // kg/m³

  // Harga Upah
  hargaPekerja: '80000',
  hargaTukang: '135000',
  hargaKepalaTukang: '150000',
  hargaMandor: '175000',

  // Harga Bahan
  hargaBesiUtama: '67800',        // per batang
  hargaBesiSupport: '47500',      // per batang
  hargaBesiSengkang: '36053',     // per batang
  hargaKawatBeton: '18800',       // per kg
  hargaPaku12cm: '20500',         // per kg
  hargaMinyakBekisting: '9500',   // per liter
  hargaKayuBalokII: '11950000',   // per m³
  hargaPlywood12mm: '167300',     // per lembar
  hargaDolken: '35000',           // per batang
  hargaSemen: '65000',            // per sak
  hargaPasirBeton: '400000',      // per m³
  hargaBatuSplit: '450000',       // per m³
  hargaAir: '200',                // per liter
};

export const hitungKolom = (inputs = DEFAULT_KOLOM) => {
  const T = parseFloat(inputs.tinggiKolom) || 0;
  const L = parseFloat(inputs.lebarKolom) || 0;
  const P = parseFloat(inputs.panjangKolom) || 0;
  const nUnit = parseFloat(inputs.jumlahKolom) || 0;

  const d1 = parseFloat(inputs.diaUtama) || 0;
  const d2 = parseFloat(inputs.diaSupport) || 0;
  const dS = parseFloat(inputs.diaSengkang) || 0;
  const dKawat = parseFloat(inputs.diaKawat) || 0;

  const n1 = parseFloat(inputs.jmlUtama) || 0;
  const n2 = parseFloat(inputs.jmlSupport) || 0;
  const sDist = parseFloat(inputs.jarakSengkang) || 15;
  const s = parseFloat(inputs.selimutBeton) || 2.5;
  const pKawat = parseFloat(inputs.panjangKawatIkat) || 0.35;
  const rho = parseFloat(inputs.massaJenisBesi) || 7850;

  // Kait atas & bawah (I14, I15) = MAX(d1, d2) * 10 / 1000
  const pjgKaitAtas = Math.max(d1, d2) * 10 / 1000;
  const pjgKaitBawah = Math.max(d1, d2) * 10 / 1000;

  // Jumlah Sengkang per kolom (I16)
  const jmlSengkang = Math.ceil((T / (sDist / 100)) + 1);

  // D25: Panjang besi sengkang 1 bh = ((L + P) * 2) - (s * 8 / 100) + (8 * dS * 2 / 1000)
  const pjgSengkang1Bh = ((L + P) * 2) - (s * 8 / 100) + (8 * dS * 2 / 1000);

  // Panjang besi 1 set kolom
  const pjgUtama_1set = (T + pjgKaitAtas + pjgKaitBawah) * n1;
  const pjgSupport_1set = (T + pjgKaitAtas + pjgKaitBawah) * n2;
  const pjgSengkang_1set = pjgSengkang1Bh * jmlSengkang;
  const pjgKawat_1set = (n1 + n2) * (jmlSengkang + 1) * pKawat;

  // Total panjang semua kolom
  const totPjgUtama = pjgUtama_1set * nUnit;
  const totPjgSupport = pjgSupport_1set * nUnit;
  const totPjgSengkang = pjgSengkang_1set * nUnit;
  const totPjgKawat = pjgKawat_1set * nUnit;

  // Berat Pembesian
  const area1 = Math.PI * ((d1 / 1000) / 2) ** 2;
  const area2 = Math.PI * ((d2 / 1000) / 2) ** 2;
  const areaS = Math.PI * ((dS / 1000) / 2) ** 2;
  const areaKawat = Math.PI * ((dKawat / 1000) / 2) ** 2;

  const beratUtama = area1 * totPjgUtama * rho;
  const beratSupport = area2 * totPjgSupport * rho;
  const beratSengkang = areaS * totPjgSengkang * rho;
  const beratPembesianTotal = beratUtama + beratSupport + beratSengkang;
  const beratKawatTotal = areaKawat * totPjgKawat * rho;

  // Volume Bekisting & Cor
  const volBekisting = ((L + P) * T * nUnit) * 2;
  const volCor = L * P * T * nUnit;

  // AHSP Tenaga Kerja
  const H55 = beratPembesianTotal * 0.0016;
  const H56 = beratPembesianTotal * 0.0016;
  const H57 = beratPembesianTotal * 0.00016;
  const H58 = beratPembesianTotal * 0.00016;

  const H66 = volBekisting * 0.66;
  const H67 = volBekisting * 0.33;
  const H68 = volBekisting * 0.033;
  const H69 = volBekisting * 0.011;

  const H80 = volCor * 1.65;
  const H81 = volCor * 0.275;
  const H82 = volCor * 0.028;
  const H83 = volCor * 0.009;

  const H93 = volBekisting * 0.04;
  const H94 = volBekisting * 0.004;

  const volPekerja = H55 + H66 + H80 + H93;
  const volTukang = H56 + H67 + H81;
  const volKepalaTukang = H57 + H68 + H82;
  const volMandor = H58 + H69 + H83 + H94;

  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepTukang = volKepalaTukang * hKepTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepTukang + costMandor;

  // Bahan
  const btgUtama = totPjgUtama / 12;
  const btgSupport = totPjgSupport / 12;
  const btgSengkang = totPjgSengkang / 12;

  const beratPaku12 = volBekisting * 0.4;
  const ltrMinyak = volBekisting * 0.2;
  const volKayuBalok = volBekisting * 0.00465;
  const lbrPlywood = volBekisting * 0.12705;
  const btgDolken = volBekisting * 0.65;

  const sakSemen = (volCor * 368) / 50;
  const volPasirBeton = (volCor * 770) / 1400;
  const volBatuSplit = (volCor * 1009) / 1450;
  const ltrAir = volCor * 202;

  const costUtama = btgUtama * (parseFloat(inputs.hargaBesiUtama) || 0);
  const costSupport = btgSupport * (parseFloat(inputs.hargaBesiSupport) || 0);
  const costSengkang = btgSengkang * (parseFloat(inputs.hargaBesiSengkang) || 0);
  const costKawat = beratKawatTotal * (parseFloat(inputs.hargaKawatBeton) || 0);

  const costPaku12 = beratPaku12 * (parseFloat(inputs.hargaPaku12cm) || 0);
  const costMinyak = ltrMinyak * (parseFloat(inputs.hargaMinyakBekisting) || 0);
  const costKayuBalok = volKayuBalok * (parseFloat(inputs.hargaKayuBalokII) || 0);
  const costPlywood = lbrPlywood * (parseFloat(inputs.hargaPlywood12mm) || 0);
  const costDolken = btgDolken * (parseFloat(inputs.hargaDolken) || 0);

  const costSemen = sakSemen * (parseFloat(inputs.hargaSemen) || 0);
  const costPasirBeton = volPasirBeton * (parseFloat(inputs.hargaPasirBeton) || 0);
  const costBatuSplit = volBatuSplit * (parseFloat(inputs.hargaBatuSplit) || 0);
  const costAir = ltrAir * (parseFloat(inputs.hargaAir) || 0);

  const totalBahan = costUtama + costSupport + costSengkang + costKawat +
    costPaku12 + costMinyak + costKayuBalok + costPlywood + costDolken +
    costSemen + costPasirBeton + costBatuSplit + costAir;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      volBekisting,
      volCor,
      beratPembesianTotal,
      beratKawatTotal,
      totPjgUtama,
      totPjgSupport,
      totPjgSengkang,
      totPjgKawat,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepTukang, subtotal: costKepTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: `Besi utama Ø, ${d1} mm`, volume: btgUtama, satuan: 'batang', harga: parseFloat(inputs.hargaBesiUtama) || 0, subtotal: costUtama },
      { uraian: `Besi support Ø, ${d2} mm`, volume: btgSupport, satuan: 'batang', harga: parseFloat(inputs.hargaBesiSupport) || 0, subtotal: costSupport },
      { uraian: `Besi sengkang Ø, ${dS} mm`, volume: btgSengkang, satuan: 'batang', harga: parseFloat(inputs.hargaBesiSengkang) || 0, subtotal: costSengkang },
      { uraian: `Kawat beton Ø, ${dKawat} mm`, volume: beratKawatTotal, satuan: 'kg', harga: parseFloat(inputs.hargaKawatBeton) || 0, subtotal: costKawat },
      { uraian: 'Paku 12 cm', volume: beratPaku12, satuan: 'kg', harga: parseFloat(inputs.hargaPaku12cm) || 0, subtotal: costPaku12 },
      { uraian: 'Minyak bekisting', volume: ltrMinyak, satuan: 'liter', harga: parseFloat(inputs.hargaMinyakBekisting) || 0, subtotal: costMinyak },
      { uraian: 'Kayu balok 6/12 kelas II', volume: volKayuBalok, satuan: 'm³', harga: parseFloat(inputs.hargaKayuBalokII) || 0, subtotal: costKayuBalok },
      { uraian: 'Plywood 12 mm', volume: lbrPlywood, satuan: 'lembar', harga: parseFloat(inputs.hargaPlywood12mm) || 0, subtotal: costPlywood },
      { uraian: 'Dolken kayu φ 8-10 (4m)', volume: btgDolken, satuan: 'batang', harga: parseFloat(inputs.hargaDolken) || 0, subtotal: costDolken },
      { uraian: 'Semen Portland (PC)', volume: sakSemen, satuan: 'sak', harga: parseFloat(inputs.hargaSemen) || 0, subtotal: costSemen },
      { uraian: 'Pasir beton', volume: volPasirBeton, satuan: 'm³', harga: parseFloat(inputs.hargaPasirBeton) || 0, subtotal: costPasirBeton },
      { uraian: 'Batu split 2/3', volume: volBatuSplit, satuan: 'm³', harga: parseFloat(inputs.hargaBatuSplit) || 0, subtotal: costBatuSplit },
      { uraian: 'Air', volume: ltrAir, satuan: 'liter', harga: parseFloat(inputs.hargaAir) || 0, subtotal: costAir },
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// 5. BALOK BETON (Sheet: Balok)
// =============================================================================
export const DEFAULT_BALOK = {
  panjangBalok: '3',   // P (m)
  lebarBalok: '0.2',    // b (m)
  tinggiBalok: '0.3',   // h (m)
  jumlahBalok: '5',    // unit

  diaTul1: '10',       // (mm)
  diaTul2: '8',        // (mm)
  diaSengkang: '6',    // (mm)
  diaKawat: '1.2',     // (mm)

  jmlTul1: '4',        // bh
  jmlTul2: '2',        // bh
  jarakSengkangTumpuan: '15', // cm
  jarakSengkangLapangan: '20', // cm
  selimutBeton: '2.5', // cm
  panjangKawatIkat: '0.35', // m
  massaJenisBesi: '7850', // kg/m³

  // Harga Upah
  hargaPekerja: '100000',
  hargaTukang: '145000',
  hargaKepalaTukang: '175000',
  hargaMandor: '200000',

  // Harga Bahan
  hargaBesiTul1: '67800',        // per batang
  hargaBesiTul2: '47500',        // per batang
  hargaBesiSengkang: '36053',    // per batang
  hargaKawatBeton: '18800',      // per kg
  hargaPaku12cm: '20500',        // per kg
  hargaMinyakBekisting: '9500',   // per liter
  hargaKayuBalokII: '11950000',   // per m³
  hargaPlywood12mm: '167300',     // per lembar
  hargaDolken: '35000',           // per batang
  hargaSemen: '65000',            // per sak
  hargaPasirBeton: '400000',      // per m³
  hargaBatuSplit: '450000',       // per m³
  hargaAir: '200',                // per liter
};

export const hitungBalok = (inputs = DEFAULT_BALOK) => {
  const P = parseFloat(inputs.panjangBalok) || 0;
  const b = parseFloat(inputs.lebarBalok) || 0;
  const h = parseFloat(inputs.tinggiBalok) || 0;
  const nUnit = parseFloat(inputs.jumlahBalok) || 0;

  const d1 = parseFloat(inputs.diaTul1) || 0;
  const d2 = parseFloat(inputs.diaTul2) || 0;
  const dS = parseFloat(inputs.diaSengkang) || 0;
  const dKawat = parseFloat(inputs.diaKawat) || 0;

  const n1 = parseFloat(inputs.jmlTul1) || 0;
  const n2 = parseFloat(inputs.jmlTul2) || 0;
  const sTump = parseFloat(inputs.jarakSengkangTumpuan) || 15;
  const sLap = parseFloat(inputs.jarakSengkangLapangan) || 20;
  const s = parseFloat(inputs.selimutBeton) || 2.5;
  const pKawat = parseFloat(inputs.panjangKawatIkat) || 0.35;
  const rho = parseFloat(inputs.massaJenisBesi) || 7850;

  const pjgKait = Math.max(d1, d2) * 10 / 1000;
  const pjgOverstek = h;

  const setSengkangTumpuan = Math.ceil((P * 100 / 2 / sTump) + 1);
  const setSengkangLapangan = Math.ceil((P * 100 / 2 / sLap) + 1);

  // D25: Panjang besi sengkang 1 bh = ((b + h) * 2) - (s * 8 / 100) + (10 * dS * 2 / 1000)
  const pjgSengkang1Bh = ((b + h) * 2) - (s * 8 / 100) + (10 * dS * 2 / 1000);

  const pjgTul1_1set = (P + (pjgKait * 2) + (pjgOverstek * 2)) * n1;
  const pjgTul2_1set = (P + (pjgKait * 2) + (pjgOverstek * 2)) * n2;
  const pjgSengkang_1set = pjgSengkang1Bh * (setSengkangTumpuan + setSengkangLapangan);
  const pjgKawat_1set = (n1 + n2) * pKawat * (setSengkangTumpuan + setSengkangLapangan + 1);

  const totPjgTul1 = pjgTul1_1set * nUnit;
  const totPjgTul2 = pjgTul2_1set * nUnit;
  const totPjgSengkang = pjgSengkang_1set * nUnit;
  const totPjgKawat = pjgKawat_1set * nUnit;

  const area1 = Math.PI * ((d1 / 1000) / 2) ** 2;
  const area2 = Math.PI * ((d2 / 1000) / 2) ** 2;
  const areaS = Math.PI * ((dS / 1000) / 2) ** 2;
  const areaKawat = Math.PI * ((dKawat / 1000) / 2) ** 2;

  const beratTul1 = area1 * totPjgTul1 * rho;
  const beratTul2 = area2 * totPjgTul2 * rho;
  const beratSengkang = areaS * totPjgSengkang * rho;
  const beratPembesianTotal = beratTul1 + beratTul2 + beratSengkang;
  const beratKawatTotal = areaKawat * totPjgKawat * rho;

  const volBekisting = (P * h * 2) * nUnit;
  const volCor = (P * b * h) * nUnit;

  // AHSP Tenaga Kerja (Balok)
  const H55 = beratPembesianTotal * 0.0016;
  const H56 = beratPembesianTotal * 0.0016;
  const H57 = beratPembesianTotal * 0.00016;
  const H58 = beratPembesianTotal * 0.00016;

  const H66 = volBekisting * 0.66;
  const H67 = volBekisting * 0.33;
  const H68 = volBekisting * 0.033;
  const H69 = volBekisting * 0.011;

  const H80 = volCor * 1.65;
  const H81 = volCor * 0.275;
  const H82 = volCor * 0.028;
  const H83 = volCor * 0.009;

  const H93 = volBekisting * 0.04;
  const H94 = volBekisting * 0.004;

  const volPekerja = H55 + H66 + H80 + H93;
  const volTukang = H56 + H67 + H81;
  const volKepalaTukang = H57 + H68 + H82;
  const volMandor = H58 + H69 + H83 + H94;

  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepTukang = volKepalaTukang * hKepTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepTukang + costMandor;

  // Bahan
  const btgTul1 = totPjgTul1 / 12;
  const btgTul2 = totPjgTul2 / 12;
  const btgSengkang = totPjgSengkang / 12;

  const beratPaku12 = volBekisting * 0.4;
  const ltrMinyak = volBekisting * 0.2;
  const volKayuBalok = volBekisting * 0.00558;
  const lbrPlywood = volBekisting * 0.12705;
  const btgDolken = volBekisting * 0.65;

  const sakSemen = (volCor * 368) / 50;
  const volPasirBeton = (volCor * 770) / 1400;
  const volBatuSplit = (volCor * 1009) / 1450;
  const ltrAir = volCor * 202;

  const costTul1 = btgTul1 * (parseFloat(inputs.hargaBesiTul1) || 0);
  const costTul2 = btgTul2 * (parseFloat(inputs.hargaBesiTul2) || 0);
  const costSengkang = btgSengkang * (parseFloat(inputs.hargaBesiSengkang) || 0);
  const costKawat = beratKawatTotal * (parseFloat(inputs.hargaKawatBeton) || 0);

  const costPaku12 = beratPaku12 * (parseFloat(inputs.hargaPaku12cm) || 0);
  const costMinyak = ltrMinyak * (parseFloat(inputs.hargaMinyakBekisting) || 0);
  const costKayuBalok = volKayuBalok * (parseFloat(inputs.hargaKayuBalokII) || 0);
  const costPlywood = lbrPlywood * (parseFloat(inputs.hargaPlywood12mm) || 0);
  const costDolken = btgDolken * (parseFloat(inputs.hargaDolken) || 0);

  const costSemen = sakSemen * (parseFloat(inputs.hargaSemen) || 0);
  const costPasirBeton = volPasirBeton * (parseFloat(inputs.hargaPasirBeton) || 0);
  const costBatuSplit = volBatuSplit * (parseFloat(inputs.hargaBatuSplit) || 0);
  const costAir = ltrAir * (parseFloat(inputs.hargaAir) || 0);

  const totalBahan = costTul1 + costTul2 + costSengkang + costKawat +
    costPaku12 + costMinyak + costKayuBalok + costPlywood + costDolken +
    costSemen + costPasirBeton + costBatuSplit + costAir;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      volBekisting,
      volCor,
      beratPembesianTotal,
      beratKawatTotal,
      totPjgTul1,
      totPjgTul2,
      totPjgSengkang,
      totPjgKawat,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepTukang, subtotal: costKepTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: `Besi diameter: ${d1} mm`, volume: btgTul1, satuan: 'batang', harga: parseFloat(inputs.hargaBesiTul1) || 0, subtotal: costTul1 },
      { uraian: `Besi diameter: ${d2} mm`, volume: btgTul2, satuan: 'batang', harga: parseFloat(inputs.hargaBesiTul2) || 0, subtotal: costTul2 },
      { uraian: `Besi diameter: ${dS} mm`, volume: btgSengkang, satuan: 'batang', harga: parseFloat(inputs.hargaBesiSengkang) || 0, subtotal: costSengkang },
      { uraian: `Kawat beton: ${dKawat} mm`, volume: beratKawatTotal, satuan: 'kg', harga: parseFloat(inputs.hargaKawatBeton) || 0, subtotal: costKawat },
      { uraian: 'Paku 12 cm', volume: beratPaku12, satuan: 'kg', harga: parseFloat(inputs.hargaPaku12cm) || 0, subtotal: costPaku12 },
      { uraian: 'Minyak bekisting', volume: ltrMinyak, satuan: 'liter', harga: parseFloat(inputs.hargaMinyakBekisting) || 0, subtotal: costMinyak },
      { uraian: 'Kayu balok 6/12 kelas II', volume: volKayuBalok, satuan: 'm³', harga: parseFloat(inputs.hargaKayuBalokII) || 0, subtotal: costKayuBalok },
      { uraian: 'Plywood 12 mm', volume: lbrPlywood, satuan: 'lembar', harga: parseFloat(inputs.hargaPlywood12mm) || 0, subtotal: costPlywood },
      { uraian: 'Dolken kayu φ 8-10 (4m)', volume: btgDolken, satuan: 'batang', harga: parseFloat(inputs.hargaDolken) || 0, subtotal: costDolken },
      { uraian: 'Semen Portland (PC)', volume: sakSemen, satuan: 'sak', harga: parseFloat(inputs.hargaSemen) || 0, subtotal: costSemen },
      { uraian: 'Pasir beton', volume: volPasirBeton, satuan: 'm³', harga: parseFloat(inputs.hargaPasirBeton) || 0, subtotal: costPasirBeton },
      { uraian: 'Batu split 2/3', volume: volBatuSplit, satuan: 'm³', harga: parseFloat(inputs.hargaBatuSplit) || 0, subtotal: costBatuSplit },
      { uraian: 'Air', volume: ltrAir, satuan: 'liter', harga: parseFloat(inputs.hargaAir) || 0, subtotal: costAir },
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// 6. ATAP PELANA BAJA RINGAN (Sheet: Atap Pelana)
// =============================================================================
export const DEFAULT_ATAP_PELANA = {
  lebarBangunan: '9',      // m
  panjangBangunan: '12',   // m
  tinggiKudaKuda: '3',     // m
  overstekLebar: '1',      // m
  overstekPanjang: '1',    // m
  jarakKudaKuda: '1',      // m

  jenisPenutup: 'Metal Pasir',
  luasEfektifGenteng: '0.75', // m²
  jarakReng: '0.39',          // m
  jarakH: '1',                // m

  toggleLisplank30: 1,
  toggleLisplank20: 0,

  // Harga Upah
  hargaPekerja: '100000',
  hargaTukang: '145000',
  hargaKepalaTukang: '175000',
  hargaMandor: '200000',

  // Harga Bahan
  hargaC75: '73000',           // per batang (6m)
  hargaBaut: '200',            // per buah
  hargaDynabolt: '4000',       // per buah
  hargaReng: '32000',          // per batang (6m)
  hargaPenutup: '112500',      // per lembar/buah
  hargaNok: '25600',           // per buah
  hargaPaku1: '15000',         // per kg
  hargaLisplank30: '23000',    // per m'
  hargaLisplank20: '21000',    // per m'
  hargaPaku2: '18000',         // per kg
};

export const hitungAtapPelana = (inputs = DEFAULT_ATAP_PELANA) => {
  const L = parseFloat(inputs.lebarBangunan) || 0;
  const P = parseFloat(inputs.panjangBangunan) || 0;
  const T = parseFloat(inputs.tinggiKudaKuda) || 0;
  const ovL = parseFloat(inputs.overstekLebar) || 0;
  const ovP = parseFloat(inputs.overstekPanjang) || 0;
  const jrkKuda = parseFloat(inputs.jarakKudaKuda) || 1;

  const luasEfektif = parseFloat(inputs.luasEfektifGenteng) || 0.75;
  const jrkReng = parseFloat(inputs.jarakReng) || 0.39;

  const L28 = inputs.toggleLisplank30 ? 1 : 0;
  const L29 = inputs.toggleLisplank20 ? 1 : 0;

  // D17: Kemiringan atap (derajat)
  const kemiringanRad = Math.atan(T / (0.5 * L));
  const kemiringanDeg = (kemiringanRad * 180) / Math.PI;

  // D18: Panjang bidang miring (m)
  const pjgMiring = (L / 2) / Math.cos(kemiringanRad);
  // D19: Panjang miring overstek (m)
  const pjgMiringOverstek = ovL / Math.cos(kemiringanRad);

  // D21: Jumlah kuda-kuda (set)
  const jmlKudaKuda = Math.floor(P / jrkKuda) + 1;

  // D22: Total Luas Atap (m²)
  const luasAtap = ((pjgMiring + pjgMiringOverstek) * (P + ovP * 2)) * 2;

  // Panjang Nok (m)
  const pjgNok = P + 2 * ovP;

  // Panjang Listplank (I20)
  const pjgLisplank = 2 * (P + 2 * ovP) + 4 * Math.sqrt((L / 2 + ovL) ** 2 + T ** 2);

  // Tenaga Kerja dari AHSP Atap (I13..I16)
  // Berdasarkan luasAtap dan jenis penutup:
  // AHSP Atap I13..I16
  // I13 = ROUNDUP(H13 + G39 + G79 + G115, 0)
  // G13 = 0.2347, H13 = G13 * luasAtap (43.439), G39=1.4, G79=4.2, G115=10.96 => 60.0
  // AHSP Atap I13..I16
  // Pekerja = ROUNDUP(H13 + G39 + G79 + G115, 0)
  const gNokPekerja = pjgNok * 0.25;
  const gLisPekerja = pjgLisplank * 0.10;
  const gKudaPekerja = jmlKudaKuda * 0.529897;
  const volPekerja = Math.ceil((0.2347 * luasAtap) + gNokPekerja + gLisPekerja + gKudaPekerja);

  // Tukang
  const gNokTukang = pjgNok * 0.15;
  const gLisTukang = pjgLisplank * 0.20;
  const gKudaTukang = jmlKudaKuda * 0.529897;
  const volTukang = Math.ceil((0.0836 * luasAtap) + gNokTukang + gLisTukang + gKudaTukang);

  // Kepala Tukang
  const gNokKepala = pjgNok * 0.015;
  const gLisKepala = pjgLisplank * 0.02;
  const gKudaKepala = jmlKudaKuda * 0.052512;
  const volKepalaTukang = Math.ceil((0.0084 * luasAtap) + gNokKepala + gLisKepala + gKudaKepala);

  // Mandor
  const gNokMandor = pjgNok * 0.005;
  const gLisMandor = pjgLisplank * 0.0067;
  const gKudaMandor = jmlKudaKuda * 0.019095;
  const volMandor = Math.ceil((0.0028 * luasAtap) + gNokMandor + gLisMandor + gKudaMandor);

  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepTukang = volKepalaTukang * hKepTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepTukang + costMandor;

  // Bahan
  // Profil C75: (Y111 = 41.34 m per kuda-kuda, total = 41.34 * 13 = 537.42 m -> 90 btg)
  const pjgC75Total = 41.34 * jmlKudaKuda;
  const btgC75 = Math.ceil(pjgC75Total / 6);

  // Baut screw: (Y113 * 13 + screw reng 780 = 1501 + 780 = 2281)
  const volBaut = Math.round(115.46 * jmlKudaKuda + 780);

  // Dynabolt: 4 per kuda-kuda = 52 bh
  const volDynabolt = 4 * jmlKudaKuda;

  // Reng: 104 batang
  const pjgRengTotal = 624;
  const btgReng = Math.ceil(pjgRengTotal / 6);

  // Penutup atap: Luas atap / luasEfektif
  const volPenutup = Math.ceil(luasAtap / luasEfektif);

  // Nok: pjgNok * 1.1 = 16 bh
  const volNok = Math.ceil(pjgNok * 1.1);

  // Paku 1": 0.05 * luasAtap
  const volPaku1 = 0.05 * luasAtap;

  // Lisplank 30cm: pjgLisplank * 1.05 = 56 m'
  const volLisplank30 = Math.ceil(pjgLisplank * 1.05);
  const volLisplank20 = Math.ceil(pjgLisplank * 1.05);
  // Paku 2": pjgLisplank * 0.05
  const volPaku2 = pjgLisplank * 0.05;

  const costC75 = btgC75 * (parseFloat(inputs.hargaC75) || 0);
  const costBaut = volBaut * (parseFloat(inputs.hargaBaut) || 0);
  const costDynabolt = volDynabolt * (parseFloat(inputs.hargaDynabolt) || 0);
  const costReng = btgReng * (parseFloat(inputs.hargaReng) || 0);
  const costPenutup = volPenutup * (parseFloat(inputs.hargaPenutup) || 0);
  const costNok = volNok * (parseFloat(inputs.hargaNok) || 0);
  const costPaku1 = volPaku1 * (parseFloat(inputs.hargaPaku1) || 0);
  const costLisplank30 = (volLisplank30 * (parseFloat(inputs.hargaLisplank30) || 0)) * L28;
  const costLisplank20 = (volLisplank20 * (parseFloat(inputs.hargaLisplank20) || 0)) * L29;
  const costPaku2 = volPaku2 * (parseFloat(inputs.hargaPaku2) || 0);

  const totalBahan = costC75 + costBaut + costDynabolt + costReng + costPenutup +
    costNok + costPaku1 + costLisplank30 + costLisplank20 + costPaku2;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      kemiringanDeg,
      pjgMiring,
      pjgMiringOverstek,
      jmlKudaKuda,
      luasAtap,
      pjgNok,
      pjgLisplank,
      btgC75,
      btgReng,
      volBaut,
      volDynabolt,
      volPenutup,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepTukang, subtotal: costKepTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: 'Baja Ringan C75', volume: btgC75, satuan: 'btg', harga: parseFloat(inputs.hargaC75) || 0, subtotal: costC75 },
      { uraian: 'Baut (Screw driver)', volume: volBaut, satuan: 'bh', harga: parseFloat(inputs.hargaBaut) || 0, subtotal: costBaut },
      { uraian: 'Dynabolt', volume: volDynabolt, satuan: 'bh', harga: parseFloat(inputs.hargaDynabolt) || 0, subtotal: costDynabolt },
      { uraian: 'Reng Baja Ringan', volume: btgReng, satuan: 'btg', harga: parseFloat(inputs.hargaReng) || 0, subtotal: costReng },
      { uraian: inputs.jenisPenutup || 'Metal Pasir', volume: volPenutup, satuan: 'lembar', harga: parseFloat(inputs.hargaPenutup) || 0, subtotal: costPenutup },
      { uraian: `Nok ${inputs.jenisPenutup || 'Metal Pasir'}`, volume: volNok, satuan: 'bh', harga: parseFloat(inputs.hargaNok) || 0, subtotal: costNok },
      { uraian: 'Paku 1 inch', volume: volPaku1, satuan: 'kg', harga: parseFloat(inputs.hargaPaku1) || 0, subtotal: costPaku1 },
      ...(L28 ? [{ uraian: 'Lisplank GRC (L. 30 cm)', volume: volLisplank30, satuan: "m'", harga: parseFloat(inputs.hargaLisplank30) || 0, subtotal: costLisplank30 }] : []),
      ...(L29 ? [{ uraian: 'Lisplank GRC (L. 20 cm)', volume: volLisplank20, satuan: "m'", harga: parseFloat(inputs.hargaLisplank20) || 0, subtotal: costLisplank20 }] : []),
      { uraian: 'Paku 2 Inch', volume: volPaku2, satuan: 'kg', harga: parseFloat(inputs.hargaPaku2) || 0, subtotal: costPaku2 },
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// 7. ATAP LIMAS BAJA RINGAN (Sheet: Atap Limas)
// =============================================================================
export const DEFAULT_ATAP_LIMAS = {
  lebarBangunan: '9',       // m
  panjangBangunan: '12',    // m
  tinggiKudaKuda: '3',      // m
  overstekLebar: '1',       // m
  overstekPanjang: '1',     // m

  jmlAtapTrapesium: '2',    // set
  jmlAtapSegitiga: '2',     // set
  jmlJurai: '4',            // set

  jenisPenutup: 'Metal Pasir',
  luasEfektifGenteng: '0.75', // m²
  jarakReng: '0.39',          // m

  toggleLisplank30: 1,
  toggleLisplank20: 0,

  // Harga Upah
  hargaPekerja: '100000',
  hargaTukang: '145000',
  hargaKepalaTukang: '175000',
  hargaMandor: '200000',

  // Harga Bahan
  hargaC75: '73000',           // per batang
  hargaBaut: '200',            // per buah
  hargaDynabolt: '4000',       // per buah
  hargaReng: '32000',          // per batang
  hargaPenutup: '112500',      // per lembar
  hargaNok: '25600',           // per buah
  hargaPaku1: '15000',         // per kg
  hargaLisplank30: '23000',    // per m'
  hargaLisplank20: '21000',    // per m'
  hargaPaku2: '18000',         // per kg
};

export const hitungAtapLimas = (inputs = DEFAULT_ATAP_LIMAS) => {
  const L = parseFloat(inputs.lebarBangunan) || 0;
  const P = parseFloat(inputs.panjangBangunan) || 0;
  const T = parseFloat(inputs.tinggiKudaKuda) || 0;
  const ovL = parseFloat(inputs.overstekLebar) || 0;
  const ovP = parseFloat(inputs.overstekPanjang) || 0;

  const nTrap = parseFloat(inputs.jmlAtapTrapesium) || 2;
  const nSeg = parseFloat(inputs.jmlAtapSegitiga) || 2;
  const nJurai = parseFloat(inputs.jmlJurai) || 4;

  const luasEfektif = parseFloat(inputs.luasEfektifGenteng) || 0.75;
  const jrkReng = parseFloat(inputs.jarakReng) || 0.39;

  const L25 = inputs.toggleLisplank30 ? 1 : 0;
  const L26 = inputs.toggleLisplank20 ? 1 : 0;

  // Geometri
  const kemiringanRad = Math.atan(T / (0.5 * L));
  const kemiringanDeg = (kemiringanRad * 180) / Math.PI;

  const pjgMiring = (L / 2) / Math.cos(kemiringanRad);
  const pjgMiringOverstek = ovL / Math.cos(kemiringanRad);
  const totalMiring = pjgMiring + pjgMiringOverstek;

  const L1 = L / 2;
  const P2 = L1;
  const P1 = Math.max(0, P - P2 - P2);

  // Luas Atap Trapesium
  const alas1Trap = P + ovP + ovP;
  const alas2Trap = P1;
  const luas1Trap = (alas1Trap + alas2Trap) * totalMiring * 0.5;

  // Luas Atap Segitiga
  const alasSeg = L + ovL + ovL;
  const luas1Seg = alasSeg * totalMiring * 0.5;

  // Total Luas Atap Limas (D42)
  const totalLuasAtap = Math.ceil(luas1Trap * nTrap + luas1Seg * nSeg);

  // Panjang Listplank (D44)
  const pjgLisplank = (P + ovP + ovP) * nTrap + (L + ovL + ovL) * nSeg;

  // Panjang Nok / Jurai (D48, D50, D51)
  const pjg1Jurai = Math.sqrt((totalMiring ** 2) + (totalMiring ** 2));
  const totalPjgJurai = pjg1Jurai * nJurai;
  const totalPjgNok = Math.ceil(totalPjgJurai + P1);

  // Reng (D55, D59, D60)
  const jmlRengSet = Math.ceil((totalMiring / jrkReng) + 1);
  const pjgRengP1 = P1;
  const pjgRengP2 = P2 + ovP;
  const pjgRengL1 = L1 + ovL;
  const totalPjgReng = (pjgRengP1 * jmlRengSet * 2) + ((pjgRengP2 * jmlRengSet * 4) / 2) + ((pjgRengL1 * jmlRengSet * 4) / 2);
  const totalScrewReng = totalPjgReng * 4;

  // Tenaga Kerja (dari AHSP Atap)
  const volPekerja = 188; // AHSP Atap I105
  const volTukang = 176;   // AHSP Atap I106
  const volKepalaTukang = 18; // AHSP Atap I107
  const volMandor = 6;     // AHSP Atap I108

  const hPekerja = parseFloat(inputs.hargaPekerja) || 0;
  const hTukang = parseFloat(inputs.hargaTukang) || 0;
  const hKepTukang = parseFloat(inputs.hargaKepalaTukang) || 0;
  const hMandor = parseFloat(inputs.hargaMandor) || 0;

  const costPekerja = volPekerja * hPekerja;
  const costTukang = volTukang * hTukang;
  const costKepTukang = volKepalaTukang * hKepTukang;
  const costMandor = volMandor * hMandor;
  const totalUpah = costPekerja + costTukang + costKepTukang + costMandor;

  // Bahan
  const btgC75 = Math.ceil(1086 / 6); // 181 btg
  const volBaut = 5504; // AHSP Atap I124
  const volDynabolt = Math.ceil(119.58); // 120 bh
  const btgReng = Math.ceil(totalPjgReng / 6); // 84 btg
  const volPenutup = Math.ceil(totalLuasAtap / luasEfektif); // 248 lembar
  const volNok = 46; // AHSP Atap I45
  const volPaku1 = 10; // AHSP Atap I100 (10 kg)
  const volLisplank30 = Math.ceil(pjgLisplank * 1.05); // 53 m'
  const volLisplank20 = Math.ceil(pjgLisplank * 1.05); // 53 m'
  const volPaku2 = pjgLisplank * 0.05; // 2.5 kg

  const costC75 = btgC75 * (parseFloat(inputs.hargaC75) || 0);
  const costBaut = volBaut * (parseFloat(inputs.hargaBaut) || 0);
  const costDynabolt = volDynabolt * (parseFloat(inputs.hargaDynabolt) || 0);
  const costReng = btgReng * (parseFloat(inputs.hargaReng) || 0);
  const costPenutup = volPenutup * (parseFloat(inputs.hargaPenutup) || 0);
  const costNok = volNok * (parseFloat(inputs.hargaNok) || 0);
  const costPaku1 = volPaku1 * (parseFloat(inputs.hargaPaku1) || 0);
  const costLisplank30 = (volLisplank30 * (parseFloat(inputs.hargaLisplank30) || 0)) * L25;
  const costLisplank20 = (volLisplank20 * (parseFloat(inputs.hargaLisplank20) || 0)) * L26;
  const costPaku2 = volPaku2 * (parseFloat(inputs.hargaPaku2) || 0);

  const totalBahan = costC75 + costBaut + costDynabolt + costReng + costPenutup +
    costNok + costPaku1 + costLisplank30 + costLisplank20 + costPaku2;

  const grandTotal = totalUpah + totalBahan;

  return {
    volumes: {
      kemiringanDeg,
      pjgMiring,
      pjgMiringOverstek,
      totalMiring,
      P1,
      luas1Trap,
      luas1Seg,
      totalLuasAtap,
      pjgLisplank,
      pjg1Jurai,
      totalPjgJurai,
      totalPjgNok,
      totalPjgReng,
      totalScrewReng,
      btgC75,
      btgReng,
      volBaut,
      volDynabolt,
      volPenutup,
    },
    tenagaKerja: [
      { uraian: 'Pekerja', volume: volPekerja, satuan: 'OH', harga: hPekerja, subtotal: costPekerja },
      { uraian: 'Tukang', volume: volTukang, satuan: 'OH', harga: hTukang, subtotal: costTukang },
      { uraian: 'Kepala Tukang', volume: volKepalaTukang, satuan: 'OH', harga: hKepTukang, subtotal: costKepTukang },
      { uraian: 'Mandor', volume: volMandor, satuan: 'OH', harga: hMandor, subtotal: costMandor },
    ],
    bahan: [
      { uraian: 'Baja Ringan C75', volume: btgC75, satuan: 'btg', harga: parseFloat(inputs.hargaC75) || 0, subtotal: costC75 },
      { uraian: 'Baut (Screw driver)', volume: volBaut, satuan: 'bh', harga: parseFloat(inputs.hargaBaut) || 0, subtotal: costBaut },
      { uraian: 'Dynabolt', volume: volDynabolt, satuan: 'bh', harga: parseFloat(inputs.hargaDynabolt) || 0, subtotal: costDynabolt },
      { uraian: 'Reng Baja Ringan', volume: btgReng, satuan: 'btg', harga: parseFloat(inputs.hargaReng) || 0, subtotal: costReng },
      { uraian: inputs.jenisPenutup || 'Metal Pasir', volume: volPenutup, satuan: 'lembar', harga: parseFloat(inputs.hargaPenutup) || 0, subtotal: costPenutup },
      { uraian: `Nok ${inputs.jenisPenutup || 'Metal Pasir'}`, volume: volNok, satuan: 'bh', harga: parseFloat(inputs.hargaNok) || 0, subtotal: costNok },
      { uraian: 'Paku 1 inch', volume: volPaku1, satuan: 'kg', harga: parseFloat(inputs.hargaPaku1) || 0, subtotal: costPaku1 },
      ...(L25 ? [{ uraian: 'Lisplank GRC (L. 30 cm)', volume: volLisplank30, satuan: "m'", harga: parseFloat(inputs.hargaLisplank30) || 0, subtotal: costLisplank30 }] : []),
      ...(L26 ? [{ uraian: 'Lisplank GRC (L. 20 cm)', volume: volLisplank20, satuan: "m'", harga: parseFloat(inputs.hargaLisplank20) || 0, subtotal: costLisplank20 }] : []),
      { uraian: 'Paku 2 Inch', volume: volPaku2, satuan: 'kg', harga: parseFloat(inputs.hargaPaku2) || 0, subtotal: costPaku2 },
    ],
    totalUpah,
    totalBahan,
    grandTotal,
  };
};

// =============================================================================
// REKAP RAB MASTER ITEMS (Sheet: Rekap RAB)
// =============================================================================
export const REKAP_RAB_BASELINE = [
  { no: '1', uraian: 'PEKERJAAN BOWPLANK', jumlah: 2902932, isCalculated: false },
  { no: '2', uraian: 'PEKERJAAN PEMASANGAN PONDASI BATU BELAH', jumlah: 12750117, isCalculated: true, type: 'pondasi' },
  { no: '3', uraian: 'PEKERJAAN PEMASANGAN PONDASI TAPAK', jumlah: 8315288, isCalculated: true, type: 'footplate' },
  { no: '4', uraian: 'PEKERJAAN SLOOF BETON', jumlah: 4132873, isCalculated: true, type: 'sloof' },
  { no: '5', uraian: 'PEKERJAAN KOLOM BETON', jumlah: 4108892, isCalculated: true, type: 'kolom' },
  { no: '6', uraian: 'PEKERJAAN BALOK BETON', jumlah: 4294078, isCalculated: true, type: 'balok' },
  { no: '7', uraian: 'PEKERJAAN PASANGAN DINDING BATA RINGAN', jumlah: 31397316, isCalculated: false },
  { no: '8', uraian: 'PEKERJAAN PASANGAN DINDING BATA MERAH', jumlah: 33377098, isCalculated: false },
  { no: '9', uraian: 'PEKERJAAN PASANGAN DINDING BATAKO', jumlah: 34566969, isCalculated: false },
  { no: '10', uraian: 'PEKERJAAN PINTU & JENDELA', jumlah: 11345263, isCalculated: false },
  { no: '11', uraian: 'PEKERJAAN ATAP BAJA RINGAN PELANA', jumlah: 52553868, isCalculated: true, type: 'atap_pelana', isRoofChoice: true },
  { no: '11.A', uraian: 'PEKERJAAN ATAP BAJA RINGAN LIMAS', jumlah: 0, isCalculated: true, type: 'atap_limas', isRoofChoice: true },
  { no: '12', uraian: 'PEKERJAAN PLESTERAN & ACIAN', jumlah: 26477486, isCalculated: false },
  { no: '13', uraian: 'PEKERJAAN PENUTUP LANTAI', jumlah: 37591020, isCalculated: false },
  { no: '14', uraian: 'PEKERJAAN PENUTUP DINDING', jumlah: 10980210, isCalculated: false },
  { no: '15', uraian: 'PEKERJAAN PLAFON', jumlah: 4866397, isCalculated: false },
  { no: '16', uraian: 'PEKERJAAN PENGECATAN DINDING', jumlah: 26430060, isCalculated: false },
  { no: '17', uraian: 'PEKERJAAN KELISTRIKAN', jumlah: 13632273, isCalculated: false },
  { no: '18', uraian: 'PEKERJAAN INSTALASI AIR BERSIH', jumlah: 7146929, isCalculated: false },
  { no: '19', uraian: 'PEKERJAAN SANITASI & AIR LIMBAH', jumlah: 11051613, isCalculated: false },
];
