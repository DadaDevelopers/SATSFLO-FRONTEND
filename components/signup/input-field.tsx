import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

type InputFieldProps = TextInputProps & {
  showPasswordToggle?: boolean;
  containerClassName?: string;
};

export function InputField({
  showPasswordToggle = false,
  secureTextEntry,
  className,
  containerClassName,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      className={cn(
        'flex-row items-center bg-signup-input-bg border-[0.5px] border-signup-input-border rounded-input px-4 py-[19px] w-full h-[58px]',
        containerClassName
      )}
    >
      <TextInput
        className={cn('flex-1 text-sm font-medium leading-5 text-[#333333] p-0', className)}
        placeholderTextColor="#666666"
        secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
        {...props}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          className="p-1"
          onPress={togglePasswordVisibility}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <EyeIcon visible={isPasswordVisible} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <View className="w-5 h-5 justify-center items-center">
      {/* Eye shape */}
      <View
        className={cn(
          'w-[18px] h-3 border-[1.5px] border-signup-placeholder rounded-[9px] justify-center items-center',
          visible && 'border-[#333333]'
        )}
      >
        <View className="w-1.5 h-1.5 rounded-[3px] bg-signup-placeholder" />
      </View>
      {/* Strike through line when hidden */}
      {!visible && (
        <View
          className="absolute w-[22px] h-[1.5px] bg-signup-placeholder"
          style={{ transform: [{ rotate: '45deg' }] }}
        />
      )}
    </View>
  );
}
