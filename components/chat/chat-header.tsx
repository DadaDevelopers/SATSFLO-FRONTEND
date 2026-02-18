import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  name: string;
  status?: string;
  avatar?: ImageSourcePropType | null;
  onBackPress: () => void;
  onAvatarPress?: () => void;
}

export function ChatHeader({
  name,
  status = 'Typing...',
  avatar,
  onBackPress,
  onAvatarPress,
}: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity onPress={onBackPress} style={styles.backBtn} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Center user info */}
      <View style={styles.centerInfo}>
        <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
          {avatar ? (
            <Image source={avatar} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{name.charAt(0)}</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.username}>{name}</Text>
        {status && <Text style={styles.status}>{status}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 35,
  },
  backBtn: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  centerInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffd6e6',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#ff4f93',
    fontSize: 18,
    fontWeight: '700',
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    color: '#ffe6f0',
    fontSize: 13,
    marginTop: 2,
  },
});
