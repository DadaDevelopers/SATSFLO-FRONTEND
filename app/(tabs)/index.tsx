import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { HomeHeader } from '@/components/home/home-header';
import { CycleWheel } from '@/components/home/cycle-wheel';
import { PhaseLegend } from '@/components/home/phase-legend';
import { BottomNavigation } from '@/components/home/bottom-navigation';

type TabName = 'home' | 'calendar' | 'add' | 'chat' | 'settings';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>('home');

  // Sample data - in a real app, this would come from user's data/state
  const cycleData = {
    currentDay: 26,
    cycleLength: 31,
    periodLength: 5,
    daysUntilPeriod: 13,
    currentDate: 'October 26th',
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    // Navigate to respective screens
    switch (tab) {
      case 'calendar':
        // router.push('/calendar');
        break;
      case 'add':
        // Open add modal or navigate to add screen
        break;
      case 'chat':
        // router.push('/chat');
        break;
      case 'settings':
        // router.push('/settings');
        break;
      default:
        break;
    }
  };

  const handleEditPeriod = () => {
    // Navigate to edit period screen
    // router.push('/edit-period');
  };

  const handleNotificationPress = () => {
    // Navigate to notifications
    // router.push('/notifications');
  };

  const handleGiftTokenPress = () => {
    // Navigate to gift token screen
    // router.push('/gift-token');
  };

  return (
    <View className="flex-1 bg-home-bg" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FF4081" />

      {/* Header */}
      <HomeHeader
        onNotificationPress={handleNotificationPress}
      />

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle Wheel */}
        <View className="items-center mt-4">
          <CycleWheel
            currentDay={cycleData.currentDay}
            cycleLength={cycleData.cycleLength}
            periodLength={cycleData.periodLength}
            daysUntilPeriod={cycleData.daysUntilPeriod}
            currentDate={cycleData.currentDate}
            onEditPeriod={handleEditPeriod}
          />
        </View>

        {/* Phase Legend */}
        <PhaseLegend />

        {/* Divider */}
        <View className="h-[0.5px] bg-home-card-border my-6" />

        {/* Gift Token Button */}
        <View className="items-center">
          <TouchableOpacity
            onPress={handleGiftTokenPress}
            className="flex-row items-center justify-center px-4 py-3 bg-home-bg border border-home-gift-border rounded-full"
            activeOpacity={0.8}
          >
            <Feather name="gift" size={24} color="#FFFFFF" />
            <Text className="text-white text-xs font-medium ml-2">Gift Token</Text>
          </TouchableOpacity>
        </View>

        {/* Extra spacing for scroll */}
        <View className="h-10" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}
