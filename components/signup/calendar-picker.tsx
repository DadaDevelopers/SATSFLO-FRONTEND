import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type CalendarPickerProps = {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  periodLength?: number;
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function CheckCircle({ color = '#888888' }: { color?: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
      <Path
        d="M9.35375 4.64625C9.40024 4.69269 9.43712 4.74783 9.46228 4.80853C9.48744 4.86923 9.5004 4.93429 9.5004 5C9.5004 5.06571 9.48744 5.13077 9.46228 5.19147C9.43712 5.25217 9.40024 5.30731 9.35375 5.35375L5.85375 8.85375C5.80732 8.90024 5.75217 8.93712 5.69147 8.96228C5.63077 8.98744 5.56571 9.00039 5.5 9.00039C5.4343 9.00039 5.36923 8.98744 5.30853 8.96228C5.24783 8.93712 5.19269 8.90024 5.14625 8.85375L3.64625 7.35375C3.55243 7.25993 3.49972 7.13268 3.49972 7C3.49972 6.86732 3.55243 6.74007 3.64625 6.64625C3.74007 6.55243 3.86732 6.49972 4 6.49972C4.13268 6.49972 4.25993 6.55243 4.35375 6.64625L5.5 7.79313L8.64625 4.64625C8.69269 4.59976 8.74783 4.56288 8.80853 4.53772C8.86923 4.51256 8.93429 4.49961 9 4.49961C9.06571 4.49961 9.13077 4.51256 9.19147 4.53772C9.25217 4.56288 9.30732 4.59976 9.35375 4.64625Z"
        fill={color}
      />
    </Svg>
  );
}

function ChevronLeft() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke="#666666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6L15 12L9 18" stroke="#666666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  periodLength = 4,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) weeks.push(calendarDays.slice(i, i + 7));

  const goToPreviousMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const handleDatePress = (day: number) => onDateSelect(new Date(year, month, day));

  const isSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const isPeriodDay = (day: number) => {
    if (!selectedDate) return false;
    const diff = Math.floor(
      (new Date(year, month, day).getTime() - selectedDate.getTime()) / 86400000
    );
    return diff > 0 && diff <= periodLength;
  };

  return (
    <View className="bg-[#FFE6EE] border border-[#FF0057] rounded-2xl p-3 w-full">
      {/* Month Header */}
      <View className="flex-row justify-between items-center px-[10px] py-[9px]">
        <TouchableOpacity
          onPress={goToPreviousMonth}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft />
        </TouchableOpacity>
        <Text
          className="font-inter"
          style={{ fontSize: 25, fontWeight: '400', lineHeight: 30, color: '#090909' }}
        >
          {MONTHS[month]}
        </Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronRight />
        </TouchableOpacity>
      </View>

      {/* Day Headers Row */}
      <View className="flex-row" style={{ paddingBottom: 5 }}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} className="flex-1 h-[44px] justify-center items-center">
            <Text
              className="font-inter"
              style={{ fontSize: 14, fontWeight: '400', lineHeight: 17, color: '#666666' }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Rows */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row" style={{ paddingVertical: 5 }}>
          {[...week, ...Array(7 - week.length).fill(null)].map((day, dayIndex) => (
            <View key={dayIndex} className="flex-1 h-[44px] justify-center items-center">
              {day !== null ? (
                <TouchableOpacity
                  className="flex-1 w-full justify-center items-center"
                  style={{ gap: 2 }}
                  onPress={() => handleDatePress(day)}
                  activeOpacity={0.7}
                >
                  {/* Date number */}
                  <Text
                    className="font-inter"
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      lineHeight: 17,
                      color: isSelected(day) || isPeriodDay(day) ? '#FF4081' : '#1E1E1E',
                    }}
                  >
                    {day}
                  </Text>
                  {/* Check circle indicator */}
                  <CheckCircle color={isSelected(day) || isPeriodDay(day) ? '#FF4081' : '#888888'} />
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
