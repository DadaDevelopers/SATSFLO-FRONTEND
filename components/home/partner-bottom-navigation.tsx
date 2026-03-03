import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type TabName = 'home' | 'calendar' | 'settings';

interface PartnerBottomNavigationProps {
    activeTab: TabName;
    onTabPress: (tab: TabName) => void;
}

function HouseIcon({ color }: { color: string }) {
    return (
        <Svg width={24} height={24} viewBox="0 0 20 20" fill="none">
            <Path
                d="M2.5 8.33333L10 2.5L17.5 8.33333V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V8.33333Z"
                fill={color}
            />
        </Svg>
    );
}

function SettingsIcon({ color }: { color: string }) {
    return (
        <Feather name="settings" size={24} color={color} />
    );
}

function TabItem({ icon, label, isActive, onPress }: { icon: React.ReactNode, label: string, isActive: boolean, onPress: () => void }) {
    const color = isActive ? '#FF4081' : '#9E9E9E';

    return (
        <TouchableOpacity
            onPress={onPress}
            className="items-center justify-center px-4 py-2 gap-1 flex-1"
            activeOpacity={0.7}
        >
            {icon}
            <Text
                className="text-[10px] font-medium text-center tracking-tight"
                style={{ color }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export function PartnerBottomNavigation({ activeTab, onTabPress }: PartnerBottomNavigationProps) {
    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8;

    const getIconColor = (tab: TabName) => activeTab === tab ? '#FF4081' : '#9E9E9E';

    return (
        <View className="bg-[#1C0625]" style={{ borderTopWidth: 1, borderTopColor: '#2C1B3A' }}>
            <View className="flex-row justify-between items-center px-6 py-2">
                {/* Home */}
                <TabItem
                    icon={<HouseIcon color={getIconColor('home')} />}
                    label="Home"
                    isActive={activeTab === 'home'}
                    onPress={() => onTabPress('home')}
                />

                {/* Calendar */}
                <TabItem
                    icon={<Feather name="calendar" size={24} color={getIconColor('calendar')} />}
                    label="Calendar"
                    isActive={activeTab === 'calendar'}
                    onPress={() => onTabPress('calendar')}
                />

                {/* Settings */}
                <TabItem
                    icon={<SettingsIcon color={getIconColor('settings')} />}
                    label="Settings"
                    isActive={activeTab === 'settings'}
                    onPress={() => onTabPress('settings')}
                />
            </View>

            {/* Home Indicator line at bottom */}
            <View
                className="items-center justify-end"
                style={{ paddingBottom: bottomPadding, paddingTop: 4, backgroundColor: '#1C0625' }}
            >
                <View className="w-[134px] h-[5px] bg-[#3E215D] rounded-full" />
            </View>
        </View>
    );
}
