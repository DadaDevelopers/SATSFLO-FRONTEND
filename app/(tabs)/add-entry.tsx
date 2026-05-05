import { api } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const MOODS = [
  { id: 'inlove', emoji: '😍', label: 'In love' },
  { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
  { id: 'lonely', emoji: '😢', label: 'Lonely' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
  { id: 'normal', emoji: '🙂', label: 'Normal' },
  { id: 'happy', emoji: '😄', label: 'Happy' },
  { id: 'calm', emoji: '😊', label: 'Calm' },
  { id: 'hyped', emoji: '🤩', label: 'Hyped' },
];

const SYMPTOM_TAGS = [
  ['Clear skin', 'Bloating', 'Happy', 'High energy'],
  ['Clear skin', 'Happy', 'Happy', 'High energy'],
  ['Clear skin', 'Bloating', 'Custom'],
];

export default function AddEntryScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [searchText, setSearchText] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(() => toDateKey(today));
  const [journalTitle, setJournalTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  // Date picker modal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerDate, setPickerDate] = useState('');
  const [dateInputText, setDateInputText] = useState(() => {
    const [y, m, d] = toDateKey(today).split('-').map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  });
  const [cycleDayInput, setCycleDayInput] = useState('');

  useEffect(() => {
    const loadCycle = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      try {
        const { response, data } = await api.get('/cycles/current', token);
        if (response.ok) {
          const d = data?.data ?? data;
          if (d?.last_period_start) setLastPeriodStart(d.last_period_start);
          if (d?.cycle_length) setCycleLength(d.cycle_length);
        }
      } catch {}
    };
    loadCycle();
  }, []);

  // Keep inline fields in sync whenever selected date or cycle data changes
  useEffect(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    setDateInputText(`${MONTHS[m - 1]} ${d}, ${y}`);
    if (lastPeriodStart) {
      const selDate = new Date(y, m - 1, d);
      const periodDate = new Date(lastPeriodStart + 'T00:00:00');
      const diffDays = Math.floor((selDate.getTime() - periodDate.getTime()) / 86400000);
      if (diffDays >= 0) {
        setCycleDayInput(String((diffDays % (cycleLength || 28)) + 1));
      } else {
        setCycleDayInput('');
      }
    }
  }, [selectedDate, lastPeriodStart, cycleLength]);

  // Build full month grid for the date-picker modal
  const getMonthGrid = (year: number, month: number): (Date | null)[] => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  };

  const computeCycleDayForDate = (dateKey: string): number | null => {
    if (!lastPeriodStart) return null;
    const [y, m, d] = dateKey.split('-').map(Number);
    const selDate = new Date(y, m - 1, d);
    const periodDate = new Date(lastPeriodStart + 'T00:00:00');
    const diffDays = Math.floor((selDate.getTime() - periodDate.getTime()) / 86400000);
    if (diffDays < 0) return null;
    return (diffDays % cycleLength) + 1;
  };

  const openDatePicker = () => {
    const [y, m] = selectedDate.split('-').map(Number);
    setPickerYear(y);
    setPickerMonth(m - 1);
    setPickerDate(selectedDate);
    setDateInputText(formatDateKey(selectedDate));
    const cd = computeCycleDayForDate(selectedDate);
    setCycleDayInput(cd != null ? String(cd) : '');
    setShowDatePicker(true);
  };

  const formatDateKey = (key: string): string => {
    const [y, m, d] = key.split('-').map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  };

  const handlePickerDateSelect = (d: Date) => {
    const key = toDateKey(d);
    setPickerDate(key);
    setDateInputText(formatDateKey(key));
    const cd = computeCycleDayForDate(key);
    setCycleDayInput(cd != null ? String(cd) : '');
  };

  const handleDateInputBlur = () => {
    // Try to parse typed date — accept "Month D, YYYY" or "YYYY-MM-DD"
    const isoMatch = dateInputText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const key = dateInputText;
      setPickerDate(key);
      const [, y, m] = isoMatch.map(Number);
      setPickerMonth(m - 1);
      setPickerYear(y);
      const cd = computeCycleDayForDate(key);
      setCycleDayInput(cd != null ? String(cd) : '');
      return;
    }
    const monthMatch = dateInputText.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
    if (monthMatch) {
      const mIdx = MONTHS.findIndex(mn => mn.toLowerCase().startsWith(monthMatch[1].toLowerCase()));
      if (mIdx !== -1) {
        const key = `${monthMatch[3]}-${String(mIdx + 1).padStart(2, '0')}-${String(Number(monthMatch[2])).padStart(2, '0')}`;
        setPickerDate(key);
        setPickerMonth(mIdx);
        setPickerYear(Number(monthMatch[3]));
        const cd = computeCycleDayForDate(key);
        setCycleDayInput(cd != null ? String(cd) : '');
      }
    }
  };

  const confirmDatePicker = () => {
    if (pickerDate) {
      setSelectedDate(pickerDate);
      const [y, m] = pickerDate.split('-').map(Number);
      setCurrentMonth(m - 1);
      setCurrentYear(y);
    }
    setShowDatePicker(false);
  };

  const getWeekDates = (): Date[] => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const refDate = new Date(y, m - 1, d);
    const dayOfWeek = refDate.getDay();
    return Array.from({ length: 7 }, (_, i) => new Date(y, m - 1, d - dayOfWeek + i));
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDateSelect = (d: Date) => {
    setSelectedDate(toDateKey(d));
    if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) {
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId === selectedMood ? null : moodId);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    const dateStr = selectedDate;
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Not logged in. Please sign in again.');
        return;
      }
      const symptoms = selectedTags.map((id) => id.replace(/-\d+-\d+$/, ''));
      const { response, data } = await api.post(
        '/journal',
        {
          title: journalTitle || undefined,
          content: notes || undefined,
          mood: selectedMood || undefined,
          symptoms: symptoms.length > 0 ? symptoms : undefined,
          images: selectedImages.length > 0 ? selectedImages : undefined,
          date: dateStr,
        },
        token
      );
      if (!response.ok) {
        Alert.alert('Save failed', data?.message ?? `Error ${response.status}`);
        return;
      }
    } catch (err: any) {
      Alert.alert('Network error', err?.message ?? 'Could not reach server.');
      return;
    }
    router.back();
  };

  const handleAttachMedia = () => {
    setShowMediaPicker(true);
  };

  const pickImageFromGallery = async () => {
    setShowMediaPicker(false);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets
        .filter(a => a.base64)
        .map(a => `data:image/jpeg;base64,${a.base64}`);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const takePhoto = async () => {
    setShowMediaPicker(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setSelectedImages([...selectedImages, `data:image/jpeg;base64,${result.assets[0].base64}`]);
    }
  };

  const pickFromCloud = () => {
    setShowMediaPicker(false);
    // For cloud storage, you would integrate with services like Google Drive, Dropbox, etc.
    // This is a placeholder that uses the document picker as an alternative
    Alert.alert(
      'Cloud Storage',
      'Cloud storage integration coming soon! For now, please use the gallery option.',
      [{ text: 'OK' }]
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: '#FF4081' }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white font-inter text-xl font-medium tracking-tight">
            Add New Entry
          </Text>
        </View>
        <View className="w-6" />
      </View>

      {/* Search Bar */}
      <View className="px-5 mt-2">
        <View className="flex-row items-center px-4 py-3 border border-[#FFB3CD] rounded-lg">
          <Feather name="search" size={16} color="#FAFAFA" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search here"
            placeholderTextColor="#FAFAFA"
            className="flex-1 ml-2 text-white text-md"
          />
        </View>
      </View>

      {/* Calendar Section */}
      <View className="px-4 mt-4">
        {/* Month Navigation */}
        <View className="flex-row justify-between items-center py-2 px-2">
          <TouchableOpacity onPress={handlePreviousMonth} className="p-2">
            <Feather name="chevron-left" size={16} color="#FAFAFA" />
          </TouchableOpacity>
          <Text className="text-[#FAFAFA] text-2xl font-normal">
            {MONTHS[currentMonth]}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} className="p-2">
            <Feather name="chevron-right" size={16} color="#FAFAFA" />
          </TouchableOpacity>
        </View>

        {/* Week Days Row */}
        <View className="flex-row justify-between px-2 mt-2">
          {WEEK_DAYS.map((day) => (
            <View key={day} className="w-10 items-center">
              <Text className="text-[#FAFAFA] text-sm">{day}</Text>
            </View>
          ))}
        </View>

        {/* Date Circles Row */}
        <View className="flex-row justify-between px-2 mt-3">
          {getWeekDates().map((d) => {
            const key = toDateKey(d);
            const isSelected = key === selectedDate;

            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleDateSelect(d)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: '#FFDFEA',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Text style={{ fontSize: 14, color: '#090909' }}>
                  {d.getDate()}
                </Text>
                {isSelected && (
                  <View style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#FAFAFA',
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Date and Cycle Day */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white text-sm font-inter font-medium">Date and Cycle Day</Text>
            <TouchableOpacity onPress={openDatePicker}>
              <Feather name="edit-2" size={14} color="#FAFAFA" />
            </TouchableOpacity>
          </View>
          <View style={{ height: 60, backgroundColor: '#FFE6EE', borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
            <TextInput
              value={dateInputText}
              onChangeText={setDateInputText}
              onBlur={handleDateInputBlur}
              onSubmitEditing={handleDateInputBlur}
              placeholder="e.g. April 15, 2025"
              placeholderTextColor="#AAAAAA"
              returnKeyType="done"
              style={{ flex: 1, fontSize: 14, color: '#4D4D4D', fontFamily: 'Inter' }}
            />
            <TextInput
              value={cycleDayInput ? `Cycle Day ${cycleDayInput}` : ''}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                setCycleDayInput(num);
              }}
              placeholder="Cycle Day"
              placeholderTextColor="#AAAAAA"
              keyboardType="number-pad"
              style={{ fontSize: 14, color: '#4D4D4D', fontFamily: 'Inter', textAlign: 'right' }}
            />
          </View>
        </View>

        {/* Journal Title */}
        <View className="mb-5 font-inter">
          <Text className="text-white text-sm  font-medium mb-1">
            Journal Title <Text className="font-normal italic">(Optional)</Text>
          </Text>
          <View className="px-3 py-5 bg-[#FFE6EE] rounded-lg">
            <TextInput
              value={journalTitle}
              onChangeText={setJournalTitle}
              placeholder="Enter journal title...."
              placeholderTextColor="#4D4D4D"
              className="text-[#4D4D4D] text-sm"
            />
          </View>
        </View>

        {/* Mood Selector */}
        <View className="mb-5">
          <Text className="text-white text-sm font-medium mb-2">Mood Selector</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => handleMoodSelect(mood.id)}
                className="items-center"
              >
                <View
                  className={`w-[50px] h-[50px] rounded-full items-center justify-center border-2 ${
                    selectedMood === mood.id
                      ? 'bg-[#FFE6EE] border-[#FFE4ED]'
                      : 'bg-[#FFE6EE] border-[#FFE4ED]'
                  }`}
                >
                  <Text className="text-2xl">{mood.emoji}</Text>
                </View>
                <Text
                  className={`text-xs mt-1 ${
                    selectedMood === mood.id ? 'text-[#CC0045] font-medium' : 'text-[#FAFAFA]'
                  }`}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Symptoms Tags */}
        <View className="mb-5">
          <Text className="text-white text-sm font-medium mb-2">Symptoms Tags</Text>
          <View className="p-3 bg-[#FEE7EF] rounded-lg gap-3">
            {SYMPTOM_TAGS.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row flex-wrap gap-2">
                {row.map((tag, tagIndex) => {
                  const tagId = `${tag}-${rowIndex}-${tagIndex}`;
                  const isSelected = selectedTags.includes(tagId);
                  return (
                    <TouchableOpacity
                      key={tagId}
                      onPress={() => handleTagToggle(tagId)}
                      className={`relative px-3 py-1 rounded-full border ${
                        isSelected
                          ? 'bg-[#FF4081] border-[#FF4081]'
                          : 'bg-[#FFCCDD] border-[#FFCCDD]'
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          isSelected ? 'text-white font-medium' : 'text-[#090909]'
                        }`}
                      >
                        {tag}
                      </Text>
                      {!isSelected && (
                        <View className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFCCDD] rounded-full items-center justify-center border border-[#FEE7EF]">
                          <Text className="text-[#666666] text-[8px]">+</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View className="mb-5">
          <Text className="text-white text-sm font-inter font-medium mb-1">Notes</Text>
          <View className="px-3 py-5 bg-[#FFE6EE] rounded-lg h-40">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="| Write something"
              placeholderTextColor="#000000"
              multiline
              textAlignVertical="top"
              className="text-[#000000] text-sm flex-1"
            />
          </View>
        </View>

        {/* Upload Images/Videos */}
        <View className="mb-5">
          <Text className="text-white text-sm font-medium mb-1">
            Upload Images/Videos <Text className="font-normal italic">(Optional)</Text>
          </Text>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-3"
              contentContainerStyle={{ gap: 8 }}
            >
              {selectedImages.map((uri, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri }}
                    className="w-20 h-20 rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF4081] rounded-full items-center justify-center"
                  >
                    <Feather name="x" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={handleAttachMedia}
            className="flex-row items-center justify-center py-4 bg-[#FFE4ED] border border-dashed border-[#FF4081] rounded-lg"
          >
            <Feather name="plus" size={12} color="#FF4081" />
            <Text className="text-[#FF4081] text-xs font-medium ml-1">
              Attach Images/Videos
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 pb-2" style={{ backgroundColor: '#FF4081' }}>
        <View className="px-16 mb-4">
          <TouchableOpacity
            onPress={handleSave}
            className="py-4 bg-[#FFB9D1] border border-[#FF99BC] rounded-full items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-[15px] font-medium">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Home Indicator */}
        <View
          className="h-8 bg-[#FF3378] items-center justify-end pb-2"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }}
        >
          <View className="w-32 h-1.5 bg-[#FF99BC] rounded-full" />
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{ backgroundColor: '#FFF0F5', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>

              {/* Drag handle */}
              <View style={{ width: 48, height: 4, backgroundColor: '#FFB3CD', borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />

              <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 16, color: '#1E1E1E', textAlign: 'center', marginBottom: 16 }}>
                Pick a Date
              </Text>

              {/* Month navigation */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (pickerMonth === 0) { setPickerMonth(11); setPickerYear(pickerYear - 1); }
                    else setPickerMonth(pickerMonth - 1);
                  }}
                  style={{ padding: 8 }}
                >
                  <Feather name="chevron-left" size={20} color="#FF4081" />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 15, color: '#1E1E1E' }}>
                  {MONTHS[pickerMonth]} {pickerYear}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (pickerMonth === 11) { setPickerMonth(0); setPickerYear(pickerYear + 1); }
                    else setPickerMonth(pickerMonth + 1);
                  }}
                  style={{ padding: 8 }}
                >
                  <Feather name="chevron-right" size={20} color="#FF4081" />
                </TouchableOpacity>
              </View>

              {/* Weekday headers */}
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                {WEEK_DAYS.map(d => (
                  <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter', fontSize: 12, color: '#888888' }}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Day grid */}
              {(() => {
                const grid = getMonthGrid(pickerYear, pickerMonth);
                const rows: (Date | null)[][] = [];
                for (let i = 0; i < grid.length; i += 7) rows.push(grid.slice(i, i + 7));
                return rows.map((row, ri) => (
                  <View key={ri} style={{ flexDirection: 'row', marginBottom: 4 }}>
                    {row.map((day, ci) => {
                      if (!day) return <View key={ci} style={{ flex: 1 }} />;
                      const key = toDateKey(day);
                      const isSelected = key === pickerDate;
                      return (
                        <TouchableOpacity
                          key={ci}
                          onPress={() => handlePickerDateSelect(day)}
                          style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}
                        >
                          <View style={{
                            width: 34, height: 34, borderRadius: 17,
                            backgroundColor: isSelected ? '#FF4081' : 'transparent',
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Text style={{
                              fontFamily: 'Inter', fontSize: 13,
                              color: isSelected ? '#FFFFFF' : '#1E1E1E',
                              fontWeight: isSelected ? '600' : '400',
                            }}>
                              {day.getDate()}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ));
              })()}

              {/* Date text input */}
              <View style={{ marginTop: 12, marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Inter', fontSize: 12, color: '#888888', marginBottom: 4 }}>
                  Date (e.g. April 15, 2025 or 2025-04-15)
                </Text>
                <View style={{ borderWidth: 1, borderColor: '#FFB3CD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' }}>
                  <TextInput
                    value={dateInputText}
                    onChangeText={setDateInputText}
                    onBlur={handleDateInputBlur}
                    placeholder="April 15, 2025"
                    placeholderTextColor="#BBBBBB"
                    style={{ fontFamily: 'Inter', fontSize: 14, color: '#1E1E1E' }}
                    returnKeyType="done"
                    onSubmitEditing={handleDateInputBlur}
                  />
                </View>
              </View>

              {/* Cycle day input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontFamily: 'Inter', fontSize: 12, color: '#888888', marginBottom: 4 }}>
                  Cycle Day <Text style={{ fontStyle: 'italic' }}>(Optional — auto-filled)</Text>
                </Text>
                <View style={{ borderWidth: 1, borderColor: '#FFB3CD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' }}>
                  <TextInput
                    value={cycleDayInput}
                    onChangeText={setCycleDayInput}
                    placeholder="e.g. 5"
                    placeholderTextColor="#BBBBBB"
                    keyboardType="number-pad"
                    style={{ fontFamily: 'Inter', fontSize: 14, color: '#1E1E1E' }}
                  />
                </View>
              </View>

              {/* Confirm button */}
              <TouchableOpacity
                onPress={confirmDatePicker}
                style={{ backgroundColor: '#FF4081', borderRadius: 999, paddingVertical: 14, alignItems: 'center' }}
                activeOpacity={0.85}
              >
                <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 15, color: '#FFFFFF' }}>Confirm</Text>
              </TouchableOpacity>

            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Media Picker Modal */}
      <Modal
        visible={showMediaPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowMediaPicker(false)}
        >
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

            <Text className="text-lg font-semibold text-center mb-6">
              Select Image Source
            </Text>

            <TouchableOpacity
              onPress={pickImageFromGallery}
              className="flex-row items-center p-4 bg-[#FFE6EE] rounded-xl mb-3"
            >
              <View className="w-10 h-10 bg-[#FF4081] rounded-full items-center justify-center">
                <Feather name="image" size={20} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-medium text-[#090909]">Photo Library</Text>
                <Text className="text-xs text-[#666666]">Choose from your device</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePhoto}
              className="flex-row items-center p-4 bg-[#FFE6EE] rounded-xl mb-3"
            >
              <View className="w-10 h-10 bg-[#FF4081] rounded-full items-center justify-center">
                <Feather name="camera" size={20} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-medium text-[#090909]">Camera</Text>
                <Text className="text-xs text-[#666666]">Take a new photo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickFromCloud}
              className="flex-row items-center p-4 bg-[#FFE6EE] rounded-xl mb-3"
            >
              <View className="w-10 h-10 bg-[#FF4081] rounded-full items-center justify-center">
                <Feather name="cloud" size={20} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-base font-medium text-[#090909]">Cloud Storage</Text>
                <Text className="text-xs text-[#666666]">Google Drive, Dropbox, etc.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMediaPicker(false)}
              className="mt-4 py-4 items-center"
            >
              <Text className="text-[#FF4081] font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
