import { ChatHeader } from '@/components/chat/chat-header';
import { MessageBubble } from '@/components/chat/message-bubble';
import { MessageInput } from '@/components/chat/message-input';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  message?: string;
  isSent: boolean;
  timestamp?: string;
  imageUri?: string;
  audioUri?: string;
}

// Dummy messages matching the Figma placeholders
const initialMessages: Message[] = [
  { id: '1', message: 'Hey how are you?', isSent: false },
  { id: '2', message: "I'm good 😄", isSent: true },
  { id: '3', message: 'What are you doing?', isSent: false },
  { id: '4', message: 'Just chilling', isSent: true },
  { id: '5', message: 'Same here 😂', isSent: false },
];

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const scrollToEnd = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const makeTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleBack = () => router.back();

  // Send text
  const handleSendText = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), message: text, isSent: true, timestamp: makeTimestamp() },
    ]);
    scrollToEnd();
  };

  // Send image
  const handleSendImage = (uri: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), isSent: true, imageUri: uri, timestamp: makeTimestamp() },
    ]);
    scrollToEnd();
  };

  // Send voice note
  const handleSendVoice = (uri: string, _durationMs: number) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), isSent: true, audioUri: uri, timestamp: makeTimestamp() },
    ]);
    scrollToEnd();
  };

  // Tap avatar → change profile picture
  const handleAvatarPress = () => {
    Alert.alert('Profile Picture', 'Change profile picture', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is needed.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            setProfileAvatar(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Photo library access is needed.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            setProfileAvatar(result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#ff4f93" />

      {/* Header */}
      <ChatHeader
        name={name || 'Zuri Hassan'}
        status="Typing..."
        avatar={profileAvatar ? { uri: profileAvatar } : null}
        onBackPress={handleBack}
        onAvatarPress={handleAvatarPress}
      />

      {/* Messages + Input */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item.message}
              isSent={item.isSent}
              timestamp={item.timestamp}
              imageUri={item.imageUri}
              audioUri={item.audioUri}
            />
          )}
          contentContainerStyle={styles.chatArea}
          showsVerticalScrollIndicator={false}
        />

        <MessageInput
          onSendText={handleSendText}
          onSendImage={handleSendImage}
          onSendVoice={handleSendVoice}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4f93',
  },
  flex: {
    flex: 1,
  },
  chatArea: {
    flexGrow: 1,
    paddingVertical: 20,
  },
});
