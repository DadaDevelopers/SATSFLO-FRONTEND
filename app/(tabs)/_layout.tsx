import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar - using custom BottomNavigation
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: null, // Hide from navigation for now
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          href: null, // Accessed via home screen button
        }}
      />
      <Tabs.Screen
        name="add-entry"
        options={{
          title: 'Add Entry',
          href: null, // Accessed via journal screen button
        }}
      />
      <Tabs.Screen
        name="gift-token"
        options={{
          title: 'Gift Token',
          href: null, // Accessed via home screen button
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          href: null, // Accessed via edit period button
        }}
      />
    </Tabs>
  );
}
