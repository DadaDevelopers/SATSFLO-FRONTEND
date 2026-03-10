import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
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
            <Svg width={18} height={15} viewBox="0 0 18 15" fill="none">
              <Path
                d="M0.219376 6.96993L6.96937 0.219934C7.11011 0.0792027 7.30098 0.000141144 7.5 0.000141144C7.69902 0.000141144 7.88989 0.0792027 8.03063 0.219934C8.17136 0.360664 8.25042 0.551536 8.25042 0.750559C8.25042 0.949582 8.17136 1.14045 8.03063 1.28118L2.56031 6.75056L17.25 6.75056C17.4489 6.75056 17.6397 6.82958 17.7803 6.97023C17.921 7.11088 18 7.30165 18 7.50056C18 7.69947 17.921 7.89024 17.7803 8.03089C17.6397 8.17154 17.4489 8.25056 17.25 8.25056L2.56031 8.25056L8.03063 13.7199C8.17136 13.8607 8.25042 14.0515 8.25042 14.2506C8.25042 14.4496 8.17136 14.6405 8.03063 14.7812C7.88989 14.9219 7.69902 15.001 7.5 15.001C7.30098 15.001 7.11011 14.9219 6.96937 14.7812L0.219376 8.03119C0.149643 7.96153 0.0943222 7.87881 0.0565796 7.78776C0.018837 7.69672 -0.000589371 7.59912 -0.000589371 7.50056C-0.000589371 7.402 0.018837 7.3044 0.0565796 7.21335C0.0943222 7.12231 0.149643 7.03959 0.219376 6.96993Z"
                fill="white"
              />
            </Svg>
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
          <View className="flex-1 px-4 pb-4">
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFE5EE',
                borderRadius: 24,
                padding: 16,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: '#1E1E1E',
                  fontSize: 16,
                  minHeight: 400,
                  textAlignVertical: 'top',
                }}
                placeholder="Write something"
                placeholderTextColor="#999"
                value={localNote}
                onChangeText={setLocalNote}
                multiline
                autoFocus
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Save Button */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              width: 250,
              height: 56,
              backgroundColor: '#FF82AD',
              borderWidth: 0.5,
              borderColor: '#FF669A',
              borderRadius: 1000,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontWeight: '500',
                fontSize: 15,
                lineHeight: 18,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Save
            </Text>
          </TouchableOpacity>

          {/* Home indicator strip */}
          <View
            style={{
              width: '100%',
              height: 34 + (isDesktop ? 0 : insets.bottom),
              backgroundColor: '#FF3378',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: 134,
                height: 5,
                backgroundColor: '#FF99BC',
                borderRadius: 100,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
