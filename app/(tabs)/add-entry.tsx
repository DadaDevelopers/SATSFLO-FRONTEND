import { api } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [journalTitle, setJournalTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const getWeekDates = (): number[] => {
    const refDate = new Date(currentYear, currentMonth, selectedDate);
    const dayOfWeek = refDate.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentYear, currentMonth, selectedDate - dayOfWeek + i);
      return d.getMonth() === currentMonth ? d.getDate() : 0;
    }).filter((d) => d > 0);
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

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
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
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        await api.post(
          '/journal',
          {
            title: journalTitle || undefined,
            content: notes,
            mood: selectedMood || undefined,
            date: dateStr,
          },
          token
        );
      }
    } catch {}
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
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
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
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

  const formatDate = () => {
    return `${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`;
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
          {getWeekDates().map((date) => (
            <TouchableOpacity
              key={date}
              onPress={() => handleDateSelect(date)}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                selectedDate === date ? 'bg-[#FF4081]' : ''
              }`}
              style={{
                borderWidth: 1,
                borderColor: selectedDate === date ? '#CC1775' : '#FFE5EE',
              }}
            >
              <Text
                className={`text-sm ${
                  selectedDate === date ? 'text-[#090909]' : 'text-[#090909]'
                }`}
              >
                {date}
              </Text>
              {/* White dot indicator for selected date */}
              {selectedDate === date && (
                <View className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </TouchableOpacity>
          ))}
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
            <TouchableOpacity>
              <Feather name="edit-2" size={14} color="#FAFAFA" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between font-inter items-center px-3 py-5 bg-[#FFE6EE] rounded-lg">
            <Text className="text-[#4D4D4D] text-sm">{formatDate()}</Text>
            <Text className="text-[#4D4D4D] text-sm">Cycle Day 9</Text>
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
