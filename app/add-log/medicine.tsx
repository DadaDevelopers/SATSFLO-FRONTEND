import React from 'react';
import { Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';

type Medicine = 'condom' | 'pill' | 'patch' | 'iud' | 'implant' | 'vRing' | 'injection' | 'spermicide';

const MEDICINE_IMAGES: Record<Medicine, ReturnType<typeof require>> = {
  condom:     require('@/assets/images/condom.png'),
  pill:       require('@/assets/images/pill.png'),
  patch:      require('@/assets/images/patch.png'),
  iud:        require('@/assets/images/IUD.png'),
  implant:    require('@/assets/images/implant.png'),
  vRing:      require('@/assets/images/V-ring.png'),
  injection:  require('@/assets/images/injection.png'),
  spermicide: require('@/assets/images/spermicide.png'),
};

const MedicineIcon = ({ type }: { type: string; color: string }) => {
  const source = MEDICINE_IMAGES[type as Medicine];
  if (!source) return null;
  return <Image source={source} style={{ width: 44, height: 44 }} resizeMode="contain" />;
};

const MEDICINES: { id: Medicine; label: string }[] = [
  { id: 'condom', label: 'Condom' },
  { id: 'pill', label: 'Pill' },
  { id: 'patch', label: 'Patch' },
  { id: 'iud', label: 'IUD' },
  { id: 'implant', label: 'Implant' },
  { id: 'vRing', label: 'V-Ring' },
  { id: 'injection', label: 'Injection' },
  { id: 'spermicide', label: 'Spermicide' },
];

export default function MedicineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, toggleMedicine } = useAddLog();
  const dayData = getCurrentDayData();

  const handleSave = () => {
    router.back();
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: outerBackgroundColor,
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View className="flex-1" style={containerStyle}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3.21938 11.4694L9.96937 4.71945C10.1101 4.57871 10.301 4.49965 10.5 4.49965C10.699 4.49965 10.8899 4.57871 11.0306 4.71945C11.1714 4.86018 11.2504 5.05105 11.2504 5.25007C11.2504 5.44909 11.1714 5.63997 11.0306 5.7807L5.56031 11.2501L20.25 11.2501C20.4489 11.2501 20.6397 11.3291 20.7803 11.4697C20.921 11.6104 21 11.8012 21 12.0001C21 12.199 20.921 12.3897 20.7803 12.5304C20.6397 12.6711 20.4489 12.7501 20.25 12.7501L5.56031 12.7501L11.0306 18.2194C11.1714 18.3602 11.2504 18.551 11.2504 18.7501C11.2504 18.9491 11.1714 19.14 11.0306 19.2807C10.8899 19.4214 10.699 19.5005 10.5 19.5005C10.301 19.5005 10.1101 19.4214 9.96937 19.2807L3.21938 12.5307C3.14964 12.461 3.09432 12.3783 3.05658 12.2873C3.01884 12.1962 2.99941 12.0986 2.99941 12.0001C2.99941 11.9015 3.01884 11.8039 3.05658 11.7129C3.09432 11.6218 3.14964 11.5391 3.21938 11.4694Z"
                fill="white"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-10">
            Medicine
          </Text>
        </View>

        {/* Medicine Grid */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="bg-pink-100 rounded-3xl p-4">
            <View className="flex-row flex-wrap">
              {MEDICINES.map((medicine) => {
                const isSelected = dayData.medicine.includes(medicine.id);
                return (
                  <TouchableOpacity
                    key={medicine.id}
                    onPress={() => toggleMedicine(medicine.id)}
                    className="w-1/4 items-center mb-4"
                  >
                    <View className="w-14 h-14 items-center justify-center">
                      <MedicineIcon
                        type={medicine.id}
                        color={isSelected ? '#EC4899' : '#666'}
                      />
                    </View>
                    <Text
                      className={`text-xs mt-1 text-center ${
                        isSelected ? 'text-pink-500 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {medicine.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              width: 250,
              height: 56,
              backgroundColor: '#FF82AD',
              borderWidth: 0.5,
              borderColor: '#FF669A',
              borderRadius: 1000,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontWeight: '500',
                fontSize: 15,
                lineHeight: 18,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Save
            </Text>
          </TouchableOpacity>

          {/* Home indicator strip */}
          <View
            style={{
              width: '100%',
              height: 34 + (isDesktop ? 0 : insets.bottom),
              backgroundColor: '#FF3378',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: 134,
                height: 5,
                backgroundColor: '#FF99BC',
                borderRadius: 100,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
