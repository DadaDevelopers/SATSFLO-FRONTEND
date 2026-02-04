import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';

const MAX_CONTENT_WIDTH = 480;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DATE_ITEM_SIZE = 60;

// Generate dates for the horizontal scroll
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = -30; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date,
      day: date.getDate(),
      dayName: DAYS_SHORT[date.getDay()],
      month: MONTHS_SHORT[date.getMonth()],
      isToday: i === 0,
    });
  }
  return dates;
};

// Flow droplet component
const FlowDroplet = ({ level, selected }: { level: 'light' | 'medium' | 'heavy' | 'veryHeavy'; selected: boolean }) => {
  const fills: Record<string, { fill: string; opacity: number }> = {
    light: { fill: selected ? '#EC4899' : '#FFB3CD', opacity: 0.3 },
    medium: { fill: selected ? '#EC4899' : '#FF6B9D', opacity: 0.6 },
    heavy: { fill: selected ? '#DB2777' : '#FF4081', opacity: 0.8 },
    veryHeavy: { fill: selected ? '#BE185D' : '#E91E63', opacity: 1 },
  };
  const { fill, opacity } = fills[level];

  return (
    <Svg width={40} height={40} viewBox="0 0 24 24">
      <Path
        d="M12 2C12 2 6 10 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 10 12 2 12 2Z"
        fill={fill}
        opacity={opacity}
        stroke={selected ? '#EC4899' : 'transparent'}
        strokeWidth={2}
      />
    </Svg>
  );
};

// Water cup component
const WaterCup = ({ filled, percentage = 0 }: { filled: boolean; percentage?: number }) => (
  <Svg width={36} height={44} viewBox="0 0 24 28">
    <Path
      d="M6 4 L7 24 L17 24 L18 4 Z"
      stroke="#4FC3F7"
      strokeWidth={2}
      fill="none"
    />
    {filled && (
      <Path d="M7 14 L7 24 L17 24 L17 14 Z" fill="#4FC3F7" />
    )}
  </Svg>
);

export default function AddLogScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const today = new Date();
  const flatListRef = useRef<FlatList>(null);
  const dates = generateDates();

  // Get state from context
  const {
    selectedDate,
    setSelectedDate,
    getCurrentDayData,
    setPeriodStart,
    setPeriodEnd,
    setFlowLevel,
    addWater,
    setWaterIntake,
    waterTarget,
    cupCapacity,
    isDateInPeriod,
    saveCurrentDay,
  } = useAddLog();

  const dayData = getCurrentDayData();

  // Calendar state (local)
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [viewingMonth, setViewingMonth] = useState(today.getMonth());
  const [viewingYear, setViewingYear] = useState(today.getFullYear());
  const chevronRotation = useSharedValue(0);

  // Period edit modal state
  const [periodEditModalVisible, setPeriodEditModalVisible] = useState(false);
  const [editingPeriodType, setEditingPeriodType] = useState<'start' | 'end'>('start');
  const [editModalMonth, setEditModalMonth] = useState(today.getMonth());
  const [editModalYear, setEditModalYear] = useState(today.getFullYear());

  // Reset to today when screen mounts and scroll to today
  useEffect(() => {
    const now = new Date();
    setSelectedDate(now);
    setViewingMonth(now.getMonth());
    setViewingYear(now.getFullYear());

    // Scroll to today (index 30, middle of the array)
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: 30,
        animated: false,
        viewPosition: 0.5,
      });
    }, 100);
  }, []);

  // Toggle calendar
  const toggleCalendar = () => {
    setCalendarExpanded(!calendarExpanded);
    chevronRotation.value = withTiming(calendarExpanded ? 0 : 180, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  // Handle period start
  const handlePeriodStart = () => {
    setPeriodStart(!dayData.periodStart);
  };

  // Handle period end
  const handlePeriodEnd = () => {
    if (!dayData.periodStart && !isDateInPeriod(selectedDate)) {
      Alert.alert('No Period Started', 'Please mark a period start first.');
      return;
    }
    setPeriodEnd(!dayData.periodEnd);
  };

  // Handle date selection from horizontal scroll
  const handleDateSelectFromScroll = (date: Date, index: number) => {
    setSelectedDate(date);
    setViewingMonth(date.getMonth());
    setViewingYear(date.getFullYear());

    // Center the selected date
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  // Render date item for FlatList
  const renderDateItem = ({ item, index }: { item: typeof dates[0]; index: number }) => {
    const isSelected = item.date.toDateString() === selectedDate.toDateString();
    const isPeriodDay = isDateInPeriod(item.date);

    return (
      <TouchableOpacity
        onPress={() => handleDateSelectFromScroll(item.date, index)}
        className="items-center mx-1"
        style={{ width: DATE_ITEM_SIZE }}
      >
        <Text className={`text-xs mb-1 ${isSelected ? 'text-white font-semibold' : 'text-white/60'}`}>
          {item.dayName}
        </Text>
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isSelected
              ? 'bg-white'
              : isPeriodDay
              ? 'bg-pink-600'
              : item.isToday
              ? 'bg-pink-300/50'
              : 'bg-white/10'
          }`}
        >
          <Text
            className={`text-lg font-semibold ${
              isSelected ? 'text-pink-500' : 'text-white'
            }`}
          >
            {item.day}
          </Text>
        </View>
        {isPeriodDay && (
          <View className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1" />
        )}
        {item.isToday && !isPeriodDay && (
          <View className="w-1.5 h-1.5 rounded-full bg-white/50 mt-1" />
        )}
      </TouchableOpacity>
    );
  };

  // Month days
  const getMonthDays = () => {
    const daysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();
    const startingDay = new Date(viewingYear, viewingMonth, 1).getDay();
    const days: ({ date: number; fullDate: Date; isSelected: boolean; isPeriodDay: boolean; isToday: boolean } | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(viewingYear, viewingMonth, day);
      days.push({
        date: day,
        fullDate,
        isSelected: fullDate.toDateString() === selectedDate.toDateString(),
        isPeriodDay: isDateInPeriod(fullDate),
        isToday: fullDate.toDateString() === today.toDateString(),
      });
    }
    return days;
  };

  const handleDateSelect = (fullDate: Date) => {
    setSelectedDate(fullDate);
    setViewingMonth(fullDate.getMonth());
    setViewingYear(fullDate.getFullYear());
  };

  // Handle opening period edit modal
  const handleEditPeriod = () => {
    setEditModalMonth(selectedDate.getMonth());
    setEditModalYear(selectedDate.getFullYear());
    setPeriodEditModalVisible(true);
  };

  // Get days for edit modal calendar
  const getEditModalDays = () => {
    const daysInMonth = new Date(editModalYear, editModalMonth + 1, 0).getDate();
    const startingDay = new Date(editModalYear, editModalMonth, 1).getDay();
    const days: ({ date: number; fullDate: Date; isSelected: boolean; isPeriodDay: boolean; isToday: boolean } | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(editModalYear, editModalMonth, day);
      days.push({
        date: day,
        fullDate,
        isSelected: fullDate.toDateString() === selectedDate.toDateString(),
        isPeriodDay: isDateInPeriod(fullDate),
        isToday: fullDate.toDateString() === today.toDateString(),
      });
    }
    return days;
  };

  // Handle date selection in edit modal
  const handleEditModalDateSelect = (fullDate: Date) => {
    setSelectedDate(fullDate);
    if (editingPeriodType === 'start') {
      setPeriodStart(true);
    } else {
      setPeriodEnd(true);
    }
    setPeriodEditModalVisible(false);
  };

  const editModalDays = getEditModalDays();

  const monthDays = getMonthDays();

  // Labels
  const symptomLabels: Record<string, string> = {
    cramps: 'Cramps', fatigue: 'Fatigue', bloating: 'Bloating', headache: 'Headache',
    bellyAches: 'Belly aches', acne: 'Acne', soreBreasts: 'Sore breasts', cravings: 'Cravings',
  };
  const moodLabels: Record<string, string> = {
    normal: 'Normal', happy: 'Happy', calm: 'Calm', hyped: 'Hyped',
    inLove: 'In love', peaceful: 'Peaceful', lonely: 'Lonely', angry: 'Angry',
  };
  const moodEmojis: Record<string, string> = {
    normal: '😐', happy: '😊', calm: '😌', hyped: '🤩',
    inLove: '😍', peaceful: '😇', lonely: '😢', angry: '😠',
  };
  const medicineLabels: Record<string, string> = {
    condom: 'Condom', pill: 'Pill', patch: 'Patch', iud: 'IUD',
    implant: 'Implant', vRing: 'V-Ring', injection: 'Injection', spermicide: 'Spermicide',
  };

  const handleSave = () => {
    saveCurrentDay();
    Alert.alert('Saved', 'Your log has been saved successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  // Edit pen icon component
  const EditPenIcon = () => (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="#999"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="#999"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  // Play triangle icon for Start button
  const PlayIcon = ({ color }: { color: string }) => (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path
        d="M5 3l14 9-14 9V3z"
        fill={color}
      />
    </Svg>
  );

  // Square icon for End button
  const StopIcon = ({ color }: { color: string }) => (
    <Svg width={10} height={10} viewBox="0 0 24 24">
      <Path
        d="M4 4h16v16H4V4z"
        fill={color}
      />
    </Svg>
  );

  // Section component
  const Section = ({ title, onPress, onEditPress, children, showChevron = true, showEditIcon = false }: { title: string; onPress?: () => void; onEditPress?: () => void; children: React.ReactNode; showChevron?: boolean; showEditIcon?: boolean }) => (
    <View className="bg-white rounded-2xl mb-3 overflow-hidden">
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        className="flex-row justify-between items-center px-4 py-3"
        activeOpacity={onPress ? 0.7 : 1}
      >
        <Text className="text-base font-medium text-gray-800">{title}</Text>
        {showChevron && <Text className="text-gray-400 text-lg">{'>'}</Text>}
        {showEditIcon && (
          <TouchableOpacity onPress={onEditPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <EditPenIcon />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <View className="px-4 pb-4">{children}</View>
    </View>
  );

  // Calculate cups
  const cupsCount = Math.ceil(waterTarget / cupCapacity);
  const cups = Array(Math.min(cupsCount, 5)).fill(cupCapacity);

  // Responsive wrapper for desktop
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!isDesktop) {
      return <>{children}</>;
    }
    return (
      <View
        style={{
          maxWidth: MAX_CONTENT_WIDTH,
          width: '100%',
          alignSelf: 'center',
          flex: 1,
        }}
      >
        {children}
      </View>
    );
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDesktop ? '#f5f5f5' : '#FF4081',
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      {/* Desktop background with centered content */}
      <View
        className="flex-1"
        style={isDesktop ? {
          maxWidth: MAX_CONTENT_WIDTH,
          maxHeight: 844, // iPhone 14 Pro height
          width: '100%',
          alignSelf: 'center',
          backgroundColor: '#FF4081',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
          borderRadius: 24,
          overflow: 'hidden',
        } : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-white text-2xl">×</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCalendar} className="flex-row items-center">
            <Text className="text-white text-lg font-semibold">
              {selectedDate.toDateString() === today.toDateString() ? 'Today' : `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`}
            </Text>
            <Animated.View style={chevronStyle} className="ml-2">
              <Text className="text-white text-sm">▼</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Text className="text-white text-xl">⋮</Text>
          </TouchableOpacity>
        </View>

      {/* Calendar */}
      {calendarExpanded ? (
        <View className="px-4 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => {
              if (viewingMonth === 0) {
                setViewingMonth(11);
                setViewingYear(y => y - 1);
              } else {
                setViewingMonth(m => m - 1);
              }
            }} className="p-2">
              <Text className="text-white text-xl">{'<'}</Text>
            </TouchableOpacity>
            <Text className="text-white text-base font-semibold">{MONTHS[viewingMonth]} {viewingYear}</Text>
            <TouchableOpacity onPress={() => {
              if (viewingMonth === 11) {
                setViewingMonth(0);
                setViewingYear(y => y + 1);
              } else {
                setViewingMonth(m => m + 1);
              }
            }} className="p-2">
              <Text className="text-white text-xl">{'>'}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-around mb-2">
            {DAYS.map(day => <Text key={day} className="text-white/70 text-xs w-10 text-center">{day}</Text>)}
          </View>
          <View className="flex-row flex-wrap">
            {monthDays.map((day, i) => (
              <View key={i} className="w-[14.28%] items-center mb-2">
                {day ? (
                  <TouchableOpacity onPress={() => handleDateSelect(day.fullDate)}>
                    <View className={`w-9 h-9 rounded-full items-center justify-center ${day.isSelected ? 'bg-white' : day.isPeriodDay ? 'bg-pink-700' : day.isToday ? 'bg-pink-300' : ''}`}>
                      <Text className={`text-sm ${day.isSelected ? 'text-pink-500 font-semibold' : 'text-white'}`}>{day.date}</Text>
                    </View>
                    {day.isPeriodDay && <View className="w-1.5 h-1.5 rounded-full bg-white mt-0.5 self-center" />}
                  </TouchableOpacity>
                ) : <View className="w-9 h-9" />}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View className="pb-4">
          {/* Month indicator */}
          <Text className="text-white/70 text-xs text-center mb-2">
            {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>

          {/* Horizontal scrollable date selector */}
          <FlatList
            ref={flatListRef}
            horizontal
            data={dates}
            keyExtractor={(item) => item.date.toISOString()}
            renderItem={renderDateItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            getItemLayout={(data, index) => ({
              length: DATE_ITEM_SIZE + 8,
              offset: (DATE_ITEM_SIZE + 8) * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.5,
                });
              }, 100);
            }}
            snapToInterval={DATE_ITEM_SIZE + 8}
            decelerationRate="fast"
          />
        </View>
      )}

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Period */}
        <Section title="Period" showChevron={false} showEditIcon={true} onEditPress={handleEditPeriod}>
          <View className="flex-row gap-2">
            {/* Start Button */}
            <TouchableOpacity
              onPress={handlePeriodStart}
              className="flex-1 flex-row items-center justify-center py-3 rounded-full"
              style={{
                backgroundColor: dayData.periodStart ? '#EC4899' : '#FFC1D6',
              }}
            >
              <View className="mr-2">
                <PlayIcon color={dayData.periodStart ? '#FFFFFF' : '#EC4899'} />
              </View>
              <Text
                className="font-medium"
                style={{ color: dayData.periodStart ? '#FFFFFF' : '#EC4899' }}
              >
                Start
              </Text>
            </TouchableOpacity>

            {/* End Button */}
            <TouchableOpacity
              onPress={handlePeriodEnd}
              className="flex-1 flex-row items-center justify-center py-3 rounded-full"
              style={{
                backgroundColor: dayData.periodEnd ? '#64B5F6' : '#B3E5FC',
              }}
            >
              <View className="mr-2">
                <StopIcon color={dayData.periodEnd ? '#FFFFFF' : '#1976D2'} />
              </View>
              <Text
                className="font-medium"
                style={{ color: dayData.periodEnd ? '#FFFFFF' : '#1976D2' }}
              >
                End
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* Flow */}
        <Section title="Flow" showChevron={false}>
          <View className="flex-row justify-around">
            {(['light', 'medium', 'heavy', 'veryHeavy'] as const).map(level => (
              <TouchableOpacity key={level} onPress={() => setFlowLevel(dayData.flowLevel === level ? null : level)} className="items-center">
                <View className={`w-14 h-14 rounded-full items-center justify-center ${dayData.flowLevel === level ? 'border-2 border-pink-400' : ''}`}>
                  <FlowDroplet level={level} selected={dayData.flowLevel === level} />
                </View>
                <Text className={`text-xs mt-1 ${dayData.flowLevel === level ? 'text-pink-500 font-medium' : 'text-gray-600'}`}>
                  {level === 'veryHeavy' ? 'V.Heavy' : level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Symptoms */}
        <Section title="Symptoms" onPress={() => router.push('/add-log/symptoms')}>
          {dayData.symptoms.length > 0 ? (
            <View className="flex-row flex-wrap">
              {dayData.symptoms.map(s => (
                <View key={s} className="bg-pink-100 rounded-full px-3 py-1.5 mr-2 mb-2">
                  <Text className="text-pink-500 text-sm">{symptomLabels[s]}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-400 text-sm">Tap to add symptoms</Text>
          )}
        </Section>

        {/* Moods */}
        <Section title="Moods" onPress={() => router.push('/add-log/moods')}>
          {dayData.moods.length > 0 ? (
            <View className="flex-row flex-wrap">
              {dayData.moods.map(m => (
                <View key={m} className="flex-row items-center mr-4 mb-2">
                  <Text className="text-2xl mr-1">{moodEmojis[m]}</Text>
                  <Text className="text-pink-500 text-sm">{moodLabels[m]}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-400 text-sm">Tap to add moods</Text>
          )}
        </Section>

        {/* Medicine */}
        <Section title="Medicine" onPress={() => router.push('/add-log/medicine')}>
          {dayData.medicine.length > 0 ? (
            <View className="flex-row flex-wrap">
              {dayData.medicine.map(m => (
                <View key={m} className="bg-pink-100 rounded-full px-3 py-1.5 mr-2 mb-2">
                  <Text className="text-pink-500 text-sm">{medicineLabels[m]}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-400 text-sm">Tap to add medicine</Text>
          )}
        </Section>

        {/* Note */}
        <Section title="Note" onPress={() => router.push('/add-log/notes')}>
          {dayData.note ? (
            <Text className="text-gray-600 text-sm" numberOfLines={2}>{dayData.note}</Text>
          ) : (
            <Text className="text-gray-400 text-sm">Tap to write a note</Text>
          )}
        </Section>

        {/* Weight */}
        <TouchableOpacity
          onPress={() => router.push('/add-log/weight')}
          className="bg-white rounded-2xl mb-3 flex-row justify-between items-center px-4 py-4"
        >
          <Text className="text-base font-medium text-gray-800">Weight</Text>
          <View className="flex-row items-center">
            {dayData.weight ? (
              <Text className="text-pink-500 font-medium mr-2">{dayData.weight} {dayData.weightUnit}</Text>
            ) : (
              <Text className="text-gray-400 mr-2">Tap to add</Text>
            )}
            <Text className="text-gray-400">{'>'}</Text>
          </View>
        </TouchableOpacity>

        {/* Temperature */}
        <TouchableOpacity
          onPress={() => router.push('/add-log/temperature')}
          className="bg-white rounded-2xl mb-3 flex-row justify-between items-center px-4 py-4"
        >
          <Text className="text-base font-medium text-gray-800">Temperature</Text>
          <View className="flex-row items-center">
            {dayData.temperature ? (
              <Text className="text-pink-500 font-medium mr-2">{dayData.temperature} °{dayData.temperatureUnit}</Text>
            ) : (
              <Text className="text-gray-400 mr-2">Tap to add</Text>
            )}
            <Text className="text-gray-400">{'>'}</Text>
          </View>
        </TouchableOpacity>

        {/* Drink Water */}
        <Section title="Drink water" onPress={() => router.push('/add-log/drink-water')}>
          <Text className="text-pink-500 text-lg font-semibold mb-3">{dayData.waterIntake}/ {waterTarget} ml</Text>
          <View className="flex-row justify-around">
            {cups.map((amount, i) => {
              const cupFilled = dayData.waterIntake >= (i + 1) * amount;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    if (cupFilled) {
                      setWaterIntake(i * amount);
                    } else {
                      addWater(amount);
                    }
                  }}
                  className="items-center"
                >
                  <WaterCup filled={cupFilled} />
                  <Text className={`text-xs mt-1 ${cupFilled ? 'text-blue-400' : 'text-gray-500'}`}>+{amount} ml</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>
      </ScrollView>

        {/* Save */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-signup-bg" style={{ paddingBottom: insets.bottom + 20 }}>
          <TouchableOpacity onPress={handleSave} className="bg-pink-300 py-4 rounded-full items-center">
            <Text className="text-white font-semibold text-base">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Period Edit Modal */}
      <Modal
        visible={periodEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPeriodEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            {/* Modal Header */}
            <View className="px-4 py-4" style={{ backgroundColor: '#FF4081' }}>
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={() => setPeriodEditModalVisible(false)}>
                  <Text className="text-white text-lg">×</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold">Edit Period</Text>
                <View className="w-4" />
              </View>

              {/* Start/End Toggle */}
              <View className="flex-row rounded-full p-1" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <TouchableOpacity
                  onPress={() => setEditingPeriodType('start')}
                  className={`flex-1 py-2 rounded-full ${editingPeriodType === 'start' ? 'bg-white' : ''}`}
                >
                  <Text style={{ color: editingPeriodType === 'start' ? '#FF4081' : '#FFFFFF' }} className="text-center font-medium">
                    Start Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditingPeriodType('end')}
                  className={`flex-1 py-2 rounded-full ${editingPeriodType === 'end' ? 'bg-white' : ''}`}
                >
                  <Text style={{ color: editingPeriodType === 'end' ? '#FF4081' : '#FFFFFF' }} className="text-center font-medium">
                    End Date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar */}
            <View className="p-4">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={() => {
                    if (editModalMonth === 0) {
                      setEditModalMonth(11);
                      setEditModalYear(y => y - 1);
                    } else {
                      setEditModalMonth(m => m - 1);
                    }
                  }}
                  className="p-2"
                >
                  <Text style={{ color: '#FF4081' }} className="text-xl">{'<'}</Text>
                </TouchableOpacity>
                <Text className="text-gray-800 text-base font-semibold">
                  {MONTHS[editModalMonth]} {editModalYear}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (editModalMonth === 11) {
                      setEditModalMonth(0);
                      setEditModalYear(y => y + 1);
                    } else {
                      setEditModalMonth(m => m + 1);
                    }
                  }}
                  className="p-2"
                >
                  <Text style={{ color: '#FF4081' }} className="text-xl">{'>'}</Text>
                </TouchableOpacity>
              </View>

              {/* Day Headers */}
              <View className="flex-row justify-around mb-2">
                {DAYS.map(day => (
                  <Text key={day} className="text-gray-400 text-xs w-10 text-center">{day}</Text>
                ))}
              </View>

              {/* Days Grid */}
              <View className="flex-row flex-wrap">
                {editModalDays.map((day, i) => (
                  <View key={i} className="w-[14.28%] items-center mb-2">
                    {day ? (
                      <TouchableOpacity onPress={() => handleEditModalDateSelect(day.fullDate)}>
                        <View
                          style={{
                            backgroundColor: day.isSelected
                              ? '#FF4081'
                              : day.isPeriodDay
                              ? 'rgba(255, 64, 129, 0.2)'
                              : day.isToday
                              ? '#f3f4f6'
                              : 'transparent',
                          }}
                          className="w-9 h-9 rounded-full items-center justify-center"
                        >
                          <Text
                            style={{
                              color: day.isSelected
                                ? '#FFFFFF'
                                : day.isPeriodDay
                                ? '#FF4081'
                                : '#1f2937',
                            }}
                            className={`text-sm ${day.isSelected ? 'font-semibold' : ''}`}
                          >
                            {day.date}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View className="w-9 h-9" />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Cancel Button */}
            <View className="px-4 pb-4">
              <TouchableOpacity
                onPress={() => setPeriodEditModalVisible(false)}
                className="bg-gray-100 py-3 rounded-full"
              >
                <Text className="text-center text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
