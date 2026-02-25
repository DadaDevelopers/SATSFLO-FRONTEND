import { BottomNavigation } from '@/components/home/bottom-navigation';
import { ConversationItem } from '@/components/chat/conversation-item';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type TabName = 'home' | 'calendar' | 'add' | 'chat' | 'settings';
type TabType = 'threads' | 'chats' | 'groups';

const getHeaderPath = (tab: TabType): string => {
  switch (tab) {
    case 'threads':
      return 'M-22 24C-22 10.7452 -11.2548 0 2 0H398C411.255 0 422 10.7452 422 24V51.8621C422 65.1169 411.255 75.8621 398 75.8621H145.424C135.281 75.8621 126.537 82.9951 124.5 92.931C122.463 102.867 113.719 110 103.576 110H2C-11.2548 110 -22 99.2548 -22 86V24Z';
    case 'chats':
      return 'M-22 24C-22 10.7452 -11.2548 0 2 0H398C411.255 0 422 10.7452 422 24V51.8621C422 65.1169 411.255 75.8621 398 75.8621H276.424C266.281 75.8621 257.537 82.9951 255.5 92.931C253.463 102.867 244.719 110 234.576 110H157.424C147.281 110 138.537 102.867 136.5 92.931C134.463 82.9951 125.719 75.8621 115.576 75.8621H2C-11.2548 75.8621 -22 65.1169 -22 51.8621V24Z';
    case 'groups':
      return 'M-22 24C-22 10.7452 -11.2548 0 2 0H398C411.255 0 422 10.7452 422 24V86C422 99.2548 411.255 110 398 110H289.424C279.281 110 270.537 102.867 268.5 92.931C266.463 82.9951 257.719 75.8621 247.576 75.8621H2C-11.2548 75.8621 -22 65.1169 -22 51.8621V24Z';
  }
};

// Sample conversation data (8 items per Figma)
const conversations = [
  { id: '1', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '2', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '3', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '4', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '5', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '6', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '7', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
  { id: '8', name: 'Zuri Hassan', lastMessage: 'Crazy cravings with heavy crumps!!', timestamp: '5:20 PM', isOnline: true },
];

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>('chat');
  const [activeTopTab, setActiveTopTab] = useState<TabType>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTopTabPress = (tab: TabType) => {
    if (tab === 'threads') {
      router.push('/(tabs)/thread');
    } else {
      setActiveTopTab(tab);
    }
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        router.push('/(tabs)');
        break;
      case 'calendar':
        router.push('/calendar');
        break;
      case 'add':
        router.push('/add-log');
        break;
      case 'settings':
        router.push('/(tabs)/settings');
        break;
      default:
        break;
    }
  };

  const handleConversationPress = (id: string, name: string) => {
    router.push({
      pathname: '/chat/conversation',
      params: { id, name },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FF4081', paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FFC1D6" />

      {/* Curved SVG Header — same as thread.tsx */}
      <View style={{ position: 'relative', paddingBottom: 14 }}>
        <Svg width="100%" height={110} viewBox="0 0 393 110" preserveAspectRatio="none">
          <Path d={getHeaderPath(activeTopTab)} fill="#FFCCDD" />
        </Svg>

        <View
          style={{
            position: 'absolute',
            bottom: 25,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Pressable onPress={() => handleTopTabPress('threads')}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                color: activeTopTab === 'threads' ? '#FF4081' : '#FFFFFF',
              }}
            >
              Threads
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTopTabPress('chats')}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                color: activeTopTab === 'chats' ? '#FF4081' : '#FFFFFF',
              }}
            >
              Chats
            </Text>
          </Pressable>

          <Pressable onPress={() => handleTopTabPress('groups')}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                color: activeTopTab === 'groups' ? '#FF4081' : '#FFFFFF',
              }}
            >
              Groups
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 25,
            paddingHorizontal: 16,
            height: 42,
          }}
        >
          <Feather name="search" size={18} color="#AAAAAA" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 14,
              color: '#555',
              padding: 0,
            }}
            placeholder="Search post"
            placeholderTextColor="#AAAAAA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversation List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            name={item.name}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            isOnline={item.isOnline}
            avatar={null}
            onPress={() => handleConversationPress(item.id, item.name)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, paddingTop: 4 }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}
