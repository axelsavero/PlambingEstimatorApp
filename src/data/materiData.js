export const MATERI_CATEGORIES = [
  'Semua',
  'Plambing & Sanitasi',
  'Pekerjaan Pondasi',
  'Pekerjaan Beton',
  'Pekerjaan Tangga & Atap',
  'AHSP & RAB',
  'Time Schedule',
];

export const MATERI_LIST = [
  // 1. PLAMBING - KEMIRINGAN
  {
    id: 'plambing-slope',
    kategori: 'Plambing & Sanitasi',
    judul: 'Prinsip Kemiringan (Slope) Pipa Air Kotor & Bekas',
    ringkasan: 'Standar kemiringan pipa buangan gravitasi agar limbah padat tidak mengendap dan menyumbat saluran.',
    calcRoute: 'SlopeCalc',
    calcTitle: 'Buka Kalkulator Kemiringan Pipa',
    steps: [
      {
        step: 1,
        title: 'Pengukuran Panjang Saluran Pipa (L)',
        desc: 'Ukur total panjang bentangan pipa horizontal dari titik buangan terjauh (misal: kloset/wastafel) menuju septic tank atau saluran kota.',
        rumus: 'L = Panjang pipa (meter)',
      },
      {
        step: 2,
        title: 'Penentuan Persentase Kemiringan (S)',
        desc: 'Pipa diameter < 3" idealnya 2% (turun 2 cm per 1 meter). Pipa diameter ≥ 4" dapat menggunakan 1% - 1.5% sesuai standar SNI 8153:2015.',
        rumus: 'S = 1% s/d 2% (Standar SNI)',
      },
      {
        step: 3,
        title: 'Perhitungan Beda Tinggi (Drop)',
        desc: 'Kalikan panjang pipa dengan persentase kemiringan untuk mengetahui elevasi penurunan dasar pipa (invert level).',
        rumus: 'Beda Tinggi (cm) = L (meter) × S (%)',
      },
    ],
    tips: 'Jangan memasang slope > 4% karena cairan akan mengalir terlalu kencang dan meninggalkan kotoran padat di dasar pipa.',
  },

  // 2. PLAMBING - SEPTIC TANK
  {
    id: 'plambing-septic',
    kategori: 'Plambing & Sanitasi',
    judul: 'Pedoman Penentuan Dimensi Tangki Septik & Resapan',
    ringkasan: 'Perhitungan kapasitas septic tank konvensional dan bidang resapan berdasarkan jumlah pemakai.',
    calcRoute: 'SepticTankCalc',
    calcTitle: 'Buka Kalkulator Dimensi Septic Tank',
    steps: [
      {
        step: 1,
        title: 'Estimasi Jumlah Pemakai (Penghuni)',
        desc: 'Hitung total penghuni tetap rumah/gedung. Untuk rumah tinggal standar biasanya 4 - 6 orang.',
        rumus: 'n = Jumlah jiwa / penghuni',
      },
      {
        step: 2,
        title: 'Kapasitas Volume Basah Minimum',
        desc: 'Berdasarkan SNI 2398:2017, volume ruang basah pengolahan minimum adalah 1.50 m³ dengan waktu tinggal (retensi) 24 - 48 jam.',
        rumus: 'V_basah = max(1.5 m³, n × 0.35 m³)',
      },
      {
        step: 3,
        title: 'Penentuan Dimensi Fisik (P × L × T)',
        desc: 'Dengan kedalaman air efektif 1.5 m dan lebar 1.0 m, panjang ruang tangki septik dapat langsung dihitung.',
        rumus: 'Panjang = V_basah / (1.5 m × 1.0 m) | Tinggi Total = 1.5 m + 0.3 m (freeboard)',
      },
    ],
    tips: 'Jarak septic tank ke sumur air bersih minimal 10 meter untuk mencegah kontaminasi bakteri E. coli.',
  },

  // 3. PLAMBING - UBAP
  {
    id: 'plambing-ubap',
    kategori: 'Plambing & Sanitasi',
    judul: 'Unit Beban Alat Plambing (UBAP / Fixture Units)',
    ringkasan: 'Metode penentuan diameter pipa suplai air bersih dan air buangan berdasarkan akumulasi alat sanitasi.',
    calcRoute: 'FixtureUnitCalc',
    calcTitle: 'Buka Kalkulator UBAP & Pipa',
    steps: [
      {
        step: 1,
        title: 'Inventarisasi Alat Plambing',
        desc: 'Catat semua fixture: kloset flush valve (6 UBAP), kloset tangki (3 UBAP), wastafel (1 UBAP), shower (2 UBAP), floor drain (2 UBAP).',
        rumus: 'Total UBAP = Σ (Jumlah Fixture × Nilai UBAP)',
      },
      {
        step: 2,
        title: 'Pemilihan Pipa Buangan Horizontal',
        desc: 'Cocokkan total UBAP ke tabel SNI 8153:2015. Untuk total s.d 6 UBAP gunakan 2", s.d 32 UBAP gunakan 3", dan > 32 gunakan 4".',
        rumus: 'Tabel SNI 8153:2015',
      },
    ],
    tips: 'Selalu sediakan pipa ven (ventilation pipe) dengan kemiringan minimal 1% naik ke atap untuk mencegah efek sifon pada siphon perangkap air.',
  },

  // 4. PLAMBING - MATERIAL & BIAYA PIPA
  {
    id: 'plambing-rab',
    kategori: 'Plambing & Sanitasi',
    judul: 'Estimasi Kebutuhan Batang Pipa PVC & Biaya (RAB)',
    ringkasan: 'Cara cepat menghitung jumlah batang pipa standar 4 meteran, estimasi fitting, dan kebutuhan lem.',
    calcRoute: 'MaterialEst',
    calcTitle: 'Buka Kalkulator RAB Pipa',
    steps: [
      {
        step: 1,
        title: 'Hitung Total Panjang Jalur Pipa',
        desc: 'Ambil panjang total dari gambar isometrik atau denah perpipaan ditambah safety factor 5% untuk potongan dan lekukan.',
        rumus: 'L_total = L_denah × 1.05',
      },
      {
        step: 2,
        title: 'Hitung Jumlah Batang Pipa',
        desc: 'Pipa PVC standar di Indonesia diproduksi dengan panjang 4 meter per batang. Lakukan pembulatan ke atas.',
        rumus: 'Batang = ceil(L_total / 4 meter)',
      },
      {
        step: 3,
        title: 'Estimasi Fitting & Biaya Sambungan',
        desc: 'Kebutuhan sambungan (knee, tee, socket) diestimasikan rata-rata 1.5 s/d 2 pcs per batang pipa, atau 20% dari total biaya pipa.',
        rumus: 'Biaya Total = (Jumlah Batang × Harga) + Estimasi Biaya Fitting',
      },
    ],
    tips: 'Gunakan lem pipa PVC khusus berstandar pelarut senyawa kimia (solvent cement) dan amplas ujung pipa sebelum dilem.',
  },

  // 5. PONDASI FOOTPLATE (PDF 2)
  {
    id: 'pondasi-footplate',
    kategori: 'Pekerjaan Pondasi',
    judul: 'Perhitungan Volume Pondasi Footplate (Telapak Beton)',
    ringkasan: 'Panduan lengkap galian tanah, urugan pasir, lantai kerja, struktur limas terpancung, dan bekisting footplate.',
    calcRoute: 'VolumeCalc',
    calcTitle: 'Buka Kalkulator Volume Struktur',
    steps: [
      {
        step: 1,
        title: 'Galian Tanah Footplate',
        desc: 'Ukur panjang, lebar, dan kedalaman rencana galian. Kalikan dengan jumlah titik rencana (contoh: 20 titik).',
        rumus: 'Vol Galian = Panjang × Lebar × Kedalaman × Jumlah Titik',
      },
      {
        step: 2,
        title: 'Urugan Pasir & Lantai Kerja',
        desc: 'Pasir urug (tebal 5 cm) dan beton rabat lantai kerja (tebal 5 cm) di bawah footplate.',
        rumus: 'Vol = Panjang × Lebar × Tebal × Jumlah Titik',
      },
      {
        step: 3,
        title: 'Beton Balok & Limas Terpancung',
        desc: 'Struktur telapak terdiri dari balok persegi bawah dan limas terpancung menuju pedestal.',
        rumus: 'Vol Balok = P × L × t | Vol Limas = 1/3 × t × (A1 + A2 + √(A1 × A2))',
      },
      {
        step: 4,
        title: 'Bekisting & Kolom Pendek (Pedestal)',
        desc: 'Bekisting keliling balok footplate dan beton kolom pendek penopang balok sloof.',
        rumus: 'Bekisting = 2 × (P + L) × t × N | Kolom = N × (P × L × T)',
      },
      {
        step: 5,
        title: 'Urugan Tanah Kembali',
        desc: 'Volume galian dikurangi seluruh volume beton dan pasir yang tertanam, dikalikan faktor gembur 1.2.',
        rumus: 'Vol Urug Kembali = (Vol Galian - Vol Tertanam) × 1.2',
      },
    ],
    tips: 'Pastikan tanah dasar dipadatkan sebelum urugan pasir agar tidak terjadi penurunan diferensial pondasi.',
  },

  // 6. PONDASI BATU KALI (PDF 2)
  {
    id: 'pondasi-batu-kali',
    kategori: 'Pekerjaan Pondasi',
    judul: 'Perhitungan Volume Pondasi Batu Kali & Sloof',
    ringkasan: 'Galian tanah, urugan pasir, aanstamping (batu kosong), pasangan batu belah trapesium, dan balok sloof beton.',
    calcRoute: 'VolumeCalc',
    calcTitle: 'Buka Kalkulator Volume Struktur',
    steps: [
      {
        step: 1,
        title: 'Galian Tanah & Urugan Pasir',
        desc: 'Galian memanjang mengikuti denah sloof dinding. Pasir bawah pondasi tebal rata-rata 5-10 cm.',
        rumus: 'Vol Galian = Lebar Galian × Dalam Galian × Panjang Pondasi',
      },
      {
        step: 2,
        title: 'Aanstamping (Batu Kosong)',
        desc: 'Lapisan batu kali yang disusun berdiri tanpa spesi dengan sela pasir (tebal 15-20 cm).',
        rumus: 'Vol Aanstamping = Lebar Bawah × Tebal × Panjang Pondasi',
      },
      {
        step: 3,
        title: 'Pasangan Pondasi Batu Kali (Trapesium)',
        desc: 'Hitung penampang trapesium (lebar bawah + lebar atas) dibagi 2 dikali tinggi pondasi dan panjang.',
        rumus: 'Vol = 1/2 × (Lebar Bawah + Lebar Atas) × Tinggi × Panjang',
      },
      {
        step: 4,
        title: 'Balok Sloof Beton & Bekisting',
        desc: 'Sloof pengikat pondasi (contoh 15/20 cm) dengan 2 sisi bekisting tegak.',
        rumus: 'Vol Sloof = P × L × t | Bekisting = 2 × (Panjang × Tebal Sloof)',
      },
    ],
    tips: 'Perbandingan adukan spesi batu kali yang kedap air adalah 1 Pc : 3 Psr untuk area trasram.',
  },

  // 7. PEKERJAAN BETON (PDF 2)
  {
    id: 'pekerjaan-beton',
    kategori: 'Pekerjaan Beton',
    judul: 'Perhitungan Volume Kolom Induk, Balok, & Plat Lantai',
    ringkasan: 'Metode perhitungan volume beton struktur dan bekisting dengan koreksi pertemuan balok-kolom (kolom tertabrak).',
    calcRoute: 'VolumeCalc',
    calcTitle: 'Buka Kalkulator Volume Beton',
    steps: [
      {
        step: 1,
        title: 'Kolom Induk',
        desc: 'Hitung volume kolom dengan mengalikan luas penampang kolom dengan tinggi bersih lantai ke plafon.',
        rumus: 'Vol Kolom = N × (P × L × T) | Bekisting = N × 2 × (P + L) × T',
      },
      {
        step: 2,
        title: 'Balok Induk & Kolom Tertabrak',
        desc: 'Hitung balok induk, lalu kurangi bagian yang bertabrakan dengan kolom dan tebal plat lantai agar tidak terhitung ganda.',
        rumus: 'Vol Balok Bersih = Vol Balok Induk - Vol Kolom Tertabrak',
      },
      {
        step: 3,
        title: 'Plat Lantai Beton',
        desc: 'Hitung luas lantai dikali tebal plat (misal 12 cm), kemudian kurangi luas lubang tangga (void).',
        rumus: 'Vol Plat = (P × L × Tebal) - Luas Lubang Tangga',
      },
    ],
    tips: 'Selalu periksa selimut beton (concrete cover) minimal 2.5 cm agar tulangan besi tidak mengalami korosi.',
  },

  // 8. TANGGA & ATAP (PDF 2)
  {
    id: 'tangga-atap',
    kategori: 'Pekerjaan Tangga & Atap',
    judul: 'Perhitungan Volume Tangga & Rangka Atap Kuda-Kuda',
    ringkasan: 'Perhitungan plat tangga miring, bordes, anak tangga, serta rangka kayu kuda-kuda, usuk, reng, dan genteng.',
    calcRoute: 'VolumeCalc',
    calcTitle: 'Buka Kalkulator Volume',
    steps: [
      {
        step: 1,
        title: 'Plat Tangga & Bordes',
        desc: 'Panjang plat miring dihitung dengan rumus kemiringan sisi samping / cos(sudut). Ditambah volume bordes datar.',
        rumus: 'Panjang Plat Miring = Sisi Samping / cos(sudut tangga)',
      },
      {
        step: 2,
        title: 'Anak Tangga (Segitiga)',
        desc: 'Volume anak tangga dihitung dari prisma segitiga (1/2 × lebar oprit × tinggi antrede × panjang tangga).',
        rumus: 'Vol Anak Tangga = Jumlah × (1/2 × Lebar × Tinggi × Panjang)',
      },
      {
        step: 3,
        title: 'Rangka Kuda-Kuda & Balok Rangkai',
        desc: 'Kaki kuda-kuda = (2 / sin(kemiringan)) × 2. Balok sokong = (1.25 / cos(kemiringan)) × 2.',
        rumus: 'Vol = Panjang Total Batang × Luas Penampang Balok Kayu',
      },
      {
        step: 4,
        title: 'Usuk, Reng, & Genteng',
        desc: 'Jumlah usuk = ((Panjang Atap / Jarak Usuk) + 1) × Sisi. Volume genteng = Total Luas Bidang Atap.',
        rumus: 'Luas Atap Trapesium = 1/2 × (Alas Atas + Alas Bawah) × Tinggi Miring',
      },
    ],
    tips: 'Gunakan kemiringan genteng keramik minimal 30 derajat untuk mencegah tampias air hujan saat angin kencang.',
  },

  // 9. AHSP & RAB (PDF 2)
  {
    id: 'ahsp-rab',
    kategori: 'AHSP & RAB',
    judul: 'Analisa Harga Satuan Pekerjaan (AHSP) & Penyusunan RAB',
    ringkasan: 'Panduan menyusun koefisien upah dan bahan sesuai permen PUPR hingga rekapitulasi Rencana Anggaran Biaya.',
    calcRoute: 'MaterialEst',
    calcTitle: 'Buka Estimator Biaya RAB',
    steps: [
      {
        step: 1,
        title: 'Identifikasi Item Pekerjaan & Koefisien AHSP',
        desc: 'Pilih analisa AHSP standar kota/kabupaten setempat. Terdapat komponen Upah (pekerja, tukang, mandor) dan Bahan.',
        rumus: 'Harga Satuan = Total Biaya Upah + Total Biaya Bahan',
      },
      {
        step: 2,
        title: 'Perhitungan Biaya Tiap Item (RAB)',
        desc: 'Kalikan volume pekerjaan yang telah dihitung pada langkah sebelumnya dengan harga satuan dari tabel AHSP.',
        rumus: 'Subtotal Biaya Item = Volume Pekerjaan × Harga Satuan AHSP',
      },
      {
        step: 3,
        title: 'Rekapitulasi Total Anggaran',
        desc: 'Jumlahkan seluruh subtotal pekerjaan (Pondasi, Struktur, Plambing, Arsitektur, Atap) untuk mendapatkan total biaya proyek.',
        rumus: 'Total RAB = Σ Subtotal Seluruh Kelompok Pekerjaan',
      },
    ],
    tips: 'Tambahkan Pajak Pertambahan Nilai (PPN 11%) dan biaya tak terduga (contingency 5%) pada penawaran kontrak resmi.',
  },

  // 10. TIME SCHEDULE & KURVA S (PDF 2)
  {
    id: 'time-schedule',
    kategori: 'Time Schedule',
    judul: 'Plotting Tenaga Kerja & Pembuatan Kurva S',
    ringkasan: 'Metode menghitung Orang-Hari (OH) pekerja, alokasi mingguan, perhitungan bobot persentase, dan grafik Kurva S.',
    calcRoute: 'VolumeCalc',
    calcTitle: 'Buka Kalkulator Proyek',
    steps: [
      {
        step: 1,
        title: 'Plotting Tenaga Kerja (OH)',
        desc: 'Gunakan koefisien pekerja dari AHSP dikali volume pekerjaan untuk mendapatkan kebutuhan Orang-Hari (OH).',
        rumus: 'Kebutuhan OH = Koefisien Pekerja × Volume Pekerjaan',
      },
      {
        step: 2,
        title: 'Durasi Pekerjaan Mingguan',
        desc: 'Bagi nilai OH dengan jumlah hari kerja dalam seminggu (misal 6 hari) dan jumlah tenaga kerja yang ditugaskan.',
        rumus: 'Durasi (Minggu) = Kebutuhan OH / (Hari Kerja × Jumlah Tukang)',
      },
      {
        step: 3,
        title: 'Perhitungan Bobot Pekerjaan (%)',
        desc: 'Hitung persentase biaya sub pekerjaan terhadap total keseluruhan anggaran proyek.',
        rumus: 'Bobot (%) = (Biaya Sub Pekerjaan / Total Biaya RAB) × 100%',
      },
      {
        step: 4,
        title: 'Akumulasi & Garis Kurva S',
        desc: 'Bagikan bobot per minggu, lalu akumulasikan setiap minggunya hingga mencapai target 100% di akhir proyek.',
        rumus: 'Akumulasi Minggu-n = Akumulasi Minggu-(n-1) + Rencana Fisik Minggu-n',
      },
    ],
    tips: 'Kurva S yang ideal berbentuk landai di awal (persiapan), curam di tengah (konstruksi fisik utama), dan melandai di akhir (finishing).',
  },
];