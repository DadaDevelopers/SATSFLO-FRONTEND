import { api } from '@/lib/api';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MOOD_LABEL: Record<string, string> = {
  inlove: 'In love', peaceful: 'Peaceful', lonely: 'Lonely', angry: 'Angry',
  normal: 'Normal', happy: 'Happy', calm: 'Calm', hyped: 'Hyped',
};

interface EntryDetail {
  id: string;
  date: string;
  title?: string;
  content?: string;
  mood?: string;
  symptoms?: string[];
  images?: string[];
  cycle_day?: number;
}

export default function ViewEntryScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<EntryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchEntry = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) { setError('Session expired.'); setLoading(false); return; }
        const { response, data } = await api.get(`/journal/${id}`, token);
        if (cancelled) return;
        if (!response.ok) { setError('Could not load entry.'); return; }
        const e = data?.data ?? data;
        setEntry(e);
      } catch {
        if (!cancelled) setError('Unable to load entry. Check your connection.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEntry();
    return () => { cancelled = true; };
  }, [id]);

  const dateStr = (entry?.date ?? '').split('T')[0];
  const entryDate = dateStr ? new Date(dateStr + 'T00:00:00') : null;
  const dateLabel = entryDate
    ? `${MONTHS[entryDate.getMonth()]} ${entryDate.getDate()}${entry?.cycle_day ? `, Cycle Day ${entry.cycle_day}` : ''}`
    : '';
  const moodLabel = entry?.mood ? (MOOD_LABEL[entry.mood] ?? entry.mood) : '';

  return (
    <View className="flex-1" style={{ backgroundColor: '#FF4081', paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View className="flex-row items-center px-5 h-14">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="p-1">
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text
          className="flex-1 text-center text-white font-medium text-xl"
          style={{ fontFamily: 'Inter' }}
          numberOfLines={1}
        >
          {entry?.title || 'Journal Entry'}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-base text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 px-6 py-2.5 bg-white/20 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-medium">Go back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: '#FFE6EE', borderRadius: 16, padding: 16, gap: 16 }}>

            {/* Title */}
            <Text style={{ fontFamily: 'Inter', fontWeight: '600', fontSize: 18, lineHeight: 26, color: '#1E1E1E' }}>
              {entry?.title || 'Untitled'}
            </Text>

            {/* Date */}
            {dateLabel ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="calendar" size={16} color="#0134E4" />
                <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 14, color: '#1E1E1E' }}>
                  {dateLabel}
                </Text>
              </View>
            ) : null}

            {/* Mood */}
            {moodLabel ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="smile" size={16} color="#FFBA00" />
                <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 14, color: '#1E1E1E' }}>
                  Mood: {moodLabel}
                </Text>
              </View>
            ) : null}

            {/* Symptoms / Tags */}
            {entry?.symptoms && entry.symptoms.length > 0 ? (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Feather name="tag" size={16} color="#F43B3B" />
                  <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 14, color: '#1E1E1E' }}>
                    Tags
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {entry.symptoms.map((tag, i) => (
                    <View
                      key={i}
                      style={{ backgroundColor: '#FFCCDD', borderWidth: 0.5, borderColor: '#FFB3CD', borderRadius: 1000, paddingHorizontal: 10, paddingVertical: 5 }}
                    >
                      <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 13, color: '#090909' }}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Notes */}
            {entry?.content ? (
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="file-text" size={16} color="#A63ED1" />
                  <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 14, color: '#1E1E1E' }}>
                    Notes
                  </Text>
                </View>
                <Text style={{ fontFamily: 'Inter', fontWeight: '400', fontSize: 14, lineHeight: 22, color: '#333333', paddingLeft: 24 }}>
                  {entry.content}
                </Text>
              </View>
            ) : null}

            {/* Images */}
            {entry?.images && entry.images.length > 0 ? (
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="image" size={16} color="#FF4081" />
                  <Text style={{ fontFamily: 'Inter', fontWeight: '500', fontSize: 14, color: '#1E1E1E' }}>
                    Uploaded Images
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 24 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {entry.images.map((uri, i) => (
                      <Image
                        key={i}
                        source={{ uri }}
                        style={{ width: 160, height: 160, borderRadius: 12, backgroundColor: '#FFCCDD' }}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}

          </View>
        </ScrollView>
      )}

      {/* Home indicator */}
      <View
        className="bg-[#FF3378] items-center justify-end pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 8) + 3 }}
      >
        <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
      </View>
    </View>
  );
}
