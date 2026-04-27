import { Ionicons } from '@expo/vector-icons';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MessageInputProps {
  onSendText?: (message: string) => void;
  onSendImage?: (uri: string) => void;
  onSendVoice?: (uri: string, durationMs: number) => void;
}

export function MessageInput({ onSendText, onSendImage, onSendVoice }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8;

  // ---- Send text ----
  const handleSend = () => {
    if (message.trim()) {
      onSendText?.(message.trim());
      setMessage('');
    }
  };

  // ---- Camera / Gallery ----
  const handleCameraPress = () => {
    setShowCameraModal(true);
  };

  const takePhoto = async () => {
    setShowCameraModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onSendImage?.(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    setShowCameraModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library access is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onSendImage?.(result.assets[0].uri);
    }
  };

  // ---- Voice Recording ----
  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone access is needed to record voice notes.');
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    try {
      clearInterval(timerRef.current!);
      timerRef.current = null;
      const durationMs = recorder.currentTime * 1000;
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
      const uri = recorder.uri;
      setIsRecording(false);
      setRecordingDuration(0);
      if (uri) onSendVoice?.(uri, durationMs);
    } catch {
      setIsRecording(false);
      setRecordingDuration(0);
    }
  };

  const cancelRecording = async () => {
    if (!isRecording) return;
    try {
      clearInterval(timerRef.current!);
      timerRef.current = null;
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
    } catch {
      // ignore
    }
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ paddingBottom: bottomPadding, backgroundColor: '#ff4f93' }}>
      {/* Recording indicator */}
      {isRecording && (
        <View style={styles.recordingBar}>
          <View style={styles.redDot} />
          <Text style={styles.recordingText}>Recording {formatDuration(recordingDuration)}</Text>
          <TouchableOpacity onPress={cancelRecording}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        {/* Camera */}
        <TouchableOpacity onPress={handleCameraPress} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={22} color="white" />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          placeholder="Type a message"
          placeholderTextColor="#ffe6f0"
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          editable={!isRecording}
        />

        {/* Mic */}
        <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7}>
          <Ionicons
            name={isRecording ? 'stop-circle' : 'mic-outline'}
            size={22}
            color={isRecording ? '#FF0000' : 'white'}
          />
        </TouchableOpacity>

        {/* Send Button */}
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn} activeOpacity={0.7}>
          <Ionicons name="send" size={18} color="#ff4f93" />
        </TouchableOpacity>
      </View>

      {/* Home indicator */}
      <View style={styles.indicatorWrap}>
        <View style={styles.indicator} />
      </View>

      {/* Camera / Gallery picker modal */}
      <Modal
        visible={showCameraModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCameraModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCameraModal(false)}
        >
          <View style={[styles.modalSheet, { paddingBottom: bottomPadding + 16 }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Send a photo</Text>

            <TouchableOpacity onPress={takePhoto} style={styles.modalOption}>
              <Ionicons name="camera" size={22} color="#ff4f93" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickFromGallery} style={styles.modalOption}>
              <Ionicons name="image" size={22} color="#ff4f93" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCameraModal(false)}
              style={styles.modalCancel}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5fa0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    color: 'white',
    fontSize: 14,
    padding: 0,
  },
  sendBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    marginLeft: 8,
  },
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelText: {
    color: '#FFD0D0',
    fontSize: 13,
  },
  indicatorWrap: {
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: '#ff5fa0',
  },
  indicator: {
    width: 134,
    height: 5,
    backgroundColor: '#1A1A1A',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 14,
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#999',
  },
});
