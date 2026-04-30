import { BottomNavigation } from '@/components/home/bottom-navigation';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, ScrollView, Text, View, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';
import { useAddLog } from '@/context/add-log-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const SYMPTOM_IMAGES: Record<string, any> = {
  cramps: require("@/assets/images/cramps.png"),
  fatigue: require("@/assets/images/fatigue.png"),
  bloating: require("@/assets/images/bloating.png"),
  headache: require("@/assets/images/headache.png"),
  bellyAches: require("@/assets/images/bellyaches.png"),
  acne: require("@/assets/images/acne.png"),
  soreBreasts: require("@/assets/images/sorebreasts.png"),
  cravings: require("@/assets/images/cravings.png"),
};

const MEDICINE_IMAGES: Record<string, any> = {
  condom: require('@/assets/images/condom.png'),
  pill: require('@/assets/images/pill.png'),
  patch: require('@/assets/images/patch.png'),
  iud: require('@/assets/images/IUD.png'),
  implant: require('@/assets/images/implant.png'),
  vRing: require('@/assets/images/V-ring.png'),
  injection: require('@/assets/images/injection.png'),
  spermicide: require('@/assets/images/spermicide.png'),
};

const moodEmojis: Record<string, string> = {
  normal: '😐', happy: '😊', calm: '😌', hyped: '🤩',
  inLove: '😍', peaceful: '😇', lonely: '😢', angry: '😠',
  silly: '😜', sad: '😔', relaxed: '🙂',
};

type TabName = 'home' | 'calendar' | 'add' | 'chat' | 'settings';

interface DayData {
  day: number;
  cycleDay: number;
  isPeriod: boolean;
  isFertility: boolean;
  isOvulation: boolean;
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { date: paramDate } = useLocalSearchParams<{ date: string }>();
  const { isDateInPeriod, getCurrentDayData, setSelectedDate: setContextSelectedDate, dayLogs: allDayLogs, selectedDate: contextSelectedDate } = useAddLog();
  
  const todayDate = new Date();
  const selectedDate = contextSelectedDate.getDate();
  const currentMonthNum = contextSelectedDate.getMonth();
  const currentYear = contextSelectedDate.getFullYear();
  
  const [activeTab, setActiveTab] = useState<TabName>('calendar');

  // Initialize from param if provided
  useEffect(() => {
    if (paramDate) {
      const parts = paramDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(d.getTime())) {
          setContextSelectedDate(d);
        }
      }
    }
  }, [paramDate, setContextSelectedDate]);

  const handleDateSelect = (day: number) => {
    if (day === 0) return;
    const cellDate = new Date(currentYear, currentMonthNum, day);
    
    // Difference in days from lastPeriodDate using UTC to avoid DST shifts
    const utc1 = Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
    const utc2 = Date.UTC(cycleData.lastPeriodDate.getFullYear(), cycleData.lastPeriodDate.getMonth(), cycleData.lastPeriodDate.getDate());
    const diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
    setContextSelectedDate(cellDate);
  };

  // Memoize current day logs to ensure reactivity when allDayLogs updates
  const dayLogs = React.useMemo(() => {
    const key = `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    return allDayLogs[key] || { 
      flowLevel: null, 
      periodStart: false, 
      periodEnd: false, 
      symptoms: [], 
      moods: [], 
      medicine: [], 
      note: '', 
      weight: '', 
      weightUnit: 'kg', 
      temperature: '', 
      temperatureUnit: 'C', 
      waterIntake: 0 
    };
  }, [allDayLogs, selectedDate, currentMonthNum, currentYear]);

  const [cycleData, setCycleData] = useState({
    cycleLength: 28,
    periodLength: 5,
    ovulationDay: 14,
    fertilityStart: 9,
    fertilityEnd: 15,
    currentCycleDay: 1,
    lastPeriodDate: todayDate,
  });

  useFocusEffect(
    useCallback(() => {
      const loadCycleData = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return;
        try {
          const { response: profileRes, data: profileData } = await api.get('/cycle-profile', token);
          const { response: currentRes, data: currentData } = await api.get('/cycles/current', token);
          
          let pLength = 5;
          let cLength = 28;
          let lastPDate = new Date();
          let cDay = 1;

          const pd = profileData?.data ?? profileData;
          if (profileRes.ok && pd) {
            pLength = pd.period_length || 5;
            cLength = pd.cycle_length || 28;
            if (pd.last_period_start) {
              const parts = pd.last_period_start.split('-');
              if (parts.length === 3) {
                 lastPDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
              }
            }
          }

          if (currentRes.ok && currentData?.data) {
             cDay = currentData.data.current_day || 1;
             if (currentData.data.last_period_start) {
               const parts = currentData.data.last_period_start.split('-');
               if (parts.length === 3) {
                 lastPDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
               }
             }
          }

          const ovulation = cLength - 14;
          const fertStart = ovulation - 5;
          const fertEnd = ovulation + 1;

          setCycleData({
            cycleLength: cLength,
            periodLength: pLength,
            ovulationDay: ovulation,
            fertilityStart: fertStart,
            fertilityEnd: fertEnd,
            currentCycleDay: cDay,
            lastPeriodDate: lastPDate,
          });
        } catch (e) {
          console.error(e);
        }
      };
      loadCycleData();
    }, [])
  );

  const generateMonthDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    // Padding for first week
    for (let i = 0; i < firstDay; i++) days.push({ day: 0 });
    
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i });
    
    // Padding for last week
    while (days.length % 7 !== 0) days.push({ day: 0 });
    
    return days;
  };

  const monthDays = generateMonthDays(currentMonthNum, currentYear);
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDayInfo = (day: number): DayData => {
    if (day === 0) return { day: 0, cycleDay: 0, isPeriod: false, isFertility: false, isOvulation: false };

    // Calculate cycle day based on difference from last period start
    const cellDate = new Date(currentYear, currentMonthNum, day);
    const utc1 = Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
    const utc2 = Date.UTC(cycleData.lastPeriodDate.getFullYear(), cycleData.lastPeriodDate.getMonth(), cycleData.lastPeriodDate.getDate());
    const diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
    const cycleDay = (diffDays % cycleData.cycleLength) + 1;

    // Use context's isDateInPeriod for real-time reflection of changes
    const isPeriod = isDateInPeriod(cellDate);
    const isFertility = cycleDay >= cycleData.fertilityStart && cycleDay <= cycleData.fertilityEnd && !isPeriod;
    const isOvulation = cycleDay === cycleData.ovulationDay;

    return { day, cycleDay, isPeriod, isFertility, isOvulation };
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        router.push('/');
        break;
      case 'add':
        router.push('/add-log' as any);
        break;
      case 'chat':
        router.push('/(tabs)/thread' as any);
        break;
      case 'settings':
        router.push('/(tabs)/settings' as any);
        break;
      default:
        break;
    }
  };

  const handleEditPeriod = () => {
    router.push({
      pathname: "/(auth)/last-period",
      params: { isEdit: "true" },
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="flex-1 bg-[#FF4081] text-[#FAFAFA]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 mt-6">
        {/* Blood Drop Icon */}
        <View className="w-10 h-10 rounded-full border border-dashed border-[#CC0045] items-center justify-center">
          <FontAwesome5 name="tint" size={20} color="#CC0045" />
        </View>

        {/* Month Title */}
        <View className="items-center">
          <Text className="text-sm font-inter text-white opacity-80 uppercase tracking-widest mb-1">
            {new Date(currentYear, currentMonthNum, selectedDate).toDateString() === todayDate.toDateString() ? "Today's Status" : "Log Summary"}
          </Text>
          <Text className="text-2xl font-inter font-bold text-white tracking-tight">
            {MONTHS[currentMonthNum]} {selectedDate}
          </Text>
        </View>

        {/* Calendar Icon */}
        <View className="w-10 h-10 rounded-full border border-[#FAFAFA] items-center justify-center">
          <Feather name="calendar" size={20} color="#FAFAFA" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Calendar Grid */}
        <View className="px-0 mt-2">
          {/* Week Days Header */}
          <View className="flex-row justify-between px-2 mb-6">
            {weekDays.map((day, index) => (
              <View key={index} className="flex-1 items-center py-2">
                <Text className="text-sm font-inter text-white font-medium">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap font-inter text-[#FAFAFA]">
            {monthDays.map((item, index) => {
              const dayInfo = getDayInfo(item.day);
              const isSelected = item.day === selectedDate;
              const isToday = item.day === todayDate.getDate() && currentMonthNum === todayDate.getMonth() && currentYear === todayDate.getFullYear();

              return (
                <Pressable
                  key={index}
                  onPress={() => handleDateSelect(item.day)}
                  className={`w-[14.28%] h-14 items-center justify-center relative ${
                    dayInfo.isPeriod ? 'bg-[#CC0045]' : ''
                  } ${isSelected && !dayInfo.isPeriod ? 'bg-[#FF669A] rounded-xl' : ''} ${
                    isToday && !isSelected ? 'border-2 border-[#FFB2CD] rounded-xl' : ''
                  }`}
                >
                  {item.day > 0 && (
                    <>
                      {/* Cycle Day Number (small) */}
                      <Text className={`absolute top-1 right-2 text-[8px] font-inter ${
                        dayInfo.isPeriod ? 'text-[#FFB2CC]' :
                        dayInfo.isFertility ? 'text-[#8027A5]' : 'text-[#FFCCDD]'
                      }`}>
                        {dayInfo.cycleDay}
                      </Text>

                      {/* Day Number */}
                      <Text className={`text-base font-inter ${
                        dayInfo.isPeriod ? 'text-white font-bold' : isToday ? 'text-white font-bold' : 'text-[#FAFAFA]'
                      }`}>
                        {item.day}
                      </Text>

                      {/* Fertility/Ovulation Indicator */}
                      {dayInfo.isFertility && !dayInfo.isOvulation && (
                        <View className="absolute bottom-1.5">
                          <MaterialCommunityIcons name="cards-heart" size={10} color="#8027A5" />
                        </View>
                      )}
                      {dayInfo.isOvulation && (
                        <View className="absolute bottom-1.5">
                          <MaterialCommunityIcons name="cards-heart" size={10} color="#FFD700" />
                        </View>
                      )}
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Date Info */}
        <View className="flex-row items-center justify-between mt-8 px-5">
          <View>
            <Text className="text-xl font-bold font-inter text-[#FAFAFA]">
              {MONTHS[currentMonthNum].substring(0, 3)} {selectedDate}
            </Text>
            <Text className="text-sm font-inter text-[#FAFAFA] opacity-90">
              Cycle day {getDayInfo(selectedDate).cycleDay}
            </Text>
          </View>

          <Pressable
            onPress={handleEditPeriod}
            className="px-4 py-2 border border-[#FFB4CD] rounded-full bg-white/10"
          >
            <Text className="text-xs font-inter font-semibold text-white">
              Edit Period
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-[#FFB2CD] mx-5 my-6 opacity-30" />
        
        {/* Pregnancy Chance */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-inter text-white bg-white/10 self-start px-3 py-1 rounded-full">
            <Text className="font-bold">Medium</Text> chance of getting pregnant
          </Text>
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-between px-5 mb-6">
          {/* Period Days */}
          <View className="items-center gap-1 flex-1">
            <View className="w-4 h-4 rounded-full bg-[#CC0045]" />
            <Text className="text-[10px] font-inter text-white text-center">Period days</Text>
          </View>

          {/* Fertility Window */}
          <View className="items-center gap-1 flex-1">
            <MaterialCommunityIcons name="cards-heart" size={16} color="#8027A5" />
            <Text className="text-[10px] font-inter text-white text-center">Fertility window</Text>
          </View>

          {/* Ovulation Day */}
          <View className="items-center gap-1 flex-1">
            <MaterialCommunityIcons name="cards-heart" size={16} color="#FFD700" />
            <Text className="text-[10px] font-inter text-white text-center">Ovulation Day</Text>
          </View>
        </View>

        {/* Health Log Summary Card */}
        <View className="px-5 mb-10">
          <View className="bg-[#FF4081] rounded-3xl p-6">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-white font-inter font-bold text-xl">
                Daily Health Log
              </Text>
              <Pressable onPress={() => router.push({ pathname: '/add-log', params: { date: `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}` } } as any)}>
                <Feather name="edit-3" size={20} color="white" />
              </Pressable>
            </View>
            
            {/* Log Data Summary (Reactive to allDayLogs change) */}
            {(dayLogs.flowLevel || dayLogs.note || (dayLogs.moods && dayLogs.moods.length > 0) || (dayLogs.symptoms && dayLogs.symptoms.length > 0) || dayLogs.waterIntake > 0 || dayLogs.weight || dayLogs.temperature) ? (
              <View className="gap-6">
                {/* 1. Vertical List Style - Now at the Top */}
                <View className="gap-6">
                  {/* Flow */}
                  {dayLogs.flowLevel && (
                    <View className="flex-row items-center gap-4">
                      <FontAwesome5 name="tint" size={22} color="white" />
                      <Text className="text-white text-xl font-bold capitalize">Flow: {dayLogs.flowLevel}</Text>
                    </View>
                  )}

                  {/* Moods */}
                  {dayLogs.moods.length > 0 && (
                    <View className="flex-row flex-wrap gap-4">
                      {dayLogs.moods.map(m => (
                        <View key={m} className="flex-row items-center gap-2">
                          <Text className="text-xl">{moodEmojis[m]}</Text>
                          <Text className="text-white text-base font-inter capitalize font-bold">{m}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Symptoms */}
                  {dayLogs.symptoms.length > 0 && (
                    <View className="flex-row flex-wrap gap-4 mt-2">
                      {dayLogs.symptoms.map(s => (
                        <View key={s} className="flex-row items-center gap-2">
                          <Image source={SYMPTOM_IMAGES[s]} style={{ width: 22, height: 22, tintColor: 'white' }} resizeMode="contain" />
                          <Text className="text-white text-base font-inter capitalize font-bold">{s}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Medicine */}
                  {dayLogs.medicine && dayLogs.medicine.length > 0 && (
                    <View className="flex-row flex-wrap gap-4 mt-2">
                      {dayLogs.medicine.map(med => (
                        <View key={med} className="flex-row items-center gap-2">
                          <Image source={MEDICINE_IMAGES[med]} style={{ width: 20, height: 20, tintColor: 'white' }} resizeMode="contain" />
                          <Text className="text-white text-base font-inter capitalize font-bold">{med}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-white/10 my-2" />
                
                {/* 2. Three Circular Icons Arrangement */}
                <View className="flex-row justify-between items-start mt-2">
                  {/* Weight */}
                  <View className="items-center flex-1">
                    <View className="w-[60px] h-[60px] items-center justify-center mb-2">
                      <Svg height="60" width="60" viewBox="0 0 60 60">
                        <Circle cx="30" cy="30" r="28" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                        <Circle cx="30" cy="30" r="20" stroke="white" strokeWidth="1" strokeOpacity="0.8" fill="none" />
                        {/* Weight Scale Icon */}
                        <Rect x="20" y="24" width="20" height="14" rx="2" fill="#66CCFF" />
                        <Rect x="26" y="26" width="8" height="4" rx="1" fill="#FFFFFF" />
                      </Svg>
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {dayLogs.weight ? `${dayLogs.weight}` : '--'} <Text className="text-[10px] font-normal">{dayLogs.weightUnit}</Text>
                    </Text>
                    <Text className="text-white/80 text-[10px] mt-0.5">Weight</Text>
                  </View>

                  {/* Temperature */}
                  <View className="items-center flex-1">
                    <View className="w-[60px] h-[60px] items-center justify-center mb-2">
                      <Svg height="60" width="60" viewBox="0 0 60 60">
                        <Circle cx="30" cy="30" r="28" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                        <Circle cx="30" cy="30" r="20" stroke="white" strokeWidth="1" strokeOpacity="0.8" fill="none" />
                        {/* Thermometer Icon */}
                        <Path d="M33.535 30.535l4.243-4.243a3 3 0 00-4.243-4.242l-4.243 4.242a5 5 0 104.243 4.243z" fill="#FF3366" />
                        <Circle cx="28" cy="32" r="2" fill="#FFFFFF" />
                      </Svg>
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {dayLogs.temperature ? `${dayLogs.temperature}` : '--'} <Text className="text-[10px] font-normal">°{dayLogs.temperatureUnit}</Text>
                    </Text>
                    <Text className="text-white/80 text-[10px] mt-0.5">Temperature</Text>
                  </View>

                  {/* Water */}
                  <View className="items-center flex-1">
                    <View className="w-[60px] h-[60px] items-center justify-center mb-2">
                      <Svg height="60" width="60" viewBox="0 0 60 60">
                        <Circle cx="30" cy="30" r="28" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                        <Circle cx="30" cy="30" r="20" stroke="white" strokeWidth="1" strokeOpacity="0.8" fill="none" />
                        {/* Water Glass Icon */}
                        <Path d="M24 22l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12H24z" fill="#3399FF" />
                        <Path d="M24.5 26h11M25 31h10" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
                      </Svg>
                    </View>
                    <Text className="text-white text-lg font-bold">
                      {dayLogs.waterIntake} <Text className="text-[10px] font-normal">ml</Text>
                    </Text>
                    <Text className="text-white/80 text-[10px] mt-0.5">Drink Water</Text>
                  </View>
                </View>

                  {/* Note */}
                  {dayLogs.note && (
                    <View className="mt-4 p-4 bg-white/10 rounded-2xl">
                      <Text className="text-white/90 text-sm font-inter italic">"{dayLogs.note}"</Text>
                    </View>
                  )}
              </View>
          ) : (
              <View className="items-center py-6">
                <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center mb-3">
                  <Feather name="file-text" size={24} color="white" opacity={0.5} />
                </View>
                <Text className="text-white opacity-60 text-sm font-inter mb-4">No health logs found for this date</Text>
                <Pressable 
                  onPress={() => router.push({ pathname: '/add-log', params: { date: `${currentYear}-${String(currentMonthNum + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}` } } as any)}
                  className="bg-white px-6 py-2 rounded-full"
                >
                  <Text className="text-[#FF4081] text-sm font-bold font-inter">Add Log</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Scroll Indicator */}
        <View className="items-center mb-8">
          <Text className="text-[10px] font-inter text-[#FFB3CD] uppercase tracking-widest">Keep Logging Daily</Text>
          <Feather name="chevron-down" size={20} color="#FFB3CD" style={{ marginTop: 4 }} />
        </View>

      </ScrollView>


      {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
    </View>
  );
}
