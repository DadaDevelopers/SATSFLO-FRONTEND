import { api } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';

const MAX_CONTENT_WIDTH = 480;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DATE_ITEM_SIZE = 60;

const MEDICINE_IMAGES: Record<string, ReturnType<typeof require>> = {
  condom:     require('@/assets/images/condom.png'),
  pill:       require('@/assets/images/pill.png'),
  patch:      require('@/assets/images/patch.png'),
  iud:        require('@/assets/images/IUD.png'),
  implant:    require('@/assets/images/implant.png'),
  vRing:      require('@/assets/images/V-ring.png'),
  injection:  require('@/assets/images/injection.png'),
  spermicide: require('@/assets/images/spermicide.png'),
};

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
      dayName: DAYS[date.getDay()],
      month: MONTHS_SHORT[date.getMonth()],
      isToday: i === 0,
    });
  }
  return dates;
};

// Flow droplet component
const FlowDroplet = ({ level, selected }: { level: 'light' | 'medium' | 'heavy' | 'veryHeavy'; selected: boolean }) => {
  if (level === 'light') {
    return (
      <Svg width={56} height={56} viewBox="0 0 62 62">
        <Rect
          x="0.340732"
          y="0.340732"
          width="60.6818"
          height="60.6818"
          rx="30.3409"
          stroke={selected ? '#CC1675' : '#FFDFEA'}
          strokeWidth="0.681818"
          fill="none"
        />
        <Path
          d="M30.6825 43.6361C27.6598 43.6361 25.0859 42.5907 22.9609 40.4998C20.8359 38.4089 19.7734 35.8634 19.7734 32.8634C19.7734 31.4316 20.0518 30.0623 20.6087 28.7555C21.1655 27.4486 21.9553 26.2952 22.978 25.2952L30.6825 17.7271L38.3871 25.2952C39.4098 26.2952 40.1996 27.4486 40.7564 28.7555C41.3132 30.0623 41.5916 31.4316 41.5916 32.8634C41.5916 35.8634 40.5291 38.4089 38.4041 40.4998C36.2791 42.5907 33.7053 43.6361 30.6825 43.6361Z"
          fill="#FF4081"
        />
      </Svg>
    );
  }

  if (level === 'medium') {
    return (
      <Svg width={56} height={56} viewBox="0 0 62 62">
        <Rect
          x="0.340732"
          y="0.340732"
          width="60.6818"
          height="60.6818"
          rx="30.3409"
          stroke={selected ? '#CC1675' : '#FFDFEA'}
          strokeWidth="0.681818"
          fill="none"
        />
        <Path
          d="M41.136 28.4085C39.1209 28.4085 37.4049 27.7115 35.9883 26.3176C34.5716 24.9236 33.8633 23.2267 33.8633 21.2267C33.8633 20.2721 34.0489 19.3592 34.4201 18.488C34.7913 17.6168 35.3178 16.8479 35.9996 16.1812L41.136 11.1357L46.2724 16.1812C46.9542 16.8479 47.4807 17.6168 47.8519 18.488C48.2231 19.3592 48.4087 20.2721 48.4087 21.2267C48.4087 23.2267 47.7004 24.9236 46.2837 26.3176C44.8671 27.7115 43.1512 28.4085 41.136 28.4085Z"
          fill="#FF4081"
        />
        <Path
          d="M24.288 48.5907C21.2653 48.5907 18.6914 47.5453 16.5664 45.4544C14.4414 43.3635 13.3789 40.818 13.3789 37.818C13.3789 36.3862 13.6573 35.0169 14.2141 33.7101C14.771 32.4032 15.5607 31.2498 16.5835 30.2498L24.288 22.6816L31.9925 30.2498C33.0153 31.2498 33.805 32.4032 34.3619 33.7101C34.9187 35.0169 35.1971 36.3862 35.1971 37.818C35.1971 40.818 34.1346 43.3635 32.0096 45.4544C29.8846 47.5453 27.3107 48.5907 24.288 48.5907Z"
          fill="#FF4081"
        />
      </Svg>
    );
  }

  if (level === 'heavy') {
    return (
      <Svg width={56} height={56} viewBox="0 0 66 62">
        <Rect
          x="0.342685"
          y="0.340732"
          width="64.7727"
          height="60.6818"
          rx="30.3409"
          stroke={selected ? '#CC1675' : '#FFDFEA'}
          strokeWidth="0.681818"
          fill="none"
        />
        <Path
          d="M44.3819 26.2707C42.2293 26.2707 40.3964 25.5262 38.8832 24.0373C37.3699 22.5483 36.6133 20.7356 36.6133 18.5992C36.6133 17.5796 36.8115 16.6045 37.2081 15.6739C37.6046 14.7433 38.167 13.9219 38.8953 13.2098L44.3819 7.82031L49.8684 13.2098C50.5968 13.9219 51.1592 14.7433 51.5557 15.6739C51.9522 16.6045 52.1505 17.5796 52.1505 18.5992C52.1505 20.7356 51.3938 22.5483 49.8806 24.0373C48.3673 25.5262 46.5344 26.2707 44.3819 26.2707Z"
          fill="#FF4081"
        />
        <Path
          d="M42.4202 47.2465C40.8058 47.2465 39.4311 46.6881 38.2962 45.5714C37.1612 44.4547 36.5938 43.0952 36.5938 41.4929C36.5938 40.7282 36.7424 39.9968 37.0398 39.2989C37.3372 38.6009 37.759 37.9849 38.3053 37.4508L42.4202 33.4087L46.5351 37.4508C47.0814 37.9849 47.5032 38.6009 47.8006 39.2989C48.0979 39.9968 48.2466 40.7282 48.2466 41.4929C48.2466 43.0952 47.6792 44.4547 46.5442 45.5714C45.4093 46.6881 44.0346 47.2465 42.4202 47.2465Z"
          fill="#FF4081"
        />
        <Path
          d="M21.0826 44.5194C17.8538 44.5194 15.1044 43.4026 12.8345 41.1692C10.5646 38.9357 9.42969 36.2167 9.42969 33.0121C9.42969 31.4827 9.72708 30.02 10.3219 28.6241C10.9166 27.2282 11.7603 25.9961 12.8527 24.9279L21.0826 16.8438L29.3124 24.9279C30.4049 25.9961 31.2485 27.2282 31.8433 28.6241C32.4381 30.02 32.7355 31.4827 32.7355 33.0121C32.7355 36.2167 31.6005 38.9357 29.3306 41.1692C27.0608 43.4026 24.3114 44.5194 21.0826 44.5194Z"
          fill="#FF4081"
        />
      </Svg>
    );
  }

  return (
    <Svg width={56} height={56} viewBox="0 0 62 62">
      <Rect
        x="0.342685"
        y="0.340732"
        width="60.6818"
        height="60.6818"
        rx="30.3409"
        stroke={selected ? '#CC1675' : '#FFDFEA'}
        strokeWidth="0.681818"
        fill="none"
      />
      <Path
        d="M41.593 25.6814C39.5779 25.6814 37.862 24.9844 36.4453 23.5905C35.0286 22.1966 34.3203 20.4996 34.3203 18.4996C34.3203 17.5451 34.5059 16.6322 34.8771 15.761C35.2483 14.8898 35.7749 14.1208 36.4567 13.4541L41.593 8.40869L46.7294 13.4541C47.4112 14.1208 47.9377 14.8898 48.3089 15.761C48.6802 16.6322 48.8658 17.5451 48.8658 18.4996C48.8658 20.4996 48.1574 22.1966 46.7408 23.5905C45.3241 24.9844 43.6082 25.6814 41.593 25.6814Z"
        fill="#FF4081"
      />
      <Path
        d="M38.8647 48.0678C37.3533 48.0678 36.0664 47.5451 35.0039 46.4996C33.9414 45.4542 33.4102 44.1815 33.4102 42.6815C33.4102 41.9656 33.5494 41.2809 33.8278 40.6275C34.1062 39.9741 34.5011 39.3974 35.0124 38.8974L38.8647 35.1133L42.717 38.8974C43.2283 39.3974 43.6232 39.9741 43.9016 40.6275C44.18 41.2809 44.3192 41.9656 44.3192 42.6815C44.3192 44.1815 43.788 45.4542 42.7255 46.4996C41.663 47.5451 40.3761 48.0678 38.8647 48.0678Z"
        fill="#FF4081"
      />
      <Path
        d="M49.771 39.8862C48.2596 39.8862 46.9727 39.3635 45.9102 38.318C44.8477 37.2726 44.3164 35.9998 44.3164 34.4998C44.3164 33.7839 44.4556 33.0993 44.734 32.4458C45.0124 31.7924 45.4073 31.2157 45.9187 30.7157L49.771 26.9316L53.6232 30.7157C54.1346 31.2157 54.5295 31.7924 54.8079 32.4458C55.0863 33.0993 55.2255 33.7839 55.2255 34.4998C55.2255 35.9998 54.6942 37.2726 53.6317 38.318C52.5692 39.3635 51.2823 39.8862 49.771 39.8862Z"
        fill="#FF4081"
      />
      <Path
        d="M19.7724 43.6361C16.7496 43.6361 14.1758 42.5907 12.0508 40.4998C9.92578 38.4089 8.86328 35.8634 8.86328 32.8634C8.86328 31.4316 9.14169 30.0623 9.69851 28.7555C10.2553 27.4486 11.0451 26.2952 12.0678 25.2952L19.7724 17.7271L27.4769 25.2952C28.4996 26.2952 29.2894 27.4486 29.8462 28.7555C30.4031 30.0623 30.6815 31.4316 30.6815 32.8634C30.6815 35.8634 29.619 38.4089 27.494 40.4998C25.369 42.5907 22.7951 43.6361 19.7724 43.6361Z"
        fill="#FF4081"
      />
    </Svg>
  );
};


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
  }, [setSelectedDate]);

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
        <Text
          style={{
            fontSize: 12,
            marginBottom: 4,
            fontWeight: '500',
            color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
          }}
        >
          {item.dayName}
        </Text>
        <View
          style={{
            width: 43,
            height: 43,
            borderRadius: 21.5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isSelected ? '#FF4081' : 'transparent',
            borderWidth: isSelected ? 2 : 0.5,
            borderColor: isSelected ? '#CC1775' : '#FFE5EE',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: isSelected ? '#FFFFFF' : '#090909',
            }}
          >
            {item.day}
          </Text>
        </View>
        {isPeriodDay && !isSelected && (
          <View className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1" />
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
    silly: 'Silly', sad: 'Sad', relaxed: 'Relaxed',
  };
  const moodEmojis: Record<string, string> = {
    normal: '😐', happy: '😊', calm: '😌', hyped: '🤩',
    inLove: '😍', peaceful: '😇', lonely: '😢', angry: '😠',
    silly: '😜', sad: '😔', relaxed: '🙂',
  };
  const medicineLabels: Record<string, string> = {
    condom: 'Condom', pill: 'Pill', patch: 'Patch', iud: 'IUD',
    implant: 'Implant', vRing: 'V-Ring', injection: 'Injection', spermicide: 'Spermicide',
  };

  const formatDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleSave = async () => {
    saveCurrentDay();
    const dateStr = formatDateStr(selectedDate);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // Log the day's data
        await api.put(`/logs/${dateStr}`, {
          flow: dayData.flowLevel,
          symptoms: dayData.symptoms,
          mood: dayData.moods,
          notes: dayData.note,
          weight: dayData.weight,
          temperature: dayData.temperature,
          water_intake: dayData.waterIntake,
        }, token);

        // Start period cycle if marked
        if (dayData.periodStart) {
          await api.post('/cycles/start', { start_date: dateStr }, token);
        }
        // End period cycle if marked
        if (dayData.periodEnd) {
          await api.post('/cycles/end', { end_date: dateStr }, token);
        }
      }
    } catch {}
    Alert.alert('Saved', 'Your log has been saved successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  // Edit pen icon component
  const EditPenIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Path
        d="M1.33333 10.6667H2.28333L8.8 4.15L7.85 3.2L1.33333 9.71667V10.6667ZM0 12V9.16667L8.8 0.383333C8.93333 0.261111 9.08056 0.166667 9.24167 0.1C9.40278 0.0333333 9.57222 0 9.75 0C9.92778 0 10.1 0.0333333 10.2667 0.1C10.4333 0.166667 10.5778 0.266667 10.7 0.4L11.6167 1.33333C11.75 1.45556 11.8472 1.6 11.9083 1.76667C11.9694 1.93333 12 2.1 12 2.26667C12 2.44444 11.9694 2.61389 11.9083 2.775C11.8472 2.93611 11.75 3.08333 11.6167 3.21667L2.83333 12H0ZM8.31667 3.68333L7.85 3.2L8.8 4.15L8.31667 3.68333Z"
        fill="#666666"
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
    <View style={{ backgroundColor: '#FFE5EE' }} className="rounded-2xl mb-3 overflow-hidden">
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
                      <Text className={`text-base ${day.isSelected ? 'text-pink-500 font-semibold' : 'text-white'}`}>{day.date}</Text>
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
          {/* Horizontal scrollable date selector */}
          <FlatList
            ref={flatListRef}
            horizontal
            data={dates}
            keyExtractor={(item) => item.date.toISOString()}
            renderItem={renderDateItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            getItemLayout={(_data, index) => ({
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

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
        {/* Period */}
        <Section title="Period" showChevron={false} showEditIcon={true} onEditPress={handleEditPeriod}>
          <View className="flex-row gap-2">
            {/* Start Button */}
            <TouchableOpacity
              onPress={handlePeriodStart}
              className="flex-1 flex-row items-center justify-center rounded-full"
              style={{
                backgroundColor: dayData.periodStart ? '#EC4899' : '#FFBAD2',
                height: 30,
                paddingHorizontal: 12,
                paddingVertical: 6,
                gap: 5,
                marginEnd: 20,
              }}
            >
              <PlayIcon color={dayData.periodStart ? '#FFFFFF' : '#1C1B1F'} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: dayData.periodStart ? '#FFFFFF' : '#FF4081',
                }}
              >
                Start
              </Text>
            </TouchableOpacity>

            {/* End Button */}
            <TouchableOpacity
              onPress={handlePeriodEnd}
              className="flex-1 flex-row items-center justify-center rounded-full"
              style={{
                backgroundColor: dayData.periodEnd ? '#0134E4' : '#B9C9FF',
                height: 30,
                paddingHorizontal: 12,
                paddingVertical: 6,
                gap: 5,
              }}
            >
              <StopIcon color={dayData.periodEnd ? '#FFFFFF' : '#1C1B1F'} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: dayData.periodEnd ? '#FFFFFF' : '#0134E4',
                }}
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
                <FlowDroplet level={level} selected={dayData.flowLevel === level} />
                <Text className={`text-sm mt-1 ${dayData.flowLevel === level ? 'text-pink-500 font-medium' : 'text-gray-600'}`}>
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
                <View key={m} className="items-center mr-4 mb-2">
                  <Image source={MEDICINE_IMAGES[m] as any} style={{ width: 40, height: 40 }} resizeMode="contain" />
                  <Text className="text-pink-500 text-xs mt-1">{medicineLabels[m]}</Text>
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
          style={{ backgroundColor: '#FFE5EE' }}
          className="rounded-2xl mb-3 flex-row justify-between items-center px-4 py-4"
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
          style={{ backgroundColor: '#FFE5EE' }}
          className="rounded-2xl mb-3 flex-row justify-between items-center px-4 py-4"
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
                  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
                    {/* Circle border */}
                    <Path
                      d="M30 58C45.464 58 58 45.464 58 30C58 14.536 45.464 2 30 2C14.536 2 2 14.536 2 30C2 45.464 14.536 58 30 58Z"
                      stroke={cupFilled ? "#FF4081" : "#FFE4ED"}
                      strokeWidth={2}
                      fill="none"
                    />
                    {/* Glass body */}
                    <Path
                      d="M20 18L22 44H38L40 18H20Z"
                      fill="#BBCAFF"
                    />
                    {/* Water fill */}
                    <Path
                      d="M21.5 30L22 44H38L38.5 30H21.5Z"
                      fill="#4770FD"
                    />
                    {/* Bubble dots */}
                    <Path d="M28 35C28.5523 35 29 34.5523 29 34C29 33.4477 28.5523 33 28 33C27.4477 33 27 33.4477 27 34C27 34.5523 27.4477 35 28 35Z" fill="#BBCAFF" />
                    <Path d="M33 38C33.5523 38 34 37.5523 34 37C34 36.4477 33.5523 36 33 36C32.4477 36 32 36.4477 32 37C32 37.5523 32.4477 38 33 38Z" fill="#BBCAFF" />
                  </Svg>
                  <Text style={{ fontSize: 11, marginTop: 4, color: cupFilled ? '#FF4081' : '#666666' }}>{amount}ml</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>
      </ScrollView>

        {/* Save */}
        <View style={{ alignItems: "center", backgroundColor: "#FF3378" }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              width: 250,
              height: 56,
              backgroundColor: "#FF82AD",
              borderWidth: 0.5,
              borderColor: "#FF669A",
              borderRadius: 1000,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
              marginBottom: 20,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: 15,
                lineHeight: 18,
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 134,
              height: 5,
              backgroundColor: "#FF99BC",
              borderRadius: 100,
              marginBottom: insets.bottom + 8,
            }}
          />
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
