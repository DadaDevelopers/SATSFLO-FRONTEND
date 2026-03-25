import { ChatHeader } from '@/components/chat/chat-header';
import { MessageBubble } from '@/components/chat/message-bubble';
import { MessageInput } from '@/components/chat/message-input';
import { api } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const { id: conversationId, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!conversationId) return;
    const loadMessages = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      try {
        const { response, data } = await api.get(`/chats/${conversationId}`, token);
        if (response.ok) {
          const list = data?.data?.messages ?? data?.messages ?? data?.data ?? data ?? [];
          const mapped: Message[] = (Array.isArray(list) ? list : []).map((m: any) => ({
            id: String(m.id),
            message: m.content,
            isSent: m.is_sent ?? m.sender_id !== undefined,
            timestamp: m.created_at
              ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          }));
          setMessages(mapped);
        }
      } catch {}
    };
    loadMessages();
  }, [conversationId]);

  const scrollToEnd = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const makeTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleBack = () => router.back();

  // Send text
  const handleSendText = async (text: string) => {
    const tempId = String(Date.now());
    setMessages((prev) => [
      ...prev,
      { id: tempId, message: text, isSent: true, timestamp: makeTimestamp() },
    ]);
    scrollToEnd();
    if (conversationId) {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          await api.post(`/chats/${conversationId}`, { content: text }, token);
        }
      } catch {}
    }
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
