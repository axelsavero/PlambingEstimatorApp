import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@plambing_estimator_history_v1';

export const saveCalculation = async (item) => {
  try {
    const existing = await getCalculations();
    const newItem = {
      ...item,
      id: item.id || Date.now().toString(),
      createdAt: item.createdAt || new Date().toISOString(),
    };
    const updated = [newItem, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (error) {
    console.error('Error saving calculation:', error);
    return null;
  }
};

export const getCalculations = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting calculations:', error);
    return [];
  }
};

export const deleteCalculation = async (id) => {
  try {
    const existing = await getCalculations();
    const updated = existing.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting calculation:', error);
    return [];
  }
};

export const clearAllCalculations = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing calculations:', error);
    return false;
  }
};
