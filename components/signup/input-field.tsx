import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
        className={cn('flex-1 text-sm font-medium leading-5 text-[#090909] p-0', className)}
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
          <Feather
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={20}
            color="#666666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
