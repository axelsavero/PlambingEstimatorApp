// Materi Panduan Teknis — disusun mengikuti MATERI.docx dari klien.
// Struktur: 4 materi utama -> bagian -> topik -> langkah & rumus.
//
// Topik:
//   judul      : nama topik
//   grup       : (opsional) sub-kelompok di dalam bagian, mis. "Pondasi Foot Plate"
//   langkah    : urutan langkah pengerjaan (dari dokumen klien)
//   rumus      : daftar persamaan { label, latex, teks }
//   catatan    : (opsional) catatan tambahan
//   kalkulator : (opsional) { route, label } untuk membuka kalkulator terkait

export const MATERI = [
  // ===========================================================================
  // 1. PERHITUNGAN VOLUME PEKERJAAN
  // ===========================================================================
  {
    id: 'volume',
    judul: 'Perhitungan Volume Pekerjaan',
    singkat: 'Volume',
    icon: 'cube-outline',
    deskripsi: 'Pondasi, beton, tangga & atap',
    bagian: [
      {
        id: 'pondasi',
        judul: 'Pekerjaan Pondasi',
        topik: [
          // --- Pondasi Foot Plate ---
          {
            id: 'fp-galian',
            grup: 'Pondasi Foot Plate',
            judul: 'Galian Tanah Foot Plate',
            langkah: [
              'Ukur panjang, lebar, dan kedalaman galian, serta banyaknya titik rencana pondasi foot plate.',
              'Hitung volume galian satu titik dengan rumus panjang × lebar × kedalaman.',
              'Kalikan hasilnya dengan jumlah titik rencana pondasi foot plate (contoh: 20 titik).',
              'Volume galian tanah pondasi foot plate telah terhitung.',
            ],
            rumus: [
              {
                label: 'Volume galian',
                latex: String.raw`V_{galian} = P \times L \times D \times n`,
                teks: 'Panjang × Lebar × Kedalaman × Jumlah titik',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },
          {
            id: 'fp-urugan-pasir',
            grup: 'Pondasi Foot Plate',
            judul: 'Urugan Pasir Bawah Foot Plate',
            langkah: [
              'Ukur panjang, lebar, dan ketebalan urugan pasir, serta banyaknya titik rencana pondasi foot plate.',
              'Hitung volume urugan pasir satu titik dengan rumus panjang × lebar × ketebalan.',
              'Kalikan hasilnya dengan jumlah titik rencana pondasi foot plate (contoh: 20 titik).',
              'Volume urugan pasir bawah pondasi foot plate telah terhitung.',
            ],
            rumus: [
              {
                label: 'Volume urugan pasir',
                latex: String.raw`V_{pasir} = P \times L \times t \times n`,
                teks: 'Panjang × Lebar × Tebal × Jumlah titik',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },
          {
            id: 'fp-lantai-kerja',
            grup: 'Pondasi Foot Plate',
            judul: 'Lantai Kerja Foot Plate',
            langkah: [
              'Termasuk pekerjaan beton non struktur.',
              'Ukur panjang, lebar, dan ketebalan lantai kerja, serta banyaknya titik rencana pondasi foot plate.',
              'Hitung volume lantai kerja satu titik dengan rumus panjang × lebar × ketebalan.',
              'Kalikan hasilnya dengan jumlah titik rencana pondasi foot plate (contoh: 20 titik).',
              'Volume lantai kerja pondasi foot plate telah terhitung.',
            ],
            rumus: [
              {
                label: 'Volume lantai kerja',
                latex: String.raw`V_{lk} = P \times L \times t \times n`,
                teks: 'Panjang × Lebar × Tebal × Jumlah titik',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },
          {
            id: 'fp-footplate',
            grup: 'Pondasi Foot Plate',
            judul: 'Struktur Foot Plate',
            langkah: [
              'Termasuk pekerjaan beton struktur. Ukur kebutuhan data: jumlah foot plate, lebar penampang bawah, lebar penampang atas, kedalaman balok, dan kedalaman limas terpancung.',
              'Hitung volume balok foot plate dengan rumus panjang × lebar × tebal, lalu kalikan dengan jumlah foot plate (contoh: 20).',
              'Hitung volume limas terpancung dengan rumus ⅓ × tinggi × (luas alas + luas atas + √(luas alas × luas atas)), lalu kalikan dengan jumlah foot plate.',
              'Jumlahkan volume balok foot plate dan volume limas terpancung.',
              'Volume foot plate telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume balok foot plate',
                latex: String.raw`V_{balok} = P \times L \times t \times n`,
                teks: 'Panjang × Lebar × Tebal × Jumlah foot plate',
              },
              {
                label: 'Volume limas terpancung',
                latex: String.raw`V_{limas} = \frac{1}{3}\, h \left(A_1 + A_2 + \sqrt{A_1 A_2}\right) \times n`,
                teks: '⅓ × Tinggi × (Luas alas + Luas atas + √(Luas alas × Luas atas)) × Jumlah foot plate',
              },
              {
                label: 'Volume foot plate',
                latex: String.raw`V_{FP} = V_{balok} + V_{limas}`,
                teks: 'Volume balok + Volume limas terpancung',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },
          {
            id: 'fp-bekisting',
            grup: 'Pondasi Foot Plate',
            judul: 'Bekisting Foot Plate',
            langkah: [
              'Ukur kebutuhan bekisting foot plate: jumlah foot plate, panjang, dan tebal bekisting.',
              'Hitung dengan rumus 2 × (panjang × tebal) × banyak foot plate.',
              'Volume kebutuhan bekisting foot plate telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume bekisting',
                latex: String.raw`V_{bek} = 2 \times (P \times t) \times n`,
                teks: '2 × (Panjang × Tebal) × Banyak foot plate',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },
          {
            id: 'fp-kolom-pendek',
            grup: 'Pondasi Foot Plate',
            judul: 'Kolom Pendek Foot Plate',
            langkah: [
              'Ukur kebutuhan kolom pendek: kedalaman, lebar kolom, panjang kolom, dan jumlah foot plate.',
              'Hitung dengan rumus banyak foot plate × (kedalaman × panjang kolom × lebar kolom).',
              'Volume kolom pendek foot plate telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume kolom pendek',
                latex: String.raw`V_{kp} = n \times (D \times P_k \times L_k)`,
                teks: 'Jumlah foot plate × (Kedalaman × Panjang kolom × Lebar kolom)',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },
          {
            id: 'fp-urugan-kembali',
            grup: 'Pondasi Foot Plate',
            judul: 'Urugan Tanah Kembali Foot Plate',
            langkah: [
              'Kumpulkan data volume galian tanah foot plate, total volume foot plate, dan total volume kolom pendek foot plate.',
              'Kurangi volume galian dengan (total volume foot plate + total volume kolom pendek), lalu kalikan 1,2.',
              'Volume urugan tanah kembali pondasi foot plate telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume urugan kembali',
                latex: String.raw`V_{urug} = \left[V_{galian} - (V_{FP} + V_{kp})\right] \times 1{,}2`,
                teks: '(Volume galian − (Volume foot plate + Volume kolom pendek)) × 1,2',
              },
            ],
            kalkulator: { route: 'FootPlateScreen', label: 'Kalkulator Foot Plate' },
          },

          // --- Pondasi Batu Kali ---
          {
            id: 'bk-galian',
            grup: 'Pondasi Batu Kali',
            judul: 'Galian Tanah Batu Kali',
            langkah: [
              'Ukur panjang pondasi batu kali, lebar atas dan lebar bawah galian, serta kedalaman rencana galian.',
              'Jika dinding galian dibuat miring, penampangnya berbentuk trapesium sehingga lebar yang dipakai adalah rata-rata lebar atas dan bawah. Jika tegak, lebar atas = lebar bawah.',
              'Hitung dengan rumus ½ × (lebar atas + lebar bawah) × dalam galian × panjang pondasi batu kali.',
              'Volume galian tanah pondasi batu kali telah terhitung.',
            ],
            rumus: [
              {
                label: 'Volume galian',
                latex: String.raw`V_{galian} = \tfrac{1}{2}(L_{atas} + L_{bawah}) \times D_{galian} \times P_{pondasi}`,
                teks: '½ × (Lebar atas + Lebar bawah) × Dalam galian × Panjang pondasi',
              },
            ],
            kalkulator: { route: 'PondasiScreen', label: 'Kalkulator Pondasi Batu Kali' },
          },
          {
            id: 'bk-urugan-pasir',
            grup: 'Pondasi Batu Kali',
            judul: 'Urugan Pasir Bawah Batu Kali',
            langkah: [
              'Ukur panjang pondasi batu kali, lebar, dan ketebalan rencana urugan pasir.',
              'Hitung dengan rumus lebar × ketebalan × panjang pondasi batu kali.',
              'Volume urugan pasir bawah pondasi batu kali telah terhitung.',
            ],
            rumus: [
              {
                label: 'Volume urugan pasir',
                latex: String.raw`V_{pasir} = L \times t \times P_{pondasi}`,
                teks: 'Lebar × Tebal × Panjang pondasi',
              },
            ],
            kalkulator: { route: 'PondasiScreen', label: 'Kalkulator Pondasi Batu Kali' },
          },
          {
            id: 'bk-aanstamping',
            grup: 'Pondasi Batu Kali',
            judul: 'Aanstamping Batu Kali',
            langkah: [
              'Ukur panjang pondasi batu kali, lebar, dan kedalaman aanstamping.',
              'Hitung dengan rumus lebar × kedalaman × panjang pondasi batu kali.',
              'Volume aanstamping pondasi batu kali telah terhitung.',
            ],
            rumus: [
              {
                label: 'Volume aanstamping',
                latex: String.raw`V_{aan} = L \times D \times P_{pondasi}`,
                teks: 'Lebar × Kedalaman × Panjang pondasi',
              },
            ],
            kalkulator: { route: 'PondasiScreen', label: 'Kalkulator Pondasi Batu Kali' },
          },
          {
            id: 'bk-pasangan',
            grup: 'Pondasi Batu Kali',
            judul: 'Pasangan Pondasi Batu Kali',
            langkah: [
              'Ukur lebar penampang bawah, lebar penampang atas, kedalaman pondasi, panjang pondasi, dan volume kolom pendek.',
              'Hitung luas penampang trapesium: ½ × (lebar bawah + lebar atas) × kedalaman pondasi.',
              'Kalikan luas penampang dengan panjang pondasi batu kali, lalu kurangi dengan volume kolom pendek.',
              'Volume pasangan pondasi batu kali telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume pasangan',
                latex: String.raw`V_{psg} = \left[\tfrac{1}{2}(L_{bawah} + L_{atas}) \times D\right] \times P - V_{kp}`,
                teks: '(½ × (Lebar bawah + Lebar atas) × Kedalaman) × Panjang − Volume kolom pendek',
              },
            ],
            kalkulator: { route: 'PondasiScreen', label: 'Kalkulator Pondasi Batu Kali' },
          },
          {
            id: 'bk-sloof',
            grup: 'Pondasi Batu Kali',
            judul: 'Balok Sloof',
            langkah: [
              'Ukur lebar, tebal, dan panjang balok sloof.',
              'Hitung dengan rumus panjang sloof × (lebar × tebal).',
              'Volume balok sloof pondasi batu kali telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume sloof',
                latex: String.raw`V_{sloof} = P_{sloof} \times (b \times h)`,
                teks: 'Panjang sloof × (Lebar × Tebal)',
              },
            ],
            kalkulator: { route: 'SloofScreen', label: 'Kalkulator Sloof' },
          },
          {
            id: 'bk-bekisting-sloof',
            grup: 'Pondasi Batu Kali',
            judul: 'Bekisting Balok Sloof',
            langkah: [
              'Kumpulkan data panjang sloof dan tinggi sloof (tinggi bidang bekisting).',
              'Bekisting sloof hanya dipasang di kedua sisi samping, karena bagian bawah sloof bertumpu pada pondasi.',
              'Hitung dengan rumus 2 × (panjang sloof × tinggi sloof).',
              'Luas bekisting balok sloof pondasi batu kali telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Luas bekisting sloof',
                latex: String.raw`A_{bek} = 2 \times (P_{sloof} \times h_{sloof})`,
                teks: '2 × (Panjang sloof × Tinggi sloof)',
              },
            ],
            kalkulator: { route: 'SloofScreen', label: 'Kalkulator Sloof' },
          },
        ],
      },

      {
        id: 'beton',
        judul: 'Pekerjaan Beton',
        topik: [
          {
            id: 'kolom-induk',
            judul: 'Kolom Induk',
            langkah: [
              'Kumpulkan data jumlah kolom, panjang kolom, lebar kolom, dan tinggi kolom.',
              'Hitung dengan rumus jumlah kolom × (panjang × lebar × tinggi kolom).',
              'Volume kolom telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume kolom',
                latex: String.raw`V_{kolom} = n \times (P \times L \times T)`,
                teks: 'Jumlah kolom × (Panjang × Lebar × Tinggi)',
              },
            ],
            kalkulator: { route: 'KolomScreen', label: 'Kalkulator Kolom' },
          },
          {
            id: 'bekisting-kolom',
            judul: 'Bekisting Kolom Induk',
            langkah: [
              'Kumpulkan data jumlah kolom, tinggi kolom, dan lebar kolom.',
              'Hitung dengan rumus (2 × (tinggi kolom × lebar kolom)) × jumlah kolom.',
              'Volume bekisting kolom telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume bekisting kolom',
                latex: String.raw`V_{bek} = \left[2 \times (T \times L)\right] \times n`,
                teks: '(2 × (Tinggi kolom × Lebar kolom)) × Jumlah kolom',
              },
            ],
            kalkulator: { route: 'KolomScreen', label: 'Kalkulator Kolom' },
          },
          {
            id: 'balok',
            judul: 'Balok',
            langkah: [
              'Kumpulkan data jumlah kolom induk, panjang balok, lebar balok, tinggi balok, lebar kolom induk, dan tebal plat.',
              'Hitung dahulu volume kolom tertabrak: jumlah kolom induk × (lebar balok × (tinggi balok − tebal plat) × lebar kolom induk).',
              'Hitung volume balok induk: panjang balok × lebar balok × (tinggi balok − tebal plat).',
              'Kurangi volume balok induk dengan volume kolom tertabrak.',
              'Volume balok telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume kolom tertabrak',
                latex: String.raw`V_{kt} = n_k \times b \times (h - t_p) \times L_k`,
                teks: 'Jumlah kolom × (Lebar balok × (Tinggi balok − Tebal plat) × Lebar kolom)',
              },
              {
                label: 'Volume balok induk',
                latex: String.raw`V_{bi} = P \times b \times (h - t_p)`,
                teks: 'Panjang × Lebar balok × (Tinggi balok − Tebal plat)',
              },
              {
                label: 'Volume balok',
                latex: String.raw`V_{balok} = V_{bi} - V_{kt}`,
                teks: 'Volume balok induk − Volume kolom tertabrak',
              },
            ],
            kalkulator: { route: 'BalokScreen', label: 'Kalkulator Balok' },
          },
          {
            id: 'bekisting-balok',
            judul: 'Bekisting Balok',
            langkah: [
              'Kumpulkan data panjang balok dan lebar balok.',
              'Hitung dengan rumus 2 × (panjang balok × lebar balok).',
              'Volume bekisting balok telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume bekisting balok',
                latex: String.raw`V_{bek} = 2 \times (P \times L)`,
                teks: '2 × (Panjang balok × Lebar balok)',
              },
            ],
            kalkulator: { route: 'BalokScreen', label: 'Kalkulator Balok' },
          },
          {
            id: 'plat-lantai',
            judul: 'Plat Lantai',
            langkah: [
              'Kumpulkan data tebal plat lantai, panjang, lebar, dan luas lubang tangga.',
              'Kurangi luas plat dengan luas lubang tangga, lalu kalikan dengan tebal plat.',
              'Volume plat lantai telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume plat lantai',
                latex: String.raw`V_{plat} = (P \times L - A_{lubang}) \times t`,
                teks: '(Panjang × Lebar − Luas lubang tangga) × Tebal plat',
              },
            ],
            catatan: 'Koreksi dari dokumen awal: volume (m³) tidak bisa dikurangi luas (m²). Luas lubang tangga harus dikalikan tebal plat terlebih dahulu.',
          },
          {
            id: 'bekisting-plat',
            judul: 'Bekisting Plat Lantai',
            langkah: [
              'Kumpulkan data tebal plat lantai, panjang, lebar, dan luas lubang tangga.',
              'Hitung bekisting dasar (bagian bawah plat): panjang × lebar − luas lubang tangga.',
              'Hitung bekisting tepi (sekeliling plat): 2 × ((panjang × tebal) + (lebar × tebal)).',
              'Jumlahkan bekisting dasar dan bekisting tepi.',
            ],
            rumus: [
              {
                label: 'Bekisting dasar',
                latex: String.raw`A_{dasar} = P \times L - A_{lubang}`,
                teks: 'Panjang × Lebar − Luas lubang tangga',
              },
              {
                label: 'Bekisting tepi',
                latex: String.raw`A_{tepi} = 2 \times \left[(P \times t) + (L \times t)\right]`,
                teks: '2 × ((Panjang × Tebal) + (Lebar × Tebal))',
              },
              {
                label: 'Luas bekisting plat',
                latex: String.raw`A_{bek} = A_{dasar} + A_{tepi}`,
                teks: 'Bekisting dasar + Bekisting tepi',
              },
            ],
            catatan: 'Koreksi dari dokumen awal: rumus lama hanya menghitung bekisting tepi plat. Bagian terbesar bekisting plat justru bidang bawahnya (panjang × lebar dikurangi lubang tangga).',
          },
        ],
      },

      {
        id: 'tangga',
        judul: 'Pekerjaan Tangga',
        topik: [
          {
            id: 'plat-tangga',
            judul: 'Plat Tangga',
            langkah: [
              'Kumpulkan data tebal plat tangga, panjang sisi samping, sudut tangga bawah, tinggi tangga atas, lebar tangga, serta ukuran bordes.',
              'Hitung panjang plat tangga bawah: panjang sisi samping ÷ cos (sudut tangga bawah).',
              'Hitung panjang plat tangga atas: √(tinggi tangga atas² + panjang sisi samping²). Pada contoh, tinggi tangga atas = 2 m.',
              'Hitung volume plat tangga bawah dan atas: panjang plat × lebar tangga × tebal plat tangga.',
              'Hitung volume plat bordes: tebal bordes × lebar bordes × panjang bordes.',
              'Jumlahkan volume plat tangga bawah, plat tangga atas, dan plat bordes.',
            ],
            rumus: [
              {
                label: 'Panjang plat bawah',
                latex: String.raw`P_{bawah} = \frac{P_{samping}}{\cos \theta}`,
                teks: 'Panjang sisi samping ÷ cos(sudut tangga bawah)',
              },
              {
                label: 'Panjang plat atas',
                latex: String.raw`P_{atas} = \sqrt{H^2 + P_{samping}^2}`,
                teks: '√(Tinggi tangga atas² + Panjang sisi samping²)',
              },
              {
                label: 'Volume plat tangga',
                latex: String.raw`V = (P_{bawah} + P_{atas}) \times L \times t + (t_b \times L_b \times P_b)`,
                teks: '(P bawah + P atas) × Lebar tangga × Tebal + Volume bordes',
              },
            ],
          },
          {
            id: 'bekisting-tangga',
            judul: 'Bekisting Plat Tangga',
            langkah: [
              'Kumpulkan data panjang plat, panjang bordes, dan tebal bekisting.',
              'Hitung dengan rumus 2 × (panjang plat + panjang bordes) × tebal bekisting.',
              'Volume bekisting plat tangga telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Volume bekisting plat tangga',
                latex: String.raw`V_{bek} = 2 \times (P_{plat} + P_{bordes}) \times t_{bek}`,
                teks: '2 × (Panjang plat + Panjang bordes) × Tebal bekisting',
              },
            ],
          },
          {
            id: 'anak-tangga',
            judul: 'Anak Tangga',
            langkah: [
              'Kumpulkan data jumlah anak tangga, serta lebar, panjang, dan tinggi anak tangga.',
              'Hitung dengan rumus jumlah anak tangga × (½ × lebar × panjang × tinggi anak tangga).',
              'Jumlahkan volume anak tangga dengan volume plat tangga.',
              'Volume tangga total telah diketahui.',
            ],
            rumus: [
              {
                label: 'Volume anak tangga',
                latex: String.raw`V_{anak} = n \times \left(\tfrac{1}{2} \times a \times p \times t\right)`,
                teks: 'Jumlah anak tangga × (½ × Lebar × Panjang × Tinggi)',
              },
              {
                label: 'Volume tangga total',
                latex: String.raw`V_{total} = V_{plat} + V_{anak}`,
                teks: 'Volume plat tangga + Volume anak tangga',
              },
            ],
          },
        ],
      },

      {
        id: 'atap',
        judul: 'Pekerjaan Atap',
        topik: [
          {
            id: 'kuda-kuda',
            judul: 'Rangka Kuda-Kuda Kayu',
            langkah: [
              'Kumpulkan data balok tarik, balok pengunci, balok gapit, tiang kuda-kuda, balok sokong, dan kaki kuda-kuda.',
              'Hitung kaki kuda-kuda: (tinggi ÷ sin(sudut kemiringan)) × 2. Pada contoh, tinggi = 2 m.',
              'Hitung balok sokong: (bentang sokong ÷ cos(sudut kemiringan)) × 2. Pada contoh, bentang sokong = 1,25 m.',
              'Jumlahkan seluruh batang untuk mendapatkan panjang total rangka kuda-kuda.',
              'Hitung volume: panjang total × luas penampang balok kayu yang digunakan.',
            ],
            rumus: [
              {
                label: 'Kaki kuda-kuda',
                latex: String.raw`L_{kaki} = \frac{H}{\sin \alpha} \times 2`,
                teks: '(Tinggi ÷ sin(sudut)) × 2',
              },
              {
                label: 'Balok sokong',
                latex: String.raw`L_{sokong} = \frac{B}{\cos \alpha} \times 2`,
                teks: '(Bentang sokong ÷ cos(sudut)) × 2',
              },
              {
                label: 'Volume kuda-kuda',
                latex: String.raw`V = \textstyle\sum L_{batang} \times A_{kayu}`,
                teks: 'Panjang total × Luas penampang kayu',
              },
            ],
            kalkulator: { route: 'AtapPelanaScreen', label: 'Kalkulator Atap Pelana' },
          },
          {
            id: 'balok-rangkai',
            judul: 'Balok Rangkai Kuda-Kuda',
            langkah: [
              'Kumpulkan data balok tembok, balok gording, nok, papan ruiter, jurai luar, jurai dalam, dan balok penyangga.',
              'Hitung jurai terlebih dahulu dengan rumus √((½ × 3,5 × tan(θ))² + (½ × 3,5)²), dengan θ = sudut kemiringan atap dan 3,5 = panjang jurai (m).',
              'Hasil perhitungan tersebut merupakan nilai jurai dalam. Untuk jurai luar, kalikan hasilnya dengan 2.',
              'Jumlahkan semua data panjang balok rangka kuda-kuda, termasuk kaki kuda-kuda, balok sokong, jurai dalam, dan jurai luar. Hasilnya adalah panjang total.',
              'Hitung volume dengan rumus panjang total × luas balok kayu yang digunakan.',
              'Volume balok rangka kuda-kuda telah diketahui.',
            ],
            rumus: [
              {
                label: 'Jurai dalam',
                latex: String.raw`L_{jurai\ dalam} = \sqrt{\left(\tfrac{1}{2} \times 3{,}5 \times \tan\theta\right)^2 + \left(\tfrac{1}{2} \times 3{,}5\right)^2}`,
                teks: '√((½ × 3,5 × tan(θ))² + (½ × 3,5)²)',
              },
              {
                label: 'Jurai luar',
                latex: String.raw`L_{jurai\ luar} = L_{jurai\ dalam} \times 2`,
                teks: 'Jurai dalam × 2',
              },
              {
                label: 'Panjang total',
                latex: String.raw`P_{total} = \textstyle\sum \text{Kaki} + \sum \text{Sokong} + \sum \text{Jurai dalam} + \sum \text{Jurai luar}`,
                teks: 'Σ Kaki kuda-kuda + Σ Balok sokong + Σ Jurai dalam + Σ Jurai luar',
              },
              {
                label: 'Volume balok rangka kuda-kuda',
                latex: String.raw`V = P_{total} \times A_{kayu}`,
                teks: 'Panjang total × Luas balok kayu',
              },
            ],
            kalkulator: { route: 'AtapLimasScreen', label: 'Kalkulator Atap Limas' },
          },
          {
            id: 'usuk',
            judul: 'Usuk',
            langkah: [
              'Kumpulkan data panjang atap, jarak usuk, dan jumlah sisi.',
              'Hitung dengan rumus ((panjang atap ÷ jarak usuk) + 1) × jumlah sisi.',
              'Volume pekerjaan usuk telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Jumlah usuk',
                latex: String.raw`N_{usuk} = \left(\frac{P_{atap}}{j_{usuk}} + 1\right) \times S`,
                teks: '((Panjang atap ÷ Jarak usuk) + 1) × Jumlah sisi',
              },
            ],
            kalkulator: { route: 'AtapPelanaScreen', label: 'Kalkulator Atap Pelana' },
          },
          {
            id: 'reng',
            judul: 'Reng',
            langkah: [
              'Kumpulkan data panjang usuk, jarak reng, panjang atap, dan jumlah sisi.',
              'Hitung dengan rumus ((panjang usuk ÷ jarak reng) + 1) × panjang atap × jumlah sisi.',
              'Volume pekerjaan reng telah ditemukan.',
            ],
            rumus: [
              {
                label: 'Panjang reng',
                latex: String.raw`L_{reng} = \left(\frac{P_{usuk}}{j_{reng}} + 1\right) \times P_{atap} \times S`,
                teks: '((Panjang usuk ÷ Jarak reng) + 1) × Panjang atap × Jumlah sisi',
              },
            ],
            kalkulator: { route: 'AtapPelanaScreen', label: 'Kalkulator Atap Pelana' },
          },
          {
            id: 'luas-atap',
            judul: 'Luas Atap',
            langkah: [
              'Atap model hip and valley memiliki banyak bentuk, sehingga rumus luasnya pun beragam: trapesium, jajargenjang, dan segitiga.',
              'Bagi tampak atas atap menjadi beberapa bagian agar mudah dihitung.',
              'Hitung luas bagian trapesium: ½ × (alas atas + alas bawah) × tinggi.',
              'Hitung luas bagian jajargenjang: panjang alas × tinggi.',
              'Hitung luas bagian segitiga: ½ × alas × tinggi.',
              'Jumlahkan seluruh bagian untuk mendapatkan luas total atap.',
            ],
            rumus: [
              {
                label: 'Trapesium',
                latex: String.raw`A_1 = \tfrac{1}{2}(a + b) \times t`,
                teks: '½ × (Alas atas + Alas bawah) × Tinggi',
              },
              {
                label: 'Jajargenjang',
                latex: String.raw`A_2 = a \times t`,
                teks: 'Panjang alas × Tinggi',
              },
              {
                label: 'Segitiga',
                latex: String.raw`A_3 = \tfrac{1}{2} \times a \times t`,
                teks: '½ × Alas × Tinggi',
              },
              {
                label: 'Luas total atap',
                latex: String.raw`A_{atap} = \textstyle\sum (A_1 + A_2 + A_3)`,
                teks: 'Jumlah seluruh bagian atap',
              },
            ],
            kalkulator: { route: 'AtapLimasScreen', label: 'Kalkulator Atap Limas' },
          },
          {
            id: 'genteng',
            judul: 'Genteng',
            langkah: [
              'Volume penutup atap berupa genteng diambil dari luas total atap.',
              'Luas total atap = kebutuhan total genteng (dalam m²).',
              'Untuk jumlah buah/lembar, kalikan luas atap dengan kebutuhan genteng per m² sesuai jenis genteng.',
            ],
            rumus: [
              {
                label: 'Kebutuhan genteng',
                latex: String.raw`V_{genteng} = A_{atap}`,
                teks: 'Luas total atap',
              },
            ],
            kalkulator: { route: 'AtapLimasScreen', label: 'Kalkulator Atap Limas' },
          },
          {
            id: 'wuwung',
            judul: 'Genteng Penutup Wuwung',
            langkah: [
              'Kebutuhan genteng penutup wuwung diambil dari panjang jurai luar yang telah dihitung sebelumnya (m).',
              'Panjang jurai luar = kebutuhan genteng penutup wuwung.',
              'Kebutuhan genteng penutup wuwung telah diketahui.',
            ],
            rumus: [
              {
                label: 'Kebutuhan genteng penutup wuwung',
                latex: String.raw`\text{Kebutuhan wuwung} = L_{jurai\ luar}`,
                teks: 'Panjang jurai luar',
              },
            ],
            kalkulator: { route: 'AtapLimasScreen', label: 'Kalkulator Atap Limas' },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. ANALISA HARGA SATUAN PEKERJAAN (AHSP)
  // ===========================================================================
  {
    id: 'ahsp',
    judul: 'Analisa Harga Satuan Pekerjaan',
    singkat: 'AHSP',
    icon: 'pricetags-outline',
    deskripsi: 'Upah & bahan per satuan pekerjaan',
    bagian: [
      {
        id: 'ahsp',
        judul: 'Analisa Harga Satuan Pekerjaan',
        topik: [
          {
            id: 'ahsp',
            judul: 'Analisa Harga Satuan Pekerjaan',
            langkah: [
              'Siapkan file AHSP (softfile maupun hardfile) yang sesuai dengan kota atau kabupaten lokasi bangunan.',
              'Catat pekerjaan apa saja yang ada pada pembangunan, seperti pembersihan lahan, pemasangan bowplank, galian tanah, dan lainnya.',
              'Cari setiap pekerjaan tersebut pada file AHSP, lalu masukkan nominal harga satuan, upah, maupun bahan sesuai yang tercantum.',
              'Tidak semua pekerjaan memerlukan bahan dan upah. Ada yang hanya memerlukan upah saja, contohnya pembersihan lokasi.',
              'Contoh pembersihan lahan: pada AHSP terdapat harga satuan dan upah pekerja serta mandor. Jumlahkan bagian upahnya saja.',
              'Contoh pemasangan bowplank: pada AHSP terdapat harga satuan, upah, dan bahan. Masukkan semua harga sesuai file AHSP, lalu jumlahkan upah dan bahannya.',
              'Harga pekerjaan pemasangan bowplank = jumlah upah + jumlah bahan.',
              'Lanjutkan langkah yang sama untuk pekerjaan lainnya.',
            ],
            rumus: [
              {
                label: 'Pekerjaan upah saja',
                latex: String.raw`HSP = \text{Upah}_{pekerja} + \text{Upah}_{mandor}`,
                teks: 'Upah pekerja + Upah mandor',
              },
              {
                label: 'Pekerjaan upah dan bahan',
                latex: String.raw`HSP = \textstyle\sum \text{Upah} + \sum \text{Bahan}`,
                teks: 'Jumlah upah + Jumlah bahan',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. RENCANA ANGGARAN BIAYA (RAB)
  // ===========================================================================
  {
    id: 'rab',
    judul: 'Rencana Anggaran Biaya',
    singkat: 'RAB',
    icon: 'wallet-outline',
    deskripsi: 'Volume × harga satuan & rekapitulasi',
    bagian: [
      {
        id: 'rab',
        judul: 'Rencana Anggaran Biaya (RAB)',
        topik: [
          {
            id: 'rab',
            judul: 'Rencana Anggaran Biaya (RAB)',
            langkah: [
              'Siapkan hasil perhitungan sebelumnya, yaitu perhitungan volume dan AHSP.',
              'Masukkan volume pekerjaan serta harga satuan tiap pekerjaan.',
              'Kalikan volume dengan harga satuan.',
              'Contoh: pembersihan lokasi. Jumlah harga = volume lokasi × harga satuan yang telah ditotalkan pada AHSP.',
              'Ulangi langkah tersebut untuk pekerjaan lainnya.',
              'Setelah semua pekerjaan dihitung, totalkan jumlah harga sesuai kelompok sub pekerjaan sebagai rekapitulasi dana.',
              'Rekapitulasi dana nantinya digunakan untuk perhitungan bobot dan penyesuaian time schedule.',
            ],
            rumus: [
              {
                label: 'Jumlah harga pekerjaan',
                latex: String.raw`\text{Jumlah harga} = \text{Volume} \times HSP`,
                teks: 'Volume × Harga satuan pekerjaan',
              },
              {
                label: 'Subtotal kelompok pekerjaan',
                latex: String.raw`\text{Subtotal} = \textstyle\sum \text{Jumlah harga}`,
                teks: 'Jumlah harga seluruh pekerjaan dalam satu kelompok',
              },
              {
                label: 'Total RAB',
                latex: String.raw`\text{Total RAB} = \textstyle\sum \text{Subtotal}`,
                teks: 'Jumlah subtotal seluruh kelompok pekerjaan',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 4. TIME SCHEDULE
  // ===========================================================================
  {
    id: 'time-schedule',
    judul: 'Time Schedule',
    singkat: 'Time Schedule',
    icon: 'calendar-outline',
    deskripsi: 'Plotting pekerjaan & kurva S',
    bagian: [
      {
        id: 'time-schedule',
        judul: 'Time Schedule',
        topik: [
          {
            id: 'time-schedule',
            judul: 'Time Schedule',
            langkah: [
              'Pada file AHSP terdapat nilai koefisien (OH) untuk mandor, tukang, maupun pekerja. Nilai koefisien ini merupakan ketetapan AHSP.',
              'Hitung total kebutuhan hari orang: koefisien OH pekerja × volume pekerjaan.',
              'Bagi hasilnya dengan banyak hari kerja dalam seminggu. Hasilnya adalah kebutuhan pekerja sesuai dengan jadwal yang direncanakan.',
              'Hasilnya biasanya desimal, sehingga perlu dibulatkan ke atas.',
              'Jika pekerjaan direncanakan 2 minggu, bagi 2. Jika setengah minggu, kali 2, dan seterusnya.',
              'Sesuaikan plotting dengan lama pekerjaan, banyak pekerjaan, anggaran biaya, maupun faktor lainnya.',
              'Ulangi langkah plotting ini untuk pekerjaan lainnya.',
              'Kurva S membutuhkan bobot dan akumulasi, yang dihitung dari rekapitulasi dana dan plotting.',
              'Bobot tiap sub pekerjaan = (biaya sub pekerjaan ÷ total rekapitulasi dana) × 100%.',
              'Akumulasi dihitung dari lama sub pekerjaan tiap minggu. Akumulasi minggu berjalan = akumulasi minggu sebelumnya + rencana fisik minggu ini.',
              'Usahakan akumulasi rencana fisik pada minggu terakhir bernilai 100%.',
              'Buat tabel berisi jenis pekerjaan, bobot, jumlah, rencana fisik tiap minggu, akumulasi, prosentase, keterangan, dan lama pekerjaan (minggu).',
              'Isi tabel sesuai perhitungan sebelumnya: rekapitulasi dana, bobot, akumulasi, rencana fisik, dan plotting mingguan.',
              'Buat diagram garis dari akumulasi plotting mingguan, dari minggu pertama hingga minggu terakhir. Diagram akan membentuk huruf S.',
              'Jika diagram belum membentuk huruf S, sesuaikan kembali perhitungan plotting.',
            ],
            rumus: [
              {
                label: 'Kebutuhan pekerja sesuai jadwal',
                latex: String.raw`N = \left\lceil \frac{\text{Koef. OH} \times \text{Volume}}{\text{Hari kerja per minggu} \times \text{Durasi (minggu)}} \right\rceil`,
                teks: '(Koefisien OH × Volume) ÷ (Hari kerja per minggu × Durasi minggu), dibulatkan ke atas',
              },
              {
                label: 'Bobot pekerjaan',
                latex: String.raw`\text{Bobot} = \frac{\text{Biaya sub pekerjaan}}{\text{Total rekap dana}} \times 100\%`,
                teks: '(Biaya sub pekerjaan ÷ Total rekapitulasi dana) × 100%',
              },
              {
                label: 'Akumulasi mingguan',
                latex: String.raw`\text{Akumulasi}_t = \text{Akumulasi}_{t-1} + \text{Rencana fisik}_t`,
                teks: 'Akumulasi minggu lalu + Rencana fisik minggu ini (akhir = 100%)',
              },
            ],
          },
        ],
      },
    ],
  },
];

// Daftar datar seluruh topik dalam satu materi (untuk navigasi sebelumnya/berikutnya)
export const getTopikList = (materi) =>
  materi.bagian.flatMap((bagian) =>
    bagian.topik.map((topik) => ({ ...topik, bagianJudul: bagian.judul }))
  );

export const countTopik = (materi) =>
  materi.bagian.reduce((sum, bagian) => sum + bagian.topik.length, 0);
