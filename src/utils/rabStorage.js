import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_PONDASI,
  DEFAULT_FOOTPLATE,
  DEFAULT_SLOOF,
  DEFAULT_KOLOM,
  DEFAULT_BALOK,
  DEFAULT_ATAP_PELANA,
  DEFAULT_ATAP_LIMAS,
  hitungPondasi,
  hitungFootPlate,
  hitungSloof,
  hitungKolom,
  hitungBalok,
  hitungAtapPelana,
  hitungAtapLimas,
  REKAP_RAB_BASELINE,
} from './constructionCalculations';
import { isSheetModified } from './modificationHelper';

const STORAGE_KEYS = {
  PROJECT_INPUTS: '@rabpro_project_inputs',
  ROOF_CHOICE: '@rabpro_roof_choice', // 'pelana' or 'limas'
  DISCLAIMER_ACCEPTED: '@rabpro_disclaimer_accepted',
  SAVED_PROJECTS: '@rabpro_saved_projects',
};

export const getProjectInputs = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PROJECT_INPUTS);
    if (!json) {
      return {
        pondasi: { ...DEFAULT_PONDASI },
        footplate: { ...DEFAULT_FOOTPLATE },
        sloof: { ...DEFAULT_SLOOF },
        kolom: { ...DEFAULT_KOLOM },
        balok: { ...DEFAULT_BALOK },
        atap_pelana: { ...DEFAULT_ATAP_PELANA },
        atap_limas: { ...DEFAULT_ATAP_LIMAS },
      };
    }
    return JSON.parse(json);
  } catch (e) {
    console.error('Error reading project inputs', e);
    return {
      pondasi: { ...DEFAULT_PONDASI },
      footplate: { ...DEFAULT_FOOTPLATE },
      sloof: { ...DEFAULT_SLOOF },
      kolom: { ...DEFAULT_KOLOM },
      balok: { ...DEFAULT_BALOK },
      atap_pelana: { ...DEFAULT_ATAP_PELANA },
      atap_limas: { ...DEFAULT_ATAP_LIMAS },
    };
  }
};

export const saveSheetInputs = async (sheetType, inputs) => {
  try {
    const all = await getProjectInputs();
    all[sheetType] = inputs;
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECT_INPUTS, JSON.stringify(all));
    return all;
  } catch (e) {
    console.error('Error saving sheet inputs', e);
  }
};

export const getRoofChoice = async () => {
  try {
    const choice = await AsyncStorage.getItem(STORAGE_KEYS.ROOF_CHOICE);
    return choice || 'pelana'; // default to pelana as in Excel
  } catch (e) {
    return 'pelana';
  }
};

export const saveRoofChoice = async (choice) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ROOF_CHOICE, choice);
  } catch (e) {
    console.error('Error saving roof choice', e);
  }
};

export const getDisclaimerStatus = async () => {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    return val === 'true';
  } catch (e) {
    return false;
  }
};

export const setDisclaimerAccepted = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
  } catch (e) {
    console.error('Error setting disclaimer status', e);
  }
};

// Generates dynamic Rekap RAB based on current active inputs and roof choice
export const generateCurrentRekapRAB = async () => {
  const inputs = await getProjectInputs();
  const roofChoice = await getRoofChoice();

  const pondasiRes = hitungPondasi(inputs.pondasi);
  const footPlateRes = hitungFootPlate(inputs.footplate);
  const sloofRes = hitungSloof(inputs.sloof);
  const kolomRes = hitungKolom(inputs.kolom);
  const balokRes = hitungBalok(inputs.balok);
  const pelanaRes = hitungAtapPelana(inputs.atap_pelana);
  const limasRes = hitungAtapLimas(inputs.atap_limas);

  const calculatedTotals = {
    pondasi: Math.round(pondasiRes.grandTotal),
    footplate: Math.round(footPlateRes.grandTotal),
    sloof: Math.round(sloofRes.grandTotal),
    kolom: Math.round(kolomRes.grandTotal),
    balok: Math.round(balokRes.grandTotal),
    atap_pelana: roofChoice === 'pelana' ? Math.round(pelanaRes.grandTotal) : 0,
    atap_limas: roofChoice === 'limas' ? Math.round(limasRes.grandTotal) : 0,
  };

  const table = REKAP_RAB_BASELINE.map((item) => {
    if (item.isCalculated && calculatedTotals[item.type] !== undefined) {
      const isModified = isSheetModified(item.type, inputs[item.type]);
      return {
        ...item,
        jumlah: calculatedTotals[item.type],
        isActiveRoof: item.isRoofChoice ? (roofChoice === (item.type === 'atap_pelana' ? 'pelana' : 'limas')) : undefined,
        isModified,
      };
    }
    return item;
  });

  const totalProyek = table.reduce((sum, item) => sum + (item.jumlah || 0), 0);
  const isAnySheetModified = table.some((item) => item.isModified);

  return {
    table,
    totalProyek,
    roofChoice,
    isAnySheetModified,
    details: {
      pondasi: pondasiRes,
      footplate: footPlateRes,
      sloof: sloofRes,
      kolom: kolomRes,
      balok: balokRes,
      atap_pelana: pelanaRes,
      atap_limas: limasRes,
    },
  };
};

export const resetAllToDefault = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROJECT_INPUTS);
    await AsyncStorage.setItem(STORAGE_KEYS.ROOF_CHOICE, 'pelana');
  } catch (e) {
    console.error('Error resetting project inputs', e);
  }
};
