import {
  DEFAULT_PONDASI,
  DEFAULT_FOOTPLATE,
  DEFAULT_SLOOF,
  DEFAULT_KOLOM,
  DEFAULT_BALOK,
  DEFAULT_ATAP_PELANA,
  DEFAULT_ATAP_LIMAS,
} from './constructionCalculations';

/**
 * Normalizes values for comparison (strips whitespace, handles numbers and strings).
 */
export const normalizeValue = (val) => {
  if (val === null || val === undefined) return '';
  return String(val).trim();
};

/**
 * Checks if a single field is modified from its default value.
 */
export const isFieldModified = (currentVal, defaultVal) => {
  if (defaultVal === undefined) return false;
  return normalizeValue(currentVal) !== normalizeValue(defaultVal);
};

/**
 * Compares current inputs with default inputs and returns detailed modification stats.
 */
export const checkModifiedInputs = (currentInputs, defaultInputs) => {
  if (!currentInputs || !defaultInputs) {
    return {
      isModified: false,
      count: 0,
      modifiedKeys: [],
    };
  }

  const keys = Object.keys(defaultInputs);
  const modifiedKeys = [];

  keys.forEach((key) => {
    if (isFieldModified(currentInputs[key], defaultInputs[key])) {
      modifiedKeys.push(key);
    }
  });

  return {
    isModified: modifiedKeys.length > 0,
    count: modifiedKeys.length,
    modifiedKeys,
  };
};

/**
 * Default lookup dictionary by sheet type.
 */
export const DEFAULT_SHEET_INPUTS = {
  pondasi: DEFAULT_PONDASI,
  footplate: DEFAULT_FOOTPLATE,
  sloof: DEFAULT_SLOOF,
  kolom: DEFAULT_KOLOM,
  balok: DEFAULT_BALOK,
  atap_pelana: DEFAULT_ATAP_PELANA,
  atap_limas: DEFAULT_ATAP_LIMAS,
};

/**
 * Checks if a specific sheet in project inputs is modified from standard.
 */
export const isSheetModified = (sheetType, sheetInputs) => {
  const defaultObj = DEFAULT_SHEET_INPUTS[sheetType];
  if (!defaultObj || !sheetInputs) return false;
  const res = checkModifiedInputs(sheetInputs, defaultObj);
  return res.isModified;
};
