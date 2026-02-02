import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, setNote } = useAddLog();
  const dayData = getCurrentDayData();

  const [localNote, setLocalNote] = useState(dayData.note || '');

  useEffect(() => {
    setLocalNote(dayData.note || '');
  }, [dayData.note]);

  const handleSave = () => {
    setNote(localNote);
    router.back();
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: outerBackgroundColor,
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View className="flex-1" style={containerStyle}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-10">
            Notes
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Note Input */}
          <View className="flex-1 px-4 pb-24">
            <View className="flex-1 bg-pink-100 rounded-3xl p-4">
              <View className="flex-row items-start flex-1">
                <View className="w-0.5 bg-pink-400 mr-3 self-stretch" />
                <TextInput
                  className="flex-1 text-gray-700 text-base"
                  placeholder="Write something"
                  placeholderTextColor="#999"
                  value={localNote}
                  onChangeText={setLocalNote}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                  style={{ minHeight: 400 }}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View
            className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-signup-bg"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <TouchableOpacity
              onPress={handleSave}
              className="bg-pink-300 py-4 rounded-full items-center"
            >
              <Text className="text-white font-semibold text-base">Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
