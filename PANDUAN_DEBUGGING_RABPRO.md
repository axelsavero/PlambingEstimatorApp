# 📘 PANDUAN LENGKAP DEBUGGING & ARSITEKTUR APLIKASI RABPro

> **Buku panduan praktis ini disusun khusus untuk membantu Anda memahami struktur kode, alur data, formula kalkulasi, serta cara mendebug dan mengembangkan aplikasi RABPro.**

---

## 📑 DAFTAR ISI

1. [Peta Struktur File & Peran Masing-Masing File](#1-peta-struktur-file)
2. [Alur Kerja Data (Data Flow Architecture)](#2-alur-kerja-data)
3. [Cara Menjalankan & Menguji Aplikasi di Laptop/HP](#3-cara-menjalankan--debugging-aplikasi)
4. [Memahami Logika Perhitungan (Formula Engine)](#4-memahami-logika-perhitungan)
5. [Alur Sinkronisasi Data ke Rekap RAB](#5-alur-sinkronisasi-ke-rekap-rab)
6. [Penjelasan Perbaikan Bug Terkini](#6-penjelasan-perbaikan-bug-terkini)
7. [Panduan Menambah atau Mengubah Formula/Spesifikasi](#7-panduan-custom-formula--harga)
8. [Troubleshooting & Solusi Kendala Populer](#8-troubleshooting-kendala-populer)
9. [Perintah Build APK Android & iOS](#9-perintah-build-aplikasi)

---

## 1. PETA STRUKTUR FILE

```
PlambingEstimatorApp/
├── App.js                          # Entry point: Lock orientasi landscape & inisialisasi navigasi
├── app.json                        # Konfigurasi Expo, nama (RABPro), iOS bundle ID, icon
├── eas.json                        # Konfigurasi build cloud (Android APK & iOS Simulator/Device)
├── package.json                    # Dependensi library React Native & Expo
│
├── assets/
│   ├── icon.png                    # Icon resmi aplikasi (vektor kubus biru resolusi tinggi)
│   ├── android-icon-foreground.png # Icon adaptif Android
│   └── diagrams/                   # File gambar panduan teknis konstruksi dari Excel
│       ├── pondasi.png             # Galian & batu kali
│       ├── footplate.png           # Pondasi tapak & 6 tipe tulangan
│       ├── sloof.png               # Balok sloof & sengkang
│       ├── kolom.png               # Kolom beton bertulang
│       ├── balok.png               # Balok beton bertulang
│       ├── atap_pelana.png         # Kuda-kuda pelana & bracing
│       └── atap_limas.png          # Geometri atap limas & jurai
│
└── src/
    ├── components/
    │   ├── RABProLogo.js           # Komponen vector kubus biru tajam (tanpa efek tempelan)
    │   └── LandscapeCalculatorLayout.js # Engine tampilan landscape 2-kolom (kiri input, kanan RAB)
    │
    ├── navigation/
    │   └── AppNavigator.js         # Navigasi tab bawah ala sheet Excel & flow disclaimer
    │
    ├── screens/
    │   ├── DisclaimerScreen.js     # Layar syarat & ketentuan pembuka aplikasi
    │   ├── HomeScreen.js           # Dashboard menu utama (kartu 7 modul + ringkasan RAB)
    │   ├── PondasiScreen.js        # Modul Pondasi Batu Belah
    │   ├── FootPlateScreen.js      # Modul Foot Plate / Pondasi Tapak
    │   ├── SloofScreen.js          # Modul Sloof Beton
    │   ├── KolomScreen.js          # Modul Kolom Beton
    │   ├── BalokScreen.js          # Modul Balok Beton
    │   ├── AtapPelanaScreen.js     # Modul Atap Pelana Baja Ringan
    │   ├── AtapLimasScreen.js      # Modul Atap Limas Baja Ringan
    │   └── RekapRABScreen.js       # Rekapitulasi RAB 19 pekerjaan + toggle atap
    │
    ├── utils/
    │   ├── constructionCalculations.js # INTI RUMUS: Semua matematika & AHSP dari Excel
    │   └── rabStorage.js           # Penyimpanan data proyek lokal (AsyncStorage)
    │
    └── constants/
        └── colors.js               # Palet warna tema biru konstruksi
```

---

## 2. ALUR KERJA DATA

```
┌──────────────────────────────────────────────────────────────┐
│                    Pengguna Membuka Aplikasi                │
└──────────────────────────────┬───────────────────────────────┘
                               │
               [Cek Status Disclaimer di AsyncStorage]
                               │
            ┌──────────────────┴──────────────────┐
     (Belum disetujui)                     (Sudah disetujui)
            ▼                                     ▼
   [DisclaimerScreen]                     [AppNavigator (MainTabs)]
 (Tampil saat awal buka)                          │
            │                                     ▼
            └────► (Klik Setuju) ──────────► [HomeScreen] (Dashboard)
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
      [Pilih Modul Kalkulator]                                           [Buka Rekap RAB]
 (Pondasi / FootPlate / Sloof / Kolom...)                                          │
                 │                                                                 │
                 ▼                                                                 │
    [LandscapeCalculatorLayout]                                                    │
 ┌───────────────────────────────┐                                                 │
 │ KIRI: Input angka & dimensi   │                                                 │
 │ (Bisa diedit secara dinamis)  │                                                 │
 └───────────────┬───────────────┘                                                 │
                 ▼                                                                 │
 [constructionCalculations.js]                                                    │
 • Menghitung Volume Struktur                                                      │
 • Mengalikan Koefisien AHSP                                                       │
 • Menghitung Upah & Bahan                                                         │
                 │                                                                 │
                 ▼                                                                 │
 ┌───────────────────────────────┐                                                 │
 │ KANAN: Hasil Tabel RAB        │                                                 │
 │ • Total Biaya Pekerjaan       │                                                 │
 │ • Rincian Tenaga & Material   │                                                 │
 └───────────────┬───────────────┘                                                 │
                 ▼                                                                 │
     (Klik: Simpan ke Rekap RAB)                                                   │
                 │                                                                 │
                 ▼                                                                 │
         [rabStorage.js] ──────────────────────────────────────────────────────────┘
    (Update nilai baris proyek)
```

---

## 3. CARA MENJALANKAN & DEBUGGING APLIKASI

### A. Menjalankan Server Development (Expo)
Buka terminal di folder project:
```bash
cd /home/foxie/Documents/RAPBRO_App/PlambingEstimatorApp
npx expo start
```
Di terminal akan muncul QR Code. Anda dapat:
* **Android**: Scan QR code menggunakan aplikasi **Expo Go** (download dari Play Store).
* **iOS**: Scan QR code menggunakan aplikasi Kamera iPhone (pastikan sudah install **Expo Go** dari App Store).
* **Tekan `a`** di terminal untuk membuka di Android Emulator.
* **Tekan `i`** di terminal untuk membuka di iOS Simulator (pada Mac).

### B. Membuka Menu Pengembang (In-App Developer Menu)
Saat aplikasi terbuka di HP:
* **Goyangkan HP Anda** (shake device), atau
* Di Android emulator: tekan `Ctrl + M` (Windows/Linux) atau `Cmd + M` (Mac).
* Di menu ini Anda bisa:
  * **Reload**: Memuat ulang aplikasi.
  * **Show Element Inspector**: Untuk memeriksa ukuran kotak/view, margin, dan padding secara langsung di layar.
  * **Toggle Performance Monitor**: Memantau konsumsi RAM dan FPS aplikasi.

### C. Melihat Log Console (Print Debug)
Setiap kali Anda menambahkan `console.log("Nilai:", data)` di file Javascript, hasilnya akan **langsung tercetak di jendela terminal** tempat Anda menjalankan `npx expo start`.

---

## 4. MEMAHAMI LOGIKA PERHITUNGAN

Seluruh matematika aplikasi tersimpan rapi di file:
👉 `src/utils/constructionCalculations.js`

### Anatomi Setiap Modul:
Setiap kalkulator memiliki 2 bagian:
1. **Objek Default Input (`DEFAULT_[NAMA]`)**:
   Menyimpan angka awal persis seperti di Excel. Contoh di Sloof:
   ```javascript
   export const DEFAULT_SLOOF = {
     panjangSloof: '3',   // meter
     lebarSloof: '0.2',   // meter
     tinggiSloof: '0.3',  // meter
     jumlahSloof: '5',    // unit
     diaTul1: '10',       // mm
     // ... harga satuan upah & material
   };
   ```
2. **Fungsi Hitung (`hitung[Nama](inputs)`)**:
   Menerima input dari pengguna, melakukan kalkulasi, dan mengembalikan objek hasil:
   * `volumes`: Nilai fisik (m³, m², kg besi, dll).
   * `tenagaKerja`: Array pekerja, tukang, kepala tukang, mandor (volume OH, harga, subtotal).
   * `bahan`: Array seluruh material (batang besi, pasir, semen sak, paku, dll).
   * `totalUpah`: Subtotal upah tenaga kerja (Rp).
   * `totalBahan`: Subtotal belanja bahan (Rp).
   * `grandTotal`: Total Biaya Pekerjaan (Rp).

---

## 5. ALUR SINKRONISASI KE REKAP RAB

File pengelola: 👉 `src/utils/rabStorage.js`

1. **Penyimpanan Lokal**:
   Menggunakan `AsyncStorage` (database mini di dalam HP). Data proyek pengguna tidak akan hilang meskipun aplikasi ditutup.
2. **Fungsi `generateCurrentRekapRAB()`**:
   * Membaca seluruh input dari ke-7 modul yang telah diedit pengguna.
   * Menjalankan kalkulasi ulang secara real-time.
   * Memeriksa pilihan atap aktif:
     * Jika memilih **Atap Pelana** -> Baris No. 11 bernilai Rp 52.553.868, Baris 11.A bernilai Rp 0 (diberi tanda X).
     * Jika memilih **Atap Limas** -> Baris No. 11 bernilai Rp 0 (tanda X), Baris 11.A bernilai Rp 96.643.400.
   * Menjumlahkan seluruh baris ke **TOTAL PROYEK**.
3. **Interaktivitas Baris**:
   Di layar `RekapRABScreen.js`, jika Anda menyentuh baris yang memiliki kalkulator (misalnya baris Kolom), aplikasi langsung berpindah membuka kalkulator Kolom.

---

## 6. PENJELASAN PERBAIKAN BUG TERKINI

### Bug 1: Tabel Tenaga Kerja Hilang Saat Pindah Tab
* **Penyebab**: Sebelumnya digunakan conditional rendering biasa `{activeResultTab === 'rab' ? <View> : <View>}`. Di Android, saat view di dalam `ScrollView` dibongkar-pasang (unmount/mount) dan scroll posisinya tidak di puncak, sistem native view recycling menganggap komponen baru berada di luar batas pandang (*clipped*), sehingga dirender berupa kotak putih kosong sampai layar disentuh ulang.
* **Solusi**:
  1. Diganti menggunakan `display: activeResultTab === 'rab' ? 'flex' : 'none'`. Komponen tetap hidup di memori native sehingga tidak perlu dirender ulang dari nol.
  2. Menambahkan `removeClippedSubviews={false}` pada kedua `ScrollView`.
  3. Menambahkan fungsi auto-scroll ke puncak (`scrollTo({ y: 0, animated: false })`) saat tab diklik.

### Bug 2: Logo Terlihat Seperti Tempelan
* **Penyebab**: Penggunaan gambar bitmap (`assets/icon.png`) hasil crop manual yang memiliki batas piksel kasar saat dirender di layar HP.
* **Solusi**:
  1. Dibuat komponen vector native `src/components/RABProLogo.js` menggunakan `<Ionicons name="cube" size={...} color="#0284c7" />`.
  2. Gambar icon file sistem `assets/icon.png` di-generate ulang dengan render grafik isometrik 3D murni 1024x1024.

### Bug 3: Disclaimer Tidak Perlu Ada di Tab Bar
* **Penyebab**: Tab `[🚨 DISCLAIMER]` sebelumnya dimasukkan ke dalam `MainTabs` di `AppNavigator.js`.
* **Solusi**:
  * Tab `DisclaimerTab` dihapus dari `MainTabs`.
  * Disclaimer kini hanya tampil saat pembukaan aplikasi pertama kali (atau via tombol kecil info di header Beranda jika ingin dibaca ulang).

### Bug 4: Tombol Perbesar Gambar Terpotong
* **Penyebab**: Judul diagram (misal: "Gambar Panduan Penulangan & Geometri Sloof Beton") terlalu panjang dan kontainernya tidak memiliki `flex: 1` / `minWidth: 0`, sehingga mendorong tombol `btnZoom` ke luar batas kanan kartu.
* **Solusi**:
  1. Kontainer judul diberi `flex: 1`, `minWidth: 0`, dan `numberOfLines={1}` dengan `ellipsizeMode="tail"`.
  2. Tombol zoom diberi `flexShrink: 0` dan teks diringkas menjadi `Perbesar` dengan ikon layar penuh (`expand-outline`), sehingga di layar HP selebar apapun tombol ini dijamin 100% utuh.

---

## 7. PANDUAN CUSTOM FORMULA & HARGA

### Contoh: Ingin Mengubah Harga Default Semen atau Besi
Buka `src/utils/constructionCalculations.js`:
1. Cari objek `DEFAULT_[NAMA_MODUL]`.
2. Ubah angka string pada variabel harga yang diinginkan. Contoh di `DEFAULT_SLOOF`:
   ```javascript
   hargaSemen: '68000', // dari 65000 menjadi 68000
   ```
3. Simpan file (`Ctrl + S`), aplikasi di HP akan otomatis me-reload dan menghitung dengan harga baru.

### Contoh: Menyesuaikan Koefisien AHSP
Di dalam fungsi kalkulasi terkait (misal `hitungBalok`), cari variabel AHSP:
```javascript
const H66 = volBekisting * 0.66; // Koefisien pekerja bekisting balok
```
Ubah nilai pengali `0.66` sesuai standar analisa proyek Anda.

---

## 8. TROUBLESHOOTING KENDALA POPULER

| Kendala | Penyebab | Cara Mengatasi |
|---|---|---|
| Layar tidak mau landscape | Cache orientasi perangkat terkunci | Pastikan "Auto-rotate" di sistem HP aktif, restart expo dengan `npx expo start -c` |
| Angka di kalkulator tertukar/aneh | Input teks kosong atau mengandung huruf | Fungsi telah dilengkapi fallback `parseFloat(val) \|\| 0`, cukup masukkan angka valid |
| Perubahan kode tidak muncul di HP | Metro bundler menggunakan cache lama | Tekan `r` di terminal expo untuk reload, atau hentikan expo (`Ctrl + C`) dan jalankan `npx expo start -c` (clear cache) |
| Tombol/teks tertutup keyboard di landscape | Keyboard HP menutupi separuh layar | Seluruh area input berada di dalam `ScrollView` yang dapat digulir ke atas dan ke bawah dengan lancar saat keyboard muncul |

---

## 9. PERINTAH BUILD APLIKASI

Jika Anda ingin membuat file APK Android atau paket instalasi iOS:

```bash
# 1. Pastikan Anda sudah login ke akun Expo (gratis):
npx eas-cli login

# 2. Build APK Android siap install di HP:
eas build --platform android --profile preview

# 3. Build Simulator iOS (format .tar.gz):
eas build --platform ios --profile preview

# 4. Build TestFlight / Perangkat Fisik iOS:
eas build --platform ios --profile preview-device
```
Setelah build selesai, EAS akan memberikan link download langsung ke HP Anda.
