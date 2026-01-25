import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { CustomStatusBar } from './custom-status-bar';
import { HomeIndicatorArea } from './home-indicator-area';

type AuthScreenContainerProps = {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  bottomContent?: React.ReactNode;
};

export function AuthScreenContainer({
  children,
  scrollEnabled = true,
  bottomContent,
}: AuthScreenContainerProps) {
  return (
    <View className="flex-1 bg-signup-bg">
      <CustomStatusBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {scrollEnabled ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 px-5">{children}</View>
        )}

        {bottomContent && (
          <View className="items-center px-5 pb-2">{bottomContent}</View>
        )}

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
