import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // Hide default tab bar - using custom BottomNavigation
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          href: null, // Hide from navigation for now
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          href: null, // Accessed via home screen button
        }}
      />
      <Tabs.Screen
        name="add-entry"
        options={{
          title: "Add Entry",
          href: null, // Accessed via journal screen button
        }}
      />
      <Tabs.Screen
        name="gift-token"
        options={{
          title: "Gift Token",
          href: null, // Accessed via home screen button
        }}
      />
      <Tabs.Screen
        name="gift-token-wallet"
        options={{
          title: "Gift Token Wallet",
          href: null,
        }}
      />
      <Tabs.Screen
        name="send-gift-token"
        options={{
          title: "Send Gift Token",
          href: null,
        }}
      />
      <Tabs.Screen
        name="send-gift-amount"
        options={{
          title: "Send Gift Amount",
          href: null,
        }}
      />
      <Tabs.Screen
        name="receive-gift-token"
        options={{
          title: "Receive Gift Token",
          href: null,
        }}
      />
      <Tabs.Screen
        name="receive-wallet"
        options={{
          title: "Receive Wallet",
          href: null,
        }}
      />
      <Tabs.Screen
        name="select-wallet"
        options={{
          title: "Select Wallet",
          href: null,
        }}
      />
      <Tabs.Screen
        name="success-sent"
        options={{
          title: "Success Sent",
          href: null,
        }}
      />
      <Tabs.Screen
        name="success-received"
        options={{
          title: "Success Received",
          href: null,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          href: null, // Accessed via edit period button
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          href: null, // Accessed via notification icon
        }}
      />
      <Tabs.Screen
        name="thread"
        options={{
          title: "Thread",
          href: null, // Accessed via chat icon in bottom nav
        }}
      />
      <Tabs.Screen
        name="add-thread"
        options={{
          title: "Add Thread",
          href: null, // Accessed via plus button in thread screen
        }}
      />
      <Tabs.Screen
        name="view-comments"
        options={{
          title: "View Comments",
          href: null, // Accessed via post card in thread screen
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          href: null, // Accessed via Chats tab in thread screen
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          href: null, // Accessed via settings icon in bottom nav
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          title: "My Profile",
          href: null, // Accessed via profile card in settings
        }}
      />
      <Tabs.Screen
        name="period-length-settings"
        options={{
          title: "Period Length",
          href: null,
        }}
      />
      <Tabs.Screen
        name="cycle-length-settings"
        options={{
          title: "Cycle Length",
          href: null,
        }}
      />
      <Tabs.Screen
        name="luteal-phase-settings"
        options={{
          title: "Luteal Phase Length",
          href: null,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          href: null,
        }}
      />
      <Tabs.Screen
        name="invite-partner"
        options={{
          title: "Invite Partner",
          href: null,
        }}
      />
      <Tabs.Screen
        name="sharing-invite"
        options={{
          title: "Sharing Options",
          href: null,
        }}
      />
      <Tabs.Screen
        name="generate-invite"
        options={{
          title: "Generate Code",
          href: null,
        }}
      />
      <Tabs.Screen
        name="partner-pairing-success"
        options={{
          title: "Partner Pairing Successful",
          href: null,
        }}
      />
      <Tabs.Screen
        name="made-for-you"
        options={{
          title: "Made For You",
          href: null,
        }}
      />
      <Tabs.Screen
        name="whats-your-partner-name"
        options={{
          title: "What's Your Partner Name",
          href: null,
        }}
      />
      <Tabs.Screen
        name="enter-code"
        options={{
          title: "Enter Code to Connect",
          href: null,
        }}
      />
    </Tabs>
  );
}
