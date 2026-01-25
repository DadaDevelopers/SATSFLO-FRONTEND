import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';

type CalendarPickerProps = {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  periodLength?: number;
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarPicker({
  selectedDate,
  onDateSelect,
  periodLength = 4,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar days
  const calendarDays: (number | null)[] = [];

  // Add empty slots for days before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDatePress = (day: number) => {
    const newDate = new Date(year, month, day);
    onDateSelect(newDate);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isPeriodDay = (day: number) => {
    if (!selectedDate) return false;
    const dayDate = new Date(year, month, day);
    const selectedTime = selectedDate.getTime();
    const dayTime = dayDate.getTime();
    const diffDays = Math.floor((dayTime - selectedTime) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= periodLength;
  };

  // Split days into weeks
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View className="bg-[#FFF0F5] rounded-2xl p-3 border-[0.5px] border-signup-input-border w-full">
      {/* Month Header */}
      <View className="flex-row justify-between items-center mb-3 px-2">
        <TouchableOpacity
          onPress={goToPreviousMonth}
          className="p-2 -ml-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-lg font-semibold text-[#333333]">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-[#333333]">{MONTHS[month]}</Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          className="p-2 -mr-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-lg font-semibold text-[#333333]">{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View className="flex-row mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} className="flex-1 items-center py-1">
            <Text className="text-[11px] font-medium text-[#666666]">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="gap-0.5">
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row">
            {week.map((day, dayIndex) => (
              <View key={dayIndex} className="flex-1 items-center py-0.5">
                {day !== null ? (
                  <TouchableOpacity
                    className="items-center w-full"
                    onPress={() => handleDatePress(day)}
                    activeOpacity={0.7}
                  >
                    <View
                      className={cn(
                        'w-8 h-8 rounded-full justify-center items-center',
                        isSelected(day) && 'bg-signup-bg'
                      )}
                    >
                      <Text
                        className={cn(
                          'text-[13px] font-medium text-[#333333]',
                          isSelected(day) && 'text-white font-semibold',
                          isPeriodDay(day) && 'text-signup-bg font-semibold'
                        )}
                      >
                        {day}
                      </Text>
                    </View>
                    {/* Indicator dot below the date */}
                    <View className="h-1.5 justify-center items-center">
                      {isPeriodDay(day) ? (
                        <View className="w-1 h-1 rounded-full bg-signup-bg" />
                      ) : isSelected(day) ? null : (
                        <View className="w-1 h-1 rounded-full border border-[#CCCCCC]" />
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View className="w-8 h-[38px]" />
                )}
              </View>
            ))}
            {/* Fill remaining cells if week is incomplete */}
            {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
              <View key={`empty-${i}`} className="flex-1 items-center py-0.5">
                <View className="w-8 h-[38px]" />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
