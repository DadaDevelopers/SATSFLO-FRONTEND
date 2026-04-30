import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';

type FlowLevel = 'light' | 'medium' | 'heavy' | 'veryHeavy' | null;
type Symptom = 'cramps' | 'fatigue' | 'bloating' | 'headache' | 'bellyAches' | 'acne' | 'soreBreasts' | 'cravings';
type Mood = 'normal' | 'happy' | 'calm' | 'hyped' | 'inLove' | 'peaceful' | 'lonely' | 'angry' | 'silly' | 'sad' | 'relaxed';
type Medicine = 'condom' | 'pill' | 'patch' | 'iud' | 'implant' | 'vRing' | 'injection' | 'spermicide';
type CupStyle = 'classic' | 'tumbler' | 'tall' | 'mug';

// Data stored per date
interface DayLogData {
  periodStart: boolean;
  periodEnd: boolean;
  flowLevel: FlowLevel;
  symptoms: Symptom[];
  moods: Mood[];
  medicine: Medicine[];
  note: string;
  weight: string;
  weightUnit: 'kg' | 'lb';
  temperature: string;
  temperatureUnit: 'C' | 'F';
  waterIntake: number;
}

// Global settings (not per-date)
interface GlobalSettings {
  waterTarget: number;
  cupCapacity: number;
  cupStyle: CupStyle;
}

interface AddLogContextType {
  // Current selected date
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Get/set data for current date
  getCurrentDayData: () => DayLogData;

  // Period
  setPeriodStart: (value: boolean) => void;
  setPeriodEnd: (value: boolean) => void;

  // Flow
  setFlowLevel: (level: FlowLevel) => void;

  // Symptoms
  toggleSymptom: (symptom: Symptom) => void;

  // Moods
  toggleMood: (mood: Mood) => void;

  // Medicine
  toggleMedicine: (medicine: Medicine) => void;

  // Note
  setNote: (note: string) => void;

  // Weight
  setWeight: (weight: string) => void;
  setWeightUnit: (unit: 'kg' | 'lb') => void;

  // Temperature
  setTemperature: (temp: string) => void;
  setTemperatureUnit: (unit: 'C' | 'F') => void;

  // Water
  setWaterIntake: (amount: number) => void;
  addWater: (amount: number) => void;

  // Global settings
  waterTarget: number;
  setWaterTarget: (target: number) => void;
  cupCapacity: number;
  setCupCapacity: (capacity: number) => void;
  cupStyle: CupStyle;
  setCupStyle: (style: CupStyle) => void;

  // Check if date is in period range
  isDateInPeriod: (date: Date) => boolean;

  // All day logs keyed by date string
  dayLogs: Record<string, DayLogData>;

  // Save all data for current date
  saveCurrentDay: () => Promise<void>;

  // Load data from API for a specific date key (YYYY-MM-DD)
  setDayLogForDate: (dateKey: string, data: Partial<DayLogData>) => void;
}

const defaultDayData: DayLogData = {
  periodStart: false,
  periodEnd: false,
  flowLevel: null,
  symptoms: [],
  moods: [],
  medicine: [],
  note: '',
  weight: '',
  weightUnit: 'kg',
  temperature: '',
  temperatureUnit: 'C',
  waterIntake: 0,
};

const defaultSettings: GlobalSettings = {
  waterTarget: 2500,
  cupCapacity: 300,
  cupStyle: 'classic',
};

const AddLogContext = createContext<AddLogContextType | undefined>(undefined);

// Helper to get date key for storage
const getDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function AddLogProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayLogs, setDayLogs] = useState<Record<string, DayLogData>>({});
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLogs = await AsyncStorage.getItem('dayLogs');
        const savedSettings = await AsyncStorage.getItem('logSettings');
        if (savedLogs) setDayLogs(JSON.parse(savedLogs));
        if (savedSettings) setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Failed to load logs from storage', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Fetch logs from server for selected date
  const fetchLogsForDate = async (date: Date) => {
    const dateStr = getDateKey(date);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        const { response, data } = await api.get(`/logs/${dateStr}`, token);
        if (response.status === 401) {
          console.error('Session expired');
          return;
        }
        if (response.ok && data) {
          const logData = data.data ?? data;
          setDayLogs(prev => ({
            ...prev,
            [dateStr]: {
              flowLevel: logData.flow || null,
              periodStart: logData.period_start || false,
              periodEnd: logData.period_end || false,
              symptoms: logData.symptoms || [],
              moods: logData.mood || [],
              medicine: logData.medicine || [],
              note: logData.notes || '',
              weight: logData.weight || '',
              weightUnit: logData.weight_unit || 'kg',
              temperature: logData.temperature || '',
              temperatureUnit: logData.temperature_unit || 'C',
              waterIntake: logData.water_intake || 0,
            }
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch logs from server', err);
    }
  };

  // Fetch from server when date changes
  useEffect(() => {
    if (isLoaded) {
      fetchLogsForDate(selectedDate);
    }
  }, [selectedDate, isLoaded]);

  // Save logs whenever they change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('dayLogs', JSON.stringify(dayLogs));
    }
  }, [dayLogs, isLoaded]);

  // Save settings whenever they change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('logSettings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Get data for current selected date
  const getCurrentDayData = (): DayLogData => {
    const key = getDateKey(selectedDate);
    return dayLogs[key] || { ...defaultDayData };
  };

  // Update data for current date
  const updateCurrentDay = (updates: Partial<DayLogData>) => {
    const key = getDateKey(selectedDate);
    setDayLogs((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || defaultDayData),
        ...updates,
      },
    }));
  };

  // Period
  const setPeriodStart = (value: boolean) => {
    updateCurrentDay({ periodStart: value });
    // If starting period, clear end
    if (value) {
      updateCurrentDay({ periodStart: value, periodEnd: false });
    }
  };

  const setPeriodEnd = (value: boolean) => {
    // Can only set end if there's a start somewhere before
    if (value && !hasPeriodStartBefore(selectedDate)) {
      return;
    }
    updateCurrentDay({ periodEnd: value });
  };

  // Check if there's a period start on or before the given date
  const hasPeriodStartBefore = (date: Date): boolean => {
    const dateKey = getDateKey(date);
    // Check current date first
    if (dayLogs[dateKey]?.periodStart) return true;

    // Check previous dates (up to 14 days back for typical period)
    for (let i = 1; i <= 14; i++) {
      const checkDate = new Date(date);
      checkDate.setDate(checkDate.getDate() - i);
      const key = getDateKey(checkDate);
      if (dayLogs[key]?.periodStart) return true;
      if (dayLogs[key]?.periodEnd) return false; // Previous period ended
    }
    return false;
  };

  // Check if a date is within an active period
  const isDateInPeriod = (date: Date): boolean => {
    const dateKey = getDateKey(date);
    const dayData = dayLogs[dateKey];

    // If this day has period start or end, it's in period
    if (dayData?.periodStart || dayData?.periodEnd) return true;

    // Check if we're between a start and end
    let foundStart = false;
    for (let i = 0; i <= 14; i++) {
      const checkDate = new Date(date);
      checkDate.setDate(checkDate.getDate() - i);
      const key = getDateKey(checkDate);
      const data = dayLogs[key];

      if (data?.periodEnd && i > 0) return false; // Found end before us
      if (data?.periodStart) {
        foundStart = true;
        break;
      }
    }

    if (!foundStart) return false;

    // Check if there's an end after the start but before this date
    // (already handled above)
    return foundStart;
  };

  // Flow
  const setFlowLevel = (level: FlowLevel) => {
    updateCurrentDay({ flowLevel: level });
  };

  // Symptoms
  const toggleSymptom = (symptom: Symptom) => {
    const currentData = getCurrentDayData();
    const newSymptoms = currentData.symptoms.includes(symptom)
      ? currentData.symptoms.filter((s) => s !== symptom)
      : [...currentData.symptoms, symptom];
    updateCurrentDay({ symptoms: newSymptoms });
  };

  // Moods
  const toggleMood = (mood: Mood) => {
    const currentData = getCurrentDayData();
    const newMoods = currentData.moods.includes(mood)
      ? currentData.moods.filter((m) => m !== mood)
      : [...currentData.moods, mood];
    updateCurrentDay({ moods: newMoods });
  };

  // Medicine
  const toggleMedicine = (medicine: Medicine) => {
    const currentData = getCurrentDayData();
    const newMedicine = currentData.medicine.includes(medicine)
      ? currentData.medicine.filter((m) => m !== medicine)
      : [...currentData.medicine, medicine];
    updateCurrentDay({ medicine: newMedicine });
  };

  // Note
  const setNote = (note: string) => {
    updateCurrentDay({ note });
  };

  // Weight
  const setWeight = (weight: string) => {
    updateCurrentDay({ weight });
  };

  const setWeightUnit = (unit: 'kg' | 'lb') => {
    updateCurrentDay({ weightUnit: unit });
  };

  // Temperature
  const setTemperature = (temperature: string) => {
    updateCurrentDay({ temperature });
  };

  const setTemperatureUnit = (unit: 'C' | 'F') => {
    updateCurrentDay({ temperatureUnit: unit });
  };

  // Water
  const setWaterIntake = (amount: number) => {
    const capped = Math.min(Math.max(0, amount), settings.waterTarget);
    updateCurrentDay({ waterIntake: capped });
  };

  const addWater = (amount: number) => {
    const currentData = getCurrentDayData();
    const newAmount = Math.min(currentData.waterIntake + amount, settings.waterTarget);
    updateCurrentDay({ waterIntake: newAmount });
  };

  // Global settings
  const setWaterTarget = (target: number) => {
    setSettings((prev) => ({ ...prev, waterTarget: target }));
  };

  const setCupCapacity = (capacity: number) => {
    setSettings((prev) => ({ ...prev, cupCapacity: capacity }));
  };

  const setCupStyle = (style: CupStyle) => {
    setSettings((prev) => ({ ...prev, cupStyle: style }));
  };

  // Save current day (for explicit save action)
  const saveCurrentDay = async () => {
    const dateStr = getDateKey(selectedDate);
    const dayData = getCurrentDayData();
    
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // 1. Sync the daily logs
        const { response: logRes } = await api.put(`/logs/${dateStr}`, {
          flow: dayData.flowLevel,
          symptoms: dayData.symptoms,
          mood: dayData.moods,
          notes: dayData.note,
          weight: dayData.weight,
          temperature: dayData.temperature,
          water_intake: dayData.waterIntake,
        }, token);

        if (!logRes.ok) {
          throw new Error(logRes.status === 401 ? 'Session expired. Please log in again.' : 'Failed to save logs to server');
        }

        // 2. Start period cycle if marked
        if (dayData.periodStart) {
          const { response: cycleRes } = await api.post('/cycles/start', { start_date: dateStr }, token);
          if (!cycleRes.ok) console.warn('Failed to start cycle on server');
        }
        
        // 3. End period cycle if marked
        if (dayData.periodEnd) {
          const { response: cycleRes } = await api.post('/cycles/end', { end_date: dateStr }, token);
          if (!cycleRes.ok) console.warn('Failed to end cycle on server');
        }
        
        console.log('Successfully synced all data with server for', dateStr);
      }
    } catch (err) {
      console.error('Failed to sync with server', err);
      throw err; // Propagate to caller for UI feedback
    }
  };

  // Load data from API for a specific date key (YYYY-MM-DD)
  const setDayLogForDate = (dateKey: string, data: Partial<DayLogData>) => {
    setDayLogs((prev) => ({
      ...prev,
      [dateKey]: {
        ...defaultDayData,
        ...data,
      },
    }));
  };

  return (
    <AddLogContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        dayLogs,
        getCurrentDayData,
        setPeriodStart,
        setPeriodEnd,
        setFlowLevel,
        toggleSymptom,
        toggleMood,
        toggleMedicine,
        setNote,
        setWeight,
        setWeightUnit,
        setTemperature,
        setTemperatureUnit,
        setWaterIntake,
        addWater,
        waterTarget: settings.waterTarget,
        setWaterTarget,
        cupCapacity: settings.cupCapacity,
        setCupCapacity,
        cupStyle: settings.cupStyle,
        setCupStyle,
        isDateInPeriod,
        saveCurrentDay,
        setDayLogForDate,
      }}
    >
      {children}
    </AddLogContext.Provider>
  );
}

export function useAddLog() {
  const context = useContext(AddLogContext);
  if (context === undefined) {
    throw new Error('useAddLog must be used within an AddLogProvider');
  }
  return context;
}
