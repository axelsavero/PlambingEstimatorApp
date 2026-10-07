import { useState, useEffect, useRef } from 'react';
import { getProjectInputs, saveSheetInputs } from './rabStorage';

const SAVE_DELAY_MS = 500;

/**
 * State input kalkulator yang dimuat dari penyimpanan dan otomatis
 * tersimpan setiap kali berubah (tanpa tombol "Simpan").
 */
export default function useSheetInputs(sheetKey, defaults) {
  const [inputs, setInputs] = useState(defaults);
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await getProjectInputs();
      if (!active) return;
      if (stored?.[sheetKey]) {
        setInputs({ ...defaults, ...stored[sheetKey] });
      }
      loaded.current = true;
    })();
    return () => {
      active = false;
    };
  }, [sheetKey]);

  useEffect(() => {
    // Jangan menimpa data tersimpan sebelum selesai dimuat
    if (!loaded.current) return;
    const timer = setTimeout(() => saveSheetInputs(sheetKey, inputs), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [sheetKey, inputs]);

  return [inputs, setInputs];
}
