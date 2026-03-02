import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAddLog } from '@/context/add-log-context';
import { useResponsive } from '@/hooks/use-responsive';
import {
  SymptomCramps,
  SymptomFatigue,
  SymptomBloating,
  SymptomHeadache,
  SymptomBellyAches,
  SymptomAcne,
  SymptomSoreBreasts,
  SymptomCravings,
} from '@/components/add-log/icons';

type Symptom = 'cramps' | 'fatigue' | 'bloating' | 'headache' | 'bellyAches' | 'acne' | 'soreBreasts' | 'cravings';

const SYMPTOMS: { id: Symptom; label: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
  { id: 'cramps',      label: 'Cramps',       Icon: SymptomCramps },
  { id: 'fatigue',     label: 'Fatigue',      Icon: SymptomFatigue },
  { id: 'bloating',    label: 'Bloating',     Icon: SymptomBloating },
  { id: 'headache',    label: 'Headache',     Icon: SymptomHeadache },
  { id: 'bellyAches',  label: 'Belly aches',  Icon: SymptomBellyAches },
  { id: 'acne',        label: 'Acne',         Icon: SymptomAcne },
  { id: 'soreBreasts', label: 'Sore breasts', Icon: SymptomSoreBreasts },
  { id: 'cravings',    label: 'Cravings',     Icon: SymptomCravings },
];

// 4 items per row — matches Figma Frame 170/171 layout (gap: 40px, width: 320px)
const ROWS = [SYMPTOMS.slice(0, 4), SYMPTOMS.slice(4, 8)];

export default function SymptomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, toggleSymptom } = useAddLog();
  const dayData = getCurrentDayData();

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

        {/* Header — Frame 133: top 87px, height 24px */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 28,
            marginHorizontal: 20,
            height: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 24, height: 20, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.7}
          >
            <Svg width={18} height={15} viewBox="0 0 18 15" fill="none">
              <Path
                d="M0.219376 6.96993L6.96937 0.219934C7.11011 0.0792027 7.30098 0.000141144 7.5 0.000141144C7.69902 0.000141144 7.88989 0.0792027 8.03063 0.219934C8.17136 0.360664 8.25042 0.551536 8.25042 0.750559C8.25042 0.949582 8.17136 1.14045 8.03063 1.28118L2.56031 6.75056L17.25 6.75056C17.4489 6.75056 17.6397 6.82958 17.7803 6.97023C17.921 7.11088 18 7.30165 18 7.50056C18 7.69947 17.921 7.89024 17.7803 8.03089C17.6397 8.17154 17.4489 8.25056 17.25 8.25056L2.56031 8.25056L8.03063 13.7199C8.17136 13.8607 8.25042 14.0515 8.25042 14.2506C8.25042 14.4496 8.17136 14.6405 8.03063 14.7812C7.88989 14.9219 7.69902 15.001 7.5 15.001C7.30098 15.001 7.11011 14.9219 6.96937 14.7812L0.219376 8.03119C0.149643 7.96153 0.0943222 7.87881 0.0565796 7.78776C0.018837 7.69672 -0.000589371 7.59912 -0.000589371 7.50056C-0.000589371 7.402 0.018837 7.3044 0.0565796 7.21335C0.0943222 7.12231 0.149643 7.03959 0.219376 6.96993Z"
                fill="#FAFAFA"
              />
            </Svg>
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'Inter',
                fontWeight: '500',
                fontSize: 20,
                lineHeight: 24,
                letterSpacing: -0.3,
                color: '#FFFFFF',
              }}
            >
              Symptoms
            </Text>
          </View>

          {/* Spacer to balance back arrow */}
          <View style={{ width: 24 }} />
        </View>

        {/* Scrollable content area */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Symptoms card — Frame 174
              background: #FFE6EE, border-radius: 16px, padding: 16px, gap: 25px
              top: 131px → marginTop: 20px below header (87 + 24 header + 20 gap = 131) */}
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 20,
              backgroundColor: '#FFE6EE',
              borderRadius: 16,
              padding: 16,
              gap: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {ROWS.map((row, rowIndex) => (
              /* Frame 170 / 171: flex-row, gap: 40px, width: 320px, height: 69px */
              <View
                key={rowIndex}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 40,
                  width: 320,
                  height: 69,
                }}
              >
                {row.map(({ id, label, Icon }) => {
                  const isSelected = dayData.symptoms.includes(id);
                  return (
                    /* Frame 166–169: flex-col, gap: 4px, width: 50px, height: 69px */
                    <TouchableOpacity
                      key={id}
                      onPress={() => toggleSymptom(id)}
                      style={{
                        alignItems: 'center',
                        gap: 4,
                        width: 50,
                        height: 69,
                      }}
                      activeOpacity={0.75}
                    >
                      {/* Frame 165: 50×50, #FFCCDD, border-radius: 1000px */}
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 1000,
                          backgroundColor: isSelected ? '#FF82AD' : '#FFCCDD',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon
                          size={24}
                          color={isSelected ? '#FFFFFF' : '#FF6B9D'}
                        />
                      </View>

                      {/* Label: Inter 400, 12px, #1E1E1E */}
                      <Text
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          fontSize: 12,
                          lineHeight: 15,
                          color: '#1E1E1E',
                          textAlign: 'center',
                        }}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom section — Frame 116: column, align-items center, gap 20px, height 110px */}
        <View style={{ alignItems: 'center' }}>

          {/* Save button — Buttonss: 250×56, #FF82AD, border #FF669A, radius 1000px */}
          <TouchableOpacity
            onPress={() => router.back()}
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

          {/* Home indicator strip — #FF3378, height 34px + insets */}
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
            {/* Home Indicator pill: 134×5, #FF99BC */}
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
