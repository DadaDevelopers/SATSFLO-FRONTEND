import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type TabName = 'home' | 'calendar' | 'add' | 'chat' | 'settings';

interface BottomNavigationProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

function HouseIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.5 8.33333L10 2.5L17.5 8.33333V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V8.33333Z"
        fill={color}
      />
    </Svg>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        fill={color}
      />
      <Path
        d="M16.1917 12.3333C16.0856 12.5706 16.0514 12.8333 16.0932 13.0895C16.135 13.3458 16.2509 13.5843 16.4267 13.775L16.4767 13.825C16.6175 13.9657 16.7292 14.1327 16.8053 14.3163C16.8815 14.4999 16.9207 14.6965 16.9207 14.895C16.9207 15.0935 16.8815 15.2901 16.8053 15.4737C16.7292 15.6573 16.6175 15.8243 16.4767 15.965C16.3361 16.1058 16.1691 16.2175 15.9855 16.2937C15.8019 16.3698 15.6052 16.409 15.4067 16.409C15.2082 16.409 15.0116 16.3698 14.828 16.2937C14.6444 16.2175 14.4774 16.1058 14.3367 15.965L14.2867 15.915C14.0959 15.7392 13.8575 15.6233 13.6012 15.5815C13.3449 15.5397 13.0822 15.5739 12.845 15.68C12.6122 15.7813 12.4133 15.9459 12.2701 16.1553C12.1269 16.3647 12.0453 16.6103 12.035 16.8642V17.0833C12.035 17.4833 11.8762 17.8669 11.5937 18.1495C11.3111 18.432 10.9275 18.5908 10.5275 18.5908C10.1275 18.5908 9.74386 18.432 9.46131 18.1495C9.17876 17.8669 9.02 17.4833 9.02 17.0833V16.9667C9.00451 16.7055 8.91427 16.4545 8.75963 16.2439C8.605 16.0333 8.39249 15.8716 8.14667 15.7783C7.90944 15.6722 7.64676 15.638 7.39047 15.6799C7.13418 15.7217 6.89575 15.8376 6.705 16.0133L6.655 16.0633C6.51431 16.2042 6.34731 16.3158 6.1637 16.392C5.9801 16.4682 5.78347 16.5073 5.585 16.5073C5.38653 16.5073 5.1899 16.4682 5.0063 16.392C4.82269 16.3158 4.65569 16.2042 4.515 16.0633C4.37415 15.9226 4.26252 15.7556 4.18636 15.572C4.1102 15.3884 4.07102 15.1918 4.07102 14.9933C4.07102 14.7948 4.1102 14.5982 4.18636 14.4146C4.26252 14.231 4.37415 14.064 4.515 13.9233L4.565 13.8733C4.74076 13.6826 4.85672 13.4441 4.89853 13.1879C4.94034 12.9316 4.90613 12.6689 4.8 12.4317C4.69873 12.1988 4.53407 12 4.32468 11.8568C4.11529 11.7136 3.86968 11.632 3.61583 11.6217H3.39667C2.99667 11.6217 2.61304 11.4629 2.33048 11.1803C2.04793 10.8978 1.88917 10.5142 1.88917 10.1142C1.88917 9.71417 2.04793 9.33055 2.33048 9.04799C2.61304 8.76544 2.99667 8.60667 3.39667 8.60667H3.51333C3.77455 8.59118 4.0255 8.50094 4.23612 8.34631C4.44673 8.19167 4.60844 7.97916 4.70167 7.73333C4.80779 7.49611 4.84201 7.23343 4.8002 6.97714C4.75839 6.72084 4.64242 6.48242 4.46667 6.29167L4.41667 6.24167C4.27582 6.10097 4.16419 5.93398 4.08803 5.75037C4.01187 5.56677 3.97268 5.37013 3.97268 5.17167C3.97268 4.9732 4.01187 4.77656 4.08803 4.59296C4.16419 4.40935 4.27582 4.24236 4.41667 4.10167C4.55736 3.96082 4.72435 3.84919 4.90796 3.77303C5.09157 3.69687 5.2882 3.65768 5.48667 3.65768C5.68513 3.65768 5.88177 3.69687 6.06538 3.77303C6.24898 3.84919 6.41598 3.96082 6.55667 4.10167L6.60667 4.15167C6.79742 4.32742 7.03584 4.44339 7.29213 4.4852C7.54843 4.52701 7.81111 4.49279 8.04833 4.38667H8.14667C8.37951 4.2854 8.57845 4.12074 8.72163 3.91135C8.86481 3.70196 8.94637 3.45635 8.95667 3.2025V2.91667C8.95667 2.51667 9.11543 2.13304 9.39799 1.85049C9.68054 1.56793 10.0642 1.40917 10.4642 1.40917C10.8642 1.40917 11.2478 1.56793 11.5303 1.85049C11.8129 2.13304 11.9717 2.51667 11.9717 2.91667V3.03333C11.982 3.28718 12.0635 3.53279 12.2067 3.74218C12.3499 3.95157 12.5488 4.11623 12.7817 4.2175C13.0189 4.32362 13.2816 4.35784 13.5379 4.31603C13.7942 4.27422 14.0326 4.15825 14.2233 3.9825L14.2733 3.9325C14.414 3.79165 14.581 3.68002 14.7646 3.60386C14.9482 3.5277 15.1449 3.48851 15.3433 3.48851C15.5418 3.48851 15.7384 3.5277 15.922 3.60386C16.1056 3.68002 16.2726 3.79165 16.4133 3.9325C16.5542 4.07319 16.6658 4.24019 16.742 4.4238C16.8181 4.6074 16.8573 4.80403 16.8573 5.0025C16.8573 5.20097 16.8181 5.3976 16.742 5.5812C16.6658 5.76481 16.5542 5.93181 16.4133 6.0725L16.3633 6.1225C16.1876 6.31325 16.0716 6.55167 16.0298 6.80796C15.988 7.06426 16.0222 7.32694 16.1283 7.56417V7.66667C16.2296 7.89951 16.3943 8.09845 16.6037 8.24163C16.8131 8.38481 17.0587 8.46637 17.3125 8.47667H17.5317C17.9317 8.47667 18.3153 8.63543 18.5978 8.91799C18.8804 9.20054 19.0392 9.58417 19.0392 9.98417C19.0392 10.3842 18.8804 10.7678 18.5978 11.0503C18.3153 11.3329 17.9317 11.4917 17.5317 11.4917H17.415C17.1612 11.502 16.9156 11.5835 16.7062 11.7267C16.4968 11.8699 16.3321 12.0688 16.2308 12.3017"
        fill={color}
      />
    </Svg>
  );
}

interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabItem({ icon, label, isActive, onPress }: TabItemProps) {
  const color = isActive ? '#FFF0F5' : '#FF99BC';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-center px-2 py-1 gap-0.5"
      activeOpacity={0.7}
    >
      {icon}
      <Text
        className="text-[8px] font-medium text-center tracking-tight"
        style={{ color }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8;

  return (
    <View className="bg-home-nav-bg">
      <View className="flex-row justify-between items-center px-5 py-2">
        {/* Home */}
        <TabItem
          icon={<HouseIcon color={activeTab === 'home' ? '#FFF0F5' : '#FF99BC'} />}
          label="Home"
          isActive={activeTab === 'home'}
          onPress={() => onTabPress('home')}
        />

        {/* Calendar */}
        <TabItem
          icon={<Feather name="calendar" size={20} color={activeTab === 'calendar' ? '#FFF0F5' : '#FF99BC'} />}
          label="Calendar"
          isActive={activeTab === 'calendar'}
          onPress={() => onTabPress('calendar')}
        />

        {/* Center Add Button */}
        <TouchableOpacity
          onPress={() => onTabPress('add')}
          className="w-[60px] h-[60px] items-center justify-center rounded-full bg-home-center-btn -mt-6"
          activeOpacity={0.8}
        >
          <Feather name="plus" size={36} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Chat */}
        <TabItem
          icon={<Feather name="message-circle" size={20} color={activeTab === 'chat' ? '#FFF0F5' : '#FF99BC'} />}
          label="Chat"
          isActive={activeTab === 'chat'}
          onPress={() => onTabPress('chat')}
        />

        {/* Settings */}
        <TabItem
          icon={<SettingsIcon color={activeTab === 'settings' ? '#FFF0F5' : '#FF99BC'} />}
          label="Settings"
          isActive={activeTab === 'settings'}
          onPress={() => onTabPress('settings')}
        />
      </View>

      {/* Home Indicator */}
      <View
        className="items-center justify-end bg-home-nav-bg"
        style={{ paddingBottom: bottomPadding, paddingTop: 4 }}
      >
        <View className="w-[134px] h-[5px] bg-signup-home-indicator rounded-full" />
      </View>
    </View>
  );
}
