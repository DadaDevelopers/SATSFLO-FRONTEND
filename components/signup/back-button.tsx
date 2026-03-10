import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

type BackButtonProps = {
  onPress?: () => void;
  color?: string;
};

export function BackButton({ onPress, color = '#FFFFFF' }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      className="w-10 h-10 justify-center items-center -ml-2"
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3.21938 11.4694L9.96937 4.71945C10.1101 4.57871 10.301 4.49965 10.5 4.49965C10.699 4.49965 10.8899 4.57871 11.0306 4.71945C11.1714 4.86018 11.2504 5.05105 11.2504 5.25007C11.2504 5.44909 11.1714 5.63997 11.0306 5.7807L5.56031 11.2501L20.25 11.2501C20.4489 11.2501 20.6397 11.3291 20.7803 11.4697C20.921 11.6104 21 11.8012 21 12.0001C21 12.199 20.921 12.3897 20.7803 12.5304C20.6397 12.6711 20.4489 12.7501 20.25 12.7501L5.56031 12.7501L11.0306 18.2194C11.1714 18.3602 11.2504 18.551 11.2504 18.7501C11.2504 18.9491 11.1714 19.14 11.0306 19.2807C10.8899 19.4214 10.699 19.5005 10.5 19.5005C10.301 19.5005 10.1101 19.4214 9.96937 19.2807L3.21938 12.5307C3.14964 12.461 3.09432 12.3783 3.05658 12.2873C3.01884 12.1962 2.99941 12.0986 2.99941 12.0001C2.99941 11.9015 3.01884 11.8039 3.05658 11.7129C3.09432 11.6218 3.14964 11.5391 3.21938 11.4694Z"
          fill={color}
        />
      </Svg>
    </TouchableOpacity>
  );
}
