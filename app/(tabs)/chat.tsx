import { BottomNavigation } from '@/components/home/bottom-navigation';
import { ChatListHeader } from '@/components/chat/chat-list-header';
import { ConversationItem } from '@/components/chat/conversation-item';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabName = 'home' | 'calendar' | 'add' | 'chat' | 'settings';
type TopTab = 'Threads' | 'Chats' | 'Groups';

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
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('Chats');
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Curved scoop header with Threads | Chats | Groups */}
      <ChatListHeader activeTab={activeTopTab} onTabChange={setActiveTopTab} />

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
