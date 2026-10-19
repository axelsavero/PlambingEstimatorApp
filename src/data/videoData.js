// Video pembahasan per topik materi, dikunci dengan id topik di materiData.js.
// File sumber dari klien ada di folder Videos/ (di luar proyek), disalin ke
// assets/videos/ dengan nama <id topik>.mp4.
// Topik yang belum punya video (plat lantai, bekisting plat lantai) tidak dicantumkan.

export const VIDEO = {
  // Pondasi Foot Plate
  'fp-galian': require('../../assets/videos/fp-galian.mp4'),
  'fp-urugan-pasir': require('../../assets/videos/fp-urugan-pasir.mp4'),
  'fp-lantai-kerja': require('../../assets/videos/fp-lantai-kerja.mp4'),
  'fp-footplate': require('../../assets/videos/fp-footplate.mp4'),
  'fp-bekisting': require('../../assets/videos/fp-bekisting.mp4'),
  'fp-kolom-pendek': require('../../assets/videos/fp-kolom-pendek.mp4'),
  'fp-urugan-kembali': require('../../assets/videos/fp-urugan-kembali.mp4'),

  // Pondasi Batu Kali
  'bk-galian': require('../../assets/videos/bk-galian.mp4'),
  'bk-urugan-pasir': require('../../assets/videos/bk-urugan-pasir.mp4'),
  'bk-aanstamping': require('../../assets/videos/bk-aanstamping.mp4'),
  'bk-pasangan': require('../../assets/videos/bk-pasangan.mp4'),
  'bk-sloof': require('../../assets/videos/bk-sloof.mp4'),
  'bk-bekisting-sloof': require('../../assets/videos/bk-bekisting-sloof.mp4'),

  // Pekerjaan Beton
  'kolom-induk': require('../../assets/videos/kolom-induk.mp4'),
  'bekisting-kolom': require('../../assets/videos/bekisting-kolom.mp4'),
  balok: require('../../assets/videos/balok.mp4'),
  'bekisting-balok': require('../../assets/videos/bekisting-balok.mp4'),

  // Pekerjaan Tangga
  'plat-tangga': require('../../assets/videos/plat-tangga.mp4'),
  'bekisting-tangga': require('../../assets/videos/bekisting-tangga.mp4'),
  'anak-tangga': require('../../assets/videos/anak-tangga.mp4'),

  // Pekerjaan Atap
  'kuda-kuda': require('../../assets/videos/kuda-kuda.mp4'),
  'balok-rangkai': require('../../assets/videos/balok-rangkai.mp4'),
  usuk: require('../../assets/videos/usuk.mp4'),
  reng: require('../../assets/videos/reng.mp4'),
  'luas-atap': require('../../assets/videos/luas-atap.mp4'),
  genteng: require('../../assets/videos/genteng.mp4'),
  wuwung: require('../../assets/videos/wuwung.mp4'),

  // AHSP, RAB, Time Schedule
  ahsp: require('../../assets/videos/ahsp.mp4'),
  rab: require('../../assets/videos/rab.mp4'),
  'time-schedule': require('../../assets/videos/time-schedule.mp4'),
};
