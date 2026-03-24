import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CurrencyType = 'USD' | 'EUR' | 'KES' | 'NGN';

const conversionRates: Record<CurrencyType, number> = {
  USD: 1056,
  EUR: 1150,
  KES: 8,
  NGN: 0.7,
};

export default function SendGiftAmountScreen() {
  const insets = useSafeAreaInsets();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.push('/(tabs)/send-gift-token');
    }
  };

  const handleScanQR = () => {
    Alert.alert('QR Scanning', 'Please type or paste the destination address manually.');
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setDestination(text);
        Alert.alert('Pasted', `Destination set to: ${text}`);
      } else {
        Alert.alert('Clipboard Empty', 'No text found in clipboard');
      }
    } catch (error) {
      console.error('Paste error:', error);
      Alert.alert('Error', 'Failed to paste from clipboard');
    }
  };

  const toggleCurrency = () => {
    setShowCurrencyDropdown(!showCurrencyDropdown);
  };

  const selectCurrency = (curr: CurrencyType) => {
    setCurrency(curr);
    setShowCurrencyDropdown(false);
  };

  const calculateSatsEquivalent = (): string => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return '0';
    }
    const satsEquivalent = amountValue * conversionRates[currency];
    return Math.round(satsEquivalent).toLocaleString();
  };

  const handleProceed = () => {
    if (!destination || !amount) {
      Alert.alert('Required Fields', 'Please fill in Destination and Amount to continue');
      return;
    }
    console.log('Proceeding with:', { destination, amount, currency, note });
    router.push('/(tabs)/select-wallet');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-6">
        <Pressable onPress={handleBack} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </Pressable>
        <Text className="text-xl font-inter font-medium text-white tracking-tight">
          Send Gift token
        </Text>
        <View className="w-6 h-6 opacity-0">
          <Feather name="calendar" size={24} color="#666666" />
        </View>
      </View>

      {/* Instruction Text */}
      <View className="px-5 mt-6">
        <Text className="text-sm font-inter text-[#FAFAFA] tracking-tight">
          Input the amount you want to send.
        </Text>
      </View>

      {/* Form Fields */}
      <View className="px-5 mt-4 gap-4">
        {/* Destination */}
        <View className="gap-2.5">
          <Text className="text-sm font-inter text-white" style={{ fontWeight: '500' }}>
            Destination
          </Text>
          <View className="flex-row justify-between items-center px-4 py-4 border border-[#FF99BC] rounded-lg">
            <TextInput
              className="flex-1 text-sm font-inter text-white"
              style={{ fontWeight: '500' }}
              placeholder="Sarahabraham@blink.sv"
              placeholderTextColor="#FAFAFA"
              value={destination}
              onChangeText={setDestination}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View className="flex-row gap-2">
              <Pressable onPress={handleScanQR}>
                <Feather name="maximize" size={16} color="#FAFAFA" />
              </Pressable>
              <Pressable onPress={handlePaste}>
                <Feather name="copy" size={16} color="#FAFAFA" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View className="gap-2.5 relative z-10">
          <Text className="text-sm font-inter text-white" style={{ fontWeight: '500' }}>
            Amount
          </Text>
          <View className="flex-row items-center px-4 py-4 border border-[#FF99BC] rounded-lg gap-4">
            <Pressable
              onPress={toggleCurrency}
              className="flex-row items-center gap-1 px-3 py-1.5 bg-[#FF669A] rounded"
            >
              <Text className="text-sm font-inter text-white font-semibold">
                {currency}
              </Text>
              <Feather name="chevron-down" size={14} color="#FFFFFF" />
            </Pressable>
            <TextInput
              className="flex-1 text-sm font-inter text-white"
              style={{ fontWeight: '500' }}
              placeholder="10.00"
              placeholderTextColor="#FAFAFA"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Currency Dropdown */}
          {showCurrencyDropdown && (
            <View className="absolute top-[75px] left-0 right-0 bg-[#FF669A] rounded-lg border-2 border-[#FF99BC] overflow-hidden shadow-lg z-20">
              <Pressable
                onPress={() => selectCurrency('USD')}
                className="px-4 py-3 border-b border-[#FF99BC] active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">USD</Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">US Dollar</Text>
                  </View>
                  {currency === 'USD' && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => selectCurrency('EUR')}
                className="px-4 py-3 border-b border-[#FF99BC] active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">EUR</Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">Euro</Text>
                  </View>
                  {currency === 'EUR' && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => selectCurrency('KES')}
                className="px-4 py-3 border-b border-[#FF99BC] active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">KES</Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">Kenyan Shilling</Text>
                  </View>
                  {currency === 'KES' && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
              <Pressable
                onPress={() => selectCurrency('NGN')}
                className="px-4 py-3 active:bg-[#FF4081]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-inter font-semibold text-base">NGN</Text>
                    <Text className="text-white/80 font-inter text-xs mt-0.5">Nigerian Naira</Text>
                  </View>
                  {currency === 'NGN' && (
                    <Feather name="check-circle" size={18} color="#4DC721" />
                  )}
                </View>
              </Pressable>
            </View>
          )}

          {/* SATS Conversion Display */}
          {amount && parseFloat(amount) > 0 && (
            <View className="mt-2 px-2">
              <Text className="text-[10px] font-inter font-medium text-[#EFEFEF] leading-[14px]">
                {currency} {amount} ≈ {calculateSatsEquivalent()} SATS
              </Text>
            </View>
          )}
        </View>

        {/* Note */}
        <View className="gap-2.5">
          <Text className="text-sm font-inter text-white" style={{ fontWeight: '500' }}>
            Note
          </Text>
          <View className="flex-row items-center px-4 py-4 border border-[#FF99BC] rounded-lg">
            <TextInput
              className="flex-1 text-sm font-inter text-[#FAFAFA]"
              style={{ fontWeight: '500' }}
              placeholder="For flowers"
              placeholderTextColor="#FAFAFA"
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="flex-1" />
      <View className="items-center pb-0" style={{ paddingBottom: insets.bottom }}>
        <Pressable
          onPress={handleProceed}
          className="w-[250px] py-4 bg-[#FF82AD] rounded-full items-center justify-center active:opacity-80 border-[0.5px] border-[#FF669A] mb-5"
        >
          <Text className="text-white font-inter font-medium text-[15px]">
            Proceed
          </Text>
        </Pressable>
        <View className="w-full h-[34px] bg-[#FF3378] items-center justify-center">
          <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
        </View>
      </View>
    </View>
  );
}
