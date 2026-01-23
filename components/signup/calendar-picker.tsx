import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SignupColors } from '@/constants/signup-theme';

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
  const { width } = useWindowDimensions();
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Calculate responsive sizes
  const calendarWidth = Math.min(width - 40, 353); // Max 353px, with 20px padding on each side
  const cellSize = Math.floor((calendarWidth - 32) / 7); // Account for padding

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
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={styles.navButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.navArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{MONTHS[month]}</Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          style={styles.navButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.navArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeaders}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={[styles.dayHeaderCell, { width: cellSize }]}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => (
              <View key={dayIndex} style={[styles.dayCell, { width: cellSize }]}>
                {day !== null ? (
                  <TouchableOpacity
                    style={styles.dayButton}
                    onPress={() => handleDatePress(day)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.dayCircle,
                      isSelected(day) && styles.selectedDayCircle,
                    ]}>
                      <Text style={[
                        styles.dayText,
                        isSelected(day) && styles.selectedDayText,
                        isPeriodDay(day) && styles.periodDayText,
                      ]}>
                        {day}
                      </Text>
                    </View>
                    {/* Indicator dot below the date */}
                    <View style={styles.indicatorContainer}>
                      {isPeriodDay(day) ? (
                        <View style={styles.periodIndicator} />
                      ) : isSelected(day) ? null : (
                        <View style={styles.normalIndicator} />
                      )}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.emptyDay} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 0.5,
    borderColor: SignupColors.inputBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    padding: 8,
  },
  navArrow: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderCell: {
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  calendarGrid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayButton: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCircle: {
    backgroundColor: SignupColors.background,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  periodDayText: {
    color: SignupColors.background,
    fontWeight: '600',
  },
  indicatorContainer: {
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  periodIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: SignupColors.background,
  },
  normalIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  emptyDay: {
    width: 28,
    height: 35,
  },
});
