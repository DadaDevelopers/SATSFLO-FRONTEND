import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface MessageBubbleProps {
  message?: string;
  isSent: boolean;
  timestamp?: string;
  imageUri?: string;
  audioUri?: string;
}

const MY_COLOR = '#ffb6d5';
const OTHER_COLOR = '#ffe6f0';

// Curved tail for "other" (left) bubbles — bottom-left hook
function LeftTail() {
  return (
    <View style={styles.leftTail}>
      <Svg width={12} height={16} viewBox="0 0 12 16">
        <Path d="M 12 0 Q 12 10 0 16 Q 6 10 8 0 Z" fill={OTHER_COLOR} />
      </Svg>
    </View>
  );
}

// Curved tail for "me" (right) bubbles — bottom-right hook
function RightTail() {
  return (
    <View style={styles.rightTail}>
      <Svg width={12} height={16} viewBox="0 0 12 16">
        <Path d="M 0 0 Q 0 10 12 16 Q 6 10 4 0 Z" fill={MY_COLOR} />
      </Svg>
    </View>
  );
}

export function MessageBubble({ message, isSent, timestamp, imageUri, audioUri }: MessageBubbleProps) {
  const isMe = isSent;

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
      <View style={styles.bubbleOuter}>
        {/* Curved tail */}
        {isMe ? <RightTail /> : <LeftTail />}

        {/* Bubble body */}
        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : audioUri ? (
            <View style={styles.voiceRow}>
              <Text style={styles.voiceIcon}>🎵</Text>
              <View style={styles.voiceBarWrap}>
                <View style={[styles.voiceBar, { backgroundColor: isMe ? '#e89ab5' : '#ddb5c8' }]} />
              </View>
              <Text style={styles.voiceLabel}>Voice note</Text>
            </View>
          ) : message ? (
            <Text style={styles.messageText}>{message}</Text>
          ) : (
            <View style={styles.placeholder} />
          )}
          {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 14,
    marginVertical: 10,
  },
  rowMe: {
    alignItems: 'flex-end',
  },
  rowOther: {
    alignItems: 'flex-start',
  },
  bubbleOuter: {
    position: 'relative',
    maxWidth: '70%',
  },
  bubble: {
    padding: 14,
    borderRadius: 15,
    minHeight: 50,
    minWidth: 160,
  },
  myBubble: {
    backgroundColor: MY_COLOR,
    borderBottomRightRadius: 3,
    marginRight: 6,
  },
  otherBubble: {
    backgroundColor: OTHER_COLOR,
    borderBottomLeftRadius: 3,
    marginLeft: 6,
  },
  leftTail: {
    position: 'absolute',
    bottom: -3,
    left: -4,
    zIndex: 1,
  },
  rightTail: {
    position: 'absolute',
    bottom: -3,
    right: -4,
    zIndex: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  placeholder: {
    height: 22,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceIcon: {
    fontSize: 18,
  },
  voiceBarWrap: {
    flex: 1,
  },
  voiceBar: {
    height: 4,
    borderRadius: 2,
  },
  voiceLabel: {
    fontSize: 11,
    color: '#666',
  },
});
